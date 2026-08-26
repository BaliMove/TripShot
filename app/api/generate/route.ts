import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import zlib from "zlib";
import { buildPrompt, getStyle, parseCustomFixPrompt, NO_TEXT_INSTRUCTION, type BgColor, type Gender } from "../../lib/styles";
import { buildPersonalizedLearningPrompt, type UserPreferences } from "../../lib/preferenceMemory";

export const runtime = "nodejs";
export const maxDuration = 60;

function createSolidPng(width: number, height: number, r: number, g: number, b: number): string {
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
    }
  }
  const compressed = zlib.deflateSync(rawData);

  function chunk(type: string, data: Buffer): Buffer {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type, "ascii");
    const crc = Buffer.alloc(4);
    const c = zlib.crc32(Buffer.concat([t, data]));
    crc.writeUInt32BE(c, 0);
    return Buffer.concat([len, t, data, crc]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const png = Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", compressed), chunk("IEND", Buffer.alloc(0))]);
  return png.toString("base64");
}

interface ModelSuccessResult {
  success: true;
  imageUrl: string;
  timeSec: string;
}

interface ModelErrorResult {
  success: false;
  error: string;
}

type ModelResult = ModelSuccessResult | ModelErrorResult;

function toUserMessage(err: unknown, fallback: string): string {
  const errMsg = err instanceof Error ? err.message : String(err);
  if (errMsg.includes("not found") || errMsg.includes("404")) {
    return "모델을 찾을 수 없습니다. API 키에 권한이 없거나 지원되지 않는 모델입니다. (404)";
  }
  if (errMsg.includes("quota") || errMsg.includes("429")) {
    return "API 호출 속도 한도 초과. 잠시 후 다시 시도해 주세요. (429)";
  }
  return fallback;
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
    const imageBase64: string | undefined = body.imageBase64;
    const customBgBase64: string | undefined = body.customBgBase64;
    const enhanceStyle: "subtle" | "vibrant" | undefined = body.enhanceStyle;
    const styleId: string = body.destination ?? body.styleId ?? body.style ?? "bali_swing";
    const bgColor: BgColor | undefined = body.bgColor;
    const rawCustomPrompt: string | undefined = body.customPrompt;
    const rawCustomFixPrompt: string | undefined = body.customFixPrompt;
    const previousImageUrl: string | undefined = body.previousImageUrl;
    const targetModel: "flash_lite" | "pro" | undefined = body.targetModel;
    const facePreserveMode: boolean = body.facePreserveMode !== false; // Default true for 100% face likeness
    const userPreferences: UserPreferences | undefined = body.userPreferences;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "셀카 사진을 먼저 업로드해 주세요." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "서버 설정 오류: API 키가 구성되지 않았습니다." },
        { status: 500 }
      );
    }

    // Parse Selfie Base64
    let rawSelfieBase64 = imageBase64;
    let selfieMime = "image/jpeg";
    const selfieMatch = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (selfieMatch && selfieMatch.length === 3) {
      selfieMime = selfieMatch[1];
      rawSelfieBase64 = selfieMatch[2];
    } else if (imageBase64.includes("base64,")) {
      rawSelfieBase64 = imageBase64.split("base64,")[1];
    }

    // Parse Custom Background Base64 if present
    let rawBgBase64: string | null = null;
    let bgMime = "image/jpeg";
    if (customBgBase64) {
      const bgMatch = customBgBase64.match(/^data:(image\/\w+);base64,(.+)$/);
      if (bgMatch && bgMatch.length === 3) {
        bgMime = bgMatch[1];
        rawBgBase64 = bgMatch[2];
      } else if (customBgBase64.includes("base64,")) {
        rawBgBase64 = customBgBase64.split("base64,")[1];
      }
    }

    // Parse Previous Image Base64 for Image-to-Image refinement (Data URL or Remote URL)
    let rawPrevImageBase64: string | null = null;
    let prevMime = "image/png";
    if (previousImageUrl) {
      const prevMatch = previousImageUrl.match(/^data:(image\/\w+);base64,(.+)$/);
      if (prevMatch && prevMatch.length === 3) {
        prevMime = prevMatch[1];
        rawPrevImageBase64 = prevMatch[2];
      } else if (previousImageUrl.includes("base64,")) {
        rawPrevImageBase64 = previousImageUrl.split("base64,")[1];
      } else if (previousImageUrl.startsWith("http://") || previousImageUrl.startsWith("https://")) {
        try {
          const fetchRes = await fetch(previousImageUrl);
          if (fetchRes.ok) {
            const arrayBuffer = await fetchRes.arrayBuffer();
            rawPrevImageBase64 = Buffer.from(arrayBuffer).toString("base64");
            const cType = fetchRes.headers.get("content-type");
            if (cType) prevMime = cType;
          }
        } catch (e) {
          console.warn("[API Route] Could not fetch previousImageUrl as binary buffer:", e);
        }
      }
    }

    const isIdStyle = ["id_photo", "passport", "student"].includes(styleId);

    // CRITICAL: For ID Photo styles, inject an authentic pristine solid color studio backdrop image as Image 2
    if (isIdStyle && !rawBgBase64) {
      if (bgColor === "blue") {
        rawBgBase64 = createSolidPng(600, 800, 235, 243, 252); // #EBF3FC (Light pastel cyan blue)
      } else if (bgColor === "gray") {
        rawBgBase64 = createSolidPng(600, 800, 242, 244, 248); // #F2F4F8 (Light neutral studio gray)
      } else {
        rawBgBase64 = createSolidPng(600, 800, 255, 255, 255); // #FFFFFF (Pure solid white)
      }
      bgMime = "image/png";
    }

    let prompt = "";
    if (customBgBase64) {
      const fixAddon = rawCustomFixPrompt ? ` User modification instruction: ${rawCustomFixPrompt.trim()}.` : "";
      const customPromptAddon = rawCustomPrompt ? ` Custom style/scene direction: ${rawCustomPrompt.trim()}.` : "";
      prompt = `[MANDATORY MULTI-IMAGE ROLE SPECIFICATION]:
- Image 1: PRIMARY & EXCLUSIVE REAL FACE IDENTITY SOURCE (id_weight: 1.0).
  The person in Image 1 is the ONLY subject who must appear in the final photo. Reconstruct 100% EXACT authentic facial structure: exact eye shape, natural eyelid fold, exact eye size and distance, authentic nose contour (maintain exact nose tip width and bridge curve, DO NOT sharpen or elongate), natural lip shape and smile lines, authentic cheekbone and jawline curvature (maintain exact natural face shape from Image 1, DO NOT elongate or reshape the jaw), authentic age, skin tone, and facial bone structure. ZERO hallucination, ZERO feature morphing. Every single facial proportion from Image 1 MUST be 100% identical.
- Image 2: VACANT LOCATION & ARCHITECTURAL BACKGROUND ONLY.
  Image 2 provides strictly the physical venue/location reference (e.g. padel tennis court, stadium lights, glass walls, cliff edge, suspension bridge).
  CRITICAL: COMPLETELY PURGE & ERASE ANY PRE-EXISTING PLAYERS, ATHLETES, OR BYSTANDERS originally visible in Image 2. Treat Image 2 as a completely empty stage. DO NOT borrow, blend, or cross-contaminate any facial features, body shape, or hair from anyone originally in Image 2!

[REALISTIC SPORTS & PHYSICAL REALISM]:
- CRITICAL BALL PHYSICS & REALISM: Strictly DO NOT glue or stick a ball to the racket face! In authentic professional sports photography, players either hold their racket naturally in a confident athletic ready stance (NO ball touching the racket strings at all), OR the ball is captured in realistic mid-air motion with natural motion blur away from the racket. A ball glued or frozen onto the racket strings looks completely fake and AI-generated. NEVER render a ball attached or stuck to the racket!

[CONTEXT-AWARE OPTIMAL HERO PLACEMENT & GOLDEN-RATIO FRAMING]:
(masterpiece, best quality:1.2), RAW unretouched travel photo, 8k uhd, shot on Canon EOS R5 with 35mm-50mm environmental prime lens at f/2.8.
1. CONTEXT-AWARE HERO POSITIONING: Intelligently analyze the physical terrain of Image 2 and place the person from Image 1 at the MOST DRAMATIC & NATURAL HERO SPOT:
   - If Image 2 is a sports court (e.g. padel tennis, court): Position the subject in the foreground/midground in a natural athletic ready stance, holding the paddle racket naturally by the grip, ready for action.
   - If Image 2 is a cliff, rock ledge, or mountain overlook: Position the subject securely in the foreground/midground standing naturally on the rock overlook.
   - If Image 2 is a bridge, walkway, or rooftop terrace: Position the subject standing proudly at the railing or deck in the foreground/midground.
2. GOLDEN-RATIO PROPORTION LOCK:
   - Frame the subject in an environmental Medium-to-Full or Waist-to-Knee shot occupying EXACTLY 38% to 48% of the vertical frame height.
   - The face must be CRISP, SHARP, AND PROMINENT ENOUGH so that all fine facial features, eyes, expressions, and 100% identical face identity from Image 1 are instantly recognizable.
   - The background environment and panoramic venue of Image 2 MUST occupy the remaining 52% to 62% of the frame with full majestic perspective and grand depth.
   - STRICTLY AVOID: DO NOT place the subject as a tiny blurry figure in the far background, and DO NOT zoom into an oversized ID headshot that crops out the scenery.
3. PHYSICAL & OPTICAL INTEGRATION:
   - Ground contact shadows: The subject must stand firmly on the ground surface with natural contact and ambient occlusion shadows (no floating sticker look).
   - Directional lighting harmonization: Match the lighting direction, color temperature, and rim highlights on the subject's face, hair, and body seamlessly with the ambient light source of Image 2.
   - Attire adaptation: Elegantly adapt the subject's clothing to match the travel/sports venue (e.g. athletic sports polo/t-shirt, shorts, sneakers) while keeping 100% original head and face.
   - Realistic texture: Microscopic pores, fine vellus peach fuzz, natural sub-surface scattering (SSS), and organic fine sensor grain on Kodak Portra 400 film aesthetic.${customPromptAddon}${fixAddon} Do not render any visible text, watermark, logos, or letters.
CRITICAL NEGATIVE: (plastic skin, waxy skin, airbrushed, smooth skin, poreless skin:1.4), (matte skin, powdery skin, flawless skin:1.3), ball stuck to racket, ball glued to paddle, frozen ball on strings, ball attached to racket face, fake ball, elongated face, pointy nose, narrowed eyes, distorted facial bone structure, stranger face, different face, morphed face, altered identity, cross-contaminated features, generic young model, wrong face, face drift, tiny distant figure, distant person, blurry face, unrecognizable face, tight close-up, cropped landmark, oversized head, gigantic face filling the entire screen, fake floating cutout, sticker cutout, missing ground shadow, beauty filter, glam, cgi, 3d render, cartoon, painting, illustration, drawing, unreal engine, ring-light flat lighting, front flash, overexposed highlights, dead eyes, bad anatomy, deformed hands, lowres, watermark, halo artifact around head, hard cutout edges, mismatched lighting, unnatural seams, skin tone boundary mismatch, blurry borders, oversmoothed skin, deformed facial features, mutated eyes, plastic face, asymmetrical jaw, identity drift, duplicated face, identical features across multiple people, swapped identities, merged facial attributes, missing people, dropped members.`;
    } else {
      prompt = buildPrompt({
        styleId,
        bgColor,
        customPrompt: rawCustomPrompt,
        customFixPrompt: rawCustomFixPrompt,
      });

      // When facePreserveMode is active, append appropriate Face & Ratio Directive
      if (facePreserveMode) {
        if (isIdStyle) {
          const fixAddon = rawCustomFixPrompt ? ` User refinement request: ${rawCustomFixPrompt.trim()}.` : "";
          prompt = `[MANDATORY MULTI-IMAGE COMPOSITING SPECIFICATION FOR OFFICIAL ID & PASSPORT]:
- Image 1: PRIMARY & EXCLUSIVE REAL FACE IDENTITY SOURCE (id_weight: 1.0).
  Extract ONLY the person's authentic face, eyes, nose, mouth, skin tone, and natural hairstyle from Image 1. Reconstruct 100% exact authentic facial structure and natural hair volume. If ears are covered by hair in Image 1, keep the hair naturally draping over the ears with ZERO fake or deformed ears.
- Image 2: 100% VACANT PURE SOLID STUDIO BACKDROP.
  Image 2 provides strictly the pure solid background canvas.
  CRITICAL MANDATORY INSTRUCTION: COMPLETELY PURGE, DISCARD, AND ERASE 100% OF THE ORIGINAL BACKGROUND, ROOM, WALLS, WALLPAPER, FURNITURE, PAINTINGS, SHELVES, AND CLUTTER FROM IMAGE 1. Place the subject from Image 1 seamlessly and cleanly directly in front of Image 2's flat, seamless solid backdrop. There must be ZERO objects, ZERO furniture, ZERO wall decor, and ZERO room shadows behind the person.
- ATTIRE & FRAMING:
  Replace clothing with a clean tailored dark business suit and white shirt. Perfectly centered front-facing bust shot. Headroom 15% to 20% clear solid space above top of hair. Face occupies 48% to 54% of vertical frame height. Visible neck, collarbones, and neat symmetrical shoulders. Flattering symmetrical studio lighting.${fixAddon}
CRITICAL NEGATIVE: (room, interior, wall, wallpaper pattern, furniture, painting on wall, picture frame, shelf, curtain, window, clutter in background:1.8), (deformed ears, mutated ears, unnatural ears, weird ears, fake ears sticking out of hair:1.5), (slicked back hair, unnaturally flattened hair, bald appearance, tight hair bun:1.3), cropped head, cropped hair, cropped ears, cropped chin, head touching top border, tight face crop, oversized giant face, plastic skin, 3d render, cartoon, blurry, lowres.`;
        } else {
          prompt += ` CRITICAL 100% REAL-FACE & GOLDEN-RATIO TRAVEL DIRECTIVE: Reconstruct the subject's authentic 1:1 real face from Image 1 (eyes, double eyelids, nose, smile, eyeglasses) with id_weight: 0.999. If ears are covered by hair in Image 1, keep natural hair draping with zero fake ears. Environmental Full-Body or Knee-Up Shot occupying 25%-32% of vertical frame height, allowing the grand landmark panorama behind to occupy 68%-75% of the frame without obstruction. Completely replace casual indoor home clothes with stylish vacation travel attire (chic trench coat, elegant casual jacket or knitwear). Do NOT zoom into a giant headshot, do NOT render a tight front-facing selfie.`;
        }
      }

      // If previousImageUrl exists, apply strict Face Identity Locking while maintaining theme
      if (rawPrevImageBase64) {
        const parsedFix = parseCustomFixPrompt(rawCustomFixPrompt || "Enhance resemblance to original selfie");
        const enrichedFixDirective = parsedFix.userRequestInstruction || parsedFix.styleModsPrompt || rawCustomFixPrompt?.trim() || "Enhance resemblance to original selfie";

        if (isIdStyle) {
          prompt += ` CRITICAL USER REFINEMENT: ${enrichedFixDirective}. MANDATORY: Retain 100% pure solid studio backdrop and neat formal/student attire with zero room clutter.`;
        } else {
          prompt = `CRITICAL MANDATORY INSTRUCTION FOR IMAGE MODIFICATION & REFINEMENT:
1. DETECT & RENDER ALL PERSONS (EXACT HEADCOUNT): Accurately count and include EVERY SINGLE INDIVIDUAL present in Image 1 (whether 1 person, 2 people, 4 people, or a group). Never drop, crop, or zoom into just one person unless explicitly requested. Maintain the group composition and relative positions naturally with [SEP] token partitioning.
2. STRICT 100% REAL FACE LOCK & EDGE INPAINTING: Preserve 100% exact authentic facial identity, eyes, nose, lips, jawline, facial bone structure, skin tone, and natural smile of EVERY real person from Image 1 with id_weight: 0.999. Apply microscopic visible pores, fine vellus peach fuzz, sub-surface scattering, seamless edge blending, and natural directional Rembrandt lighting.
3. THEME & PROPORTIONS: Harmoniously maintain the original scene theme for "${styleId}". Keep realistic environmental proportions (subject occupies 25%-32% of frame height, landmark occupies 68%-75%). DO NOT zoom in to oversized headshot.
4. USER REQUESTED MODIFICATIONS: Apply the user's specific requested changes with high precision: ${enrichedFixDirective}. ${parsedFix.soloPrompt ? `Ensure: ${parsedFix.soloPrompt}.` : ""}
5. ATTIRE & COMPOSITION: Stylish travel attire. ${NO_TEXT_INSTRUCTION} CRITICAL NEGATIVE: (plastic skin, waxy skin, airbrushed, smooth skin, poreless skin:1.4), (matte skin, powdery skin, flawless skin:1.3), (giant close-up headshot, oversized face filling the screen, selfie pose, stiff passport posture, indoor t-shirt, casual striped shirt, chest-up bust shot blocking the view, camera staring:1.5), cropped landmark, oversized head, gigantic face filling the entire screen, cut off Eiffel tower, obstructed scenery, beauty filter, glam, cgi, 3d render, cartoon, painting, illustration, drawing, unreal engine, ring-light flat lighting, front flash, overexposed highlights, dead eyes, bad anatomy, deformed hands, lowres, watermark, halo artifact around head, hard cutout edges, mismatched lighting, unnatural seams, skin tone boundary mismatch, blurry borders, oversmoothed skin, deformed facial features, mutated eyes, plastic face, asymmetrical jaw, identity drift, face blending, duplicated face, identical features across multiple people, swapped identities, merged facial attributes, missing people, dropped members.`;
        }
      }
    }

    // Append learned user preferences from memory if available
    if (userPreferences) {
      const personalMemoryPrompt = buildPersonalizedLearningPrompt(userPreferences);
      if (personalMemoryPrompt) {
        prompt += ` ${personalMemoryPrompt}`;
      }
    }

    const ai = new GoogleGenAI({ apiKey });

    // Single attempt against one model; returns null if no image came back.
    const callModel = async (model: string): Promise<ModelSuccessResult | null> => {
      const startTime = Date.now();
      
      const inputs: any[] = [{ type: "text", text: prompt }];
      inputs.push({ type: "image", data: rawSelfieBase64, mime_type: selfieMime });
      if (isIdStyle && rawBgBase64) {
        inputs.push({ type: "image", data: rawBgBase64, mime_type: bgMime });
      } else if (rawPrevImageBase64) {
        inputs.push({ type: "image", data: rawPrevImageBase64, mime_type: prevMime });
      } else if (rawBgBase64) {
        inputs.push({ type: "image", data: rawBgBase64, mime_type: bgMime });
      }

      const interaction = await ai.interactions.create({
        model,
        input: inputs,
        response_format: {
          type: "image",
          aspect_ratio: "3:4",
          image_size: "2K"
        }
      });
      const timeSec = ((Date.now() - startTime) / 1000).toFixed(1);

      if (interaction?.output_image?.data) {
        const rawData = interaction.output_image.data;
        let mime = interaction.output_image.mime_type || "image/png";
        if (rawData.startsWith("/9j/")) {
          mime = "image/jpeg";
        } else if (rawData.startsWith("iVBORw")) {
          mime = "image/png";
        } else if (rawData.startsWith("UklGR")) {
          mime = "image/webp";
        }
        return {
          success: true,
          imageUrl: `data:${mime};base64,${rawData}`,
          timeSec
        };
      }
      return null;
    };

    // Option A: Gemini 3.1 Flash Lite Single Engine Pipeline
    const runOptionAModel = async (): Promise<ModelResult> => {
      const modelsToTry = [
        "gemini-3.1-flash-lite-image",
        "gemini-3.1-flash-image",
        "gemini-2.5-flash",
        "imagen-3.0-generate-002",
      ];

      let lastErrorMsg = "";
      for (const m of modelsToTry) {
        try {
          const result = await callModel(m);
          if (result) return result;
        } catch (err: unknown) {
          lastErrorMsg = err instanceof Error ? err.message : String(err);
          console.warn(`[Option A Model Fallback] Model ${m} failed: ${lastErrorMsg}`);
        }
      }
      return {
        success: false,
        error: toUserMessage(lastErrorMsg, `AI 화보 이미지 생성 실패 (${lastErrorMsg})`),
      };
    };

    // Execute Option A (Gemini 3.1 Flash Lite)
    const optionAResult = await runOptionAModel();
    const liteResult = optionAResult;
    const proResult = optionAResult;

    if (!liteResult.success && !proResult.success) {
      const errDetail = (liteResult as ModelErrorResult).error || "AI 화보 이미지 생성 실패";
      return NextResponse.json(
        { error: `백엔드 AI 서버 통신 오류: ${errDetail}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      lite: liteResult,
      pro: proResult
    });

  } catch (err: unknown) {
    console.error("Generate API Error:", err);
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `서버 예외 발생: ${errMsg}` },
      { status: 500 }
    );
  }
}
