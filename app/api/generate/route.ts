import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildPrompt, getStyle, parseCustomFixPrompt, NO_TEXT_INSTRUCTION, type BgColor, type Gender } from "../../lib/styles";
import { buildPersonalizedLearningPrompt, type UserPreferences } from "../../lib/preferenceMemory";

export const runtime = "nodejs";
export const maxDuration = 60;

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

    let prompt = "";
    if (customBgBase64) {
      const fixAddon = rawCustomFixPrompt ? ` User modification instruction: ${rawCustomFixPrompt.trim()}.` : "";
      const customPromptAddon = rawCustomPrompt ? ` Custom style/scene direction: ${rawCustomPrompt.trim()}.` : "";
      prompt = `(masterpiece, best quality:1.2), RAW photo, 8k uhd, 85mm lens portrait masterpiece seamlessly integrating ALL person(s) present in Image 1 (Indoor/Casual Portrait) naturally into the scenic/extreme destination backdrop in Image 2 (Scenic/Extreme Landscape Background).
CRITICAL MANDATORY INSTRUCTIONS:
1. 100% UNTOUCHED REAL FACE ID LOCK (IP-Adapter FaceID Fidelity, id_weight: 0.999): Every person's authentic facial bone structure, eyes, double eyelids, nose bridge, mouth, smile, teeth, expressions, eyeglasses, hairline, and skin texture with visible pores from Image 1 MUST be preserved 100% authentically with zero hallucination. DO NOT change the face into a generic stock model.
2. NATURAL PROPORTIONS & GOLDEN-RATIO SCENIC HARMONY: Place the person(s) naturally within the breathtaking location of Image 2. CRITICAL: Strictly DO NOT enlarge or zoom in on the head into an oversized face headshot. Maintain realistic anatomical human proportions (head-to-body ratio 1:7 to 1:8, Medium Shot / Waist-Up occupying 45%-60% of vertical frame height) harmoniously balanced with the magnificent landscape panorama.
3. EDGE INPAINTING & FEATHER BLENDING: Seamless edge blending, sharp hair strands integration, matching ambient lighting, directional rim light, and natural contact shadows so the subjects look 100% organically photographed at the real location.
4. MULTI-PERSON REGIONAL SPLIT [SEP] & ANTI-BLEED: Detect and count every individual from Image 1 (e.g. 1, 2, 4+ people). Process each person with distinct regional identity lock [Person 1] [SEP] [Person 2] without feature bleeding, duplicate faces, or swapped identities.
5. FASHION & STYLING: Elegantly adapt the person's clothing to match travel/outdoor adventure aesthetic while maintaining true personal identity.${customPromptAddon}${fixAddon} ${NO_TEXT_INSTRUCTION} CRITICAL NEGATIVE: (worst quality, low quality:1.3), halo artifact around head, hard cutout edges, mismatched lighting, unnatural seams, skin tone boundary mismatch, blurry borders, oversmoothed skin, cartoonish outline, deformed facial features, mutated eyes, plastic face, asymmetrical jaw, identity drift, 3d render, illustration, distorted features, face blending, duplicated face, identical features across multiple people, swapped identities, merged facial attributes, oversized head, giant head, missing people, dropped members, fake floating cutout.`;
    } else {
      prompt = buildPrompt({
        styleId,
        bgColor,
        customPrompt: rawCustomPrompt,
        customFixPrompt: rawCustomFixPrompt,
      });

      // When facePreserveMode is active, append the balanced Golden-Ratio Travel Directive
      if (facePreserveMode) {
        prompt += ` CRITICAL 100% REAL-FACE & PROPORTIONAL HARMONY DIRECTIVE: Reconstruct the subject's authentic 1:1 real face from Image 1 (eyes, double eyelids, nose, smile, eyeglasses) with id_weight: 0.999. Maintain realistic natural head-to-body ratio (1:7 to 1:8, Waist-Up Medium Shot 45%-60% frame height, do not zoom into giant head) harmoniously integrated with the breathtaking travel landscape in the background.`;
      }

      // If previousImageUrl exists, apply strict Face Identity Locking while maintaining theme
      if (rawPrevImageBase64) {
        const parsedFix = parseCustomFixPrompt(rawCustomFixPrompt || "Enhance resemblance to original selfie");
        const enrichedFixDirective = parsedFix.userRequestInstruction || parsedFix.styleModsPrompt || rawCustomFixPrompt?.trim() || "Enhance resemblance to original selfie";

        prompt = `CRITICAL MANDATORY INSTRUCTION FOR IMAGE MODIFICATION & REFINEMENT:
1. DETECT & RENDER ALL PERSONS (EXACT HEADCOUNT): Accurately count and include EVERY SINGLE INDIVIDUAL present in Image 1 (whether 1 person, 2 people, 4 people, or a group). Never drop, crop, or zoom into just one person unless explicitly requested. Maintain the group composition and relative positions naturally.
2. STRICT 100% REAL FACE LOCK & EDGE INPAINTING: Preserve 100% exact authentic facial identity, eyes, nose, lips, jawline, facial bone structure, skin tone, and natural smile of EVERY real person from Image 1 with id_weight: 0.999. Apply seamless edge blending and natural directional lighting.
3. NATURAL PROPORTIONS: Keep realistic anatomical human proportions (head-to-body ratio 1:7 to 1:8). DO NOT zoom in to oversized headshot.
4. USER REQUESTED MODIFICATIONS: Apply the user's specific requested changes with high precision: ${enrichedFixDirective}. ${parsedFix.soloPrompt ? `Ensure: ${parsedFix.soloPrompt}.` : ""}
5. BALANCED GROUP FRAMING & COMPOSITION: Harmoniously frame the entire subject/group within the requested theme backdrop with realistic lighting and depth of field. ${NO_TEXT_INSTRUCTION} CRITICAL NEGATIVE: (worst quality, low quality:1.3), halo artifact around head, hard cutout edges, mismatched lighting, unnatural seams, skin tone boundary mismatch, blurry borders, oversmoothed skin, deformed facial features, mutated eyes, plastic face, asymmetrical jaw, identity drift, face blending, duplicated face, identical features across multiple people, swapped identities, merged facial attributes, oversized head, giant head, missing people, dropped members.`;
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
      if (rawPrevImageBase64) {
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
