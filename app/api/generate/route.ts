import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildPrompt, getStyle, parseCustomFixPrompt, NO_TEXT_INSTRUCTION, type BgColor, type Gender } from "../../lib/styles";

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
      const fixAddon = rawCustomFixPrompt ? ` User fix request: ${rawCustomFixPrompt.trim()}.` : "";
      prompt = `A photorealistic travel portrait naturally integrating ALL person(s) from Image 1 (detect every person, whether solo, couple, or entire group/family) into the provided custom background photo (Image 2). Show full body or natural 3/4 framing with visible photorealistic shoes/footwear firmly standing on the ground surface. Wearing sophisticated resort wear matching their style, 8k photo quality, strictly preserving exact individual facial identities and features of all subjects from Image 1 with id_weight: 0.99.${fixAddon} ${NO_TEXT_INSTRUCTION} CRITICAL NEGATIVE: different people, random strangers, altered faces, morphed features.`;
    } else {
      prompt = buildPrompt({
        styleId,
        bgColor,
        customPrompt: rawCustomPrompt,
        customFixPrompt: rawCustomFixPrompt,
      });

      // If previousImageUrl exists, apply strict Face Identity Locking while maintaining theme
      if (rawPrevImageBase64) {
        const parsedFix = parseCustomFixPrompt(rawCustomFixPrompt || "Enhance resemblance to original selfie");
        const enrichedFixDirective = parsedFix.userRequestInstruction || parsedFix.styleModsPrompt || rawCustomFixPrompt?.trim() || "Enhance resemblance to original selfie";

        prompt = `CRITICAL MANDATORY INSTRUCTION FOR IMAGE MODIFICATION & REFINEMENT:
1. THEME & ENVIRONMENT TRANSFORMATION: Seamlessly integrate the subject(s) into the target theme: ${prompt}.
2. STRICT 100% FACE IDENTITY LOCK: Preserve 100% exact facial identity, eyes, nose, lips, jawline, facial bone structure, skin tone, and likeness of the real person from Image 1 (the ORIGINAL USER SELFIE/PHOTO) with id_weight: 0.99.
3. TARGET MODIFICATION & USER FIXES: Apply the user's specific requested changes with high precision: ${enrichedFixDirective}. ${parsedFix.soloPrompt ? `Ensure: ${parsedFix.soloPrompt}.` : ""}
4. AUTHENTIC HIGH-END COMPOSITION: Keep the styled travel/concept outfit and scenic backdrop from the theme while perfecting the user's face to match Image 1 authentically. ${NO_TEXT_INSTRUCTION} CRITICAL NEGATIVE: unchanged raw room background, unstyled clothes, different faces, morphed faces, random strangers, swapped people, stock models, distorted face, changed ethnicity.`;
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
        return {
          success: true,
          imageUrl: `data:image/png;base64,${interaction.output_image.data}`,
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
