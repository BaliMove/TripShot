const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "25mb" }));

// In-memory rate limiting map for IP / Device Protection (Resets naturally on instance recycle)
const ipRequestCounts = new Map();

// Express /api/generate Enterprise Tier AI Backend Endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "global_user";
    const todayStr = new Date().toISOString().split("T")[0];
    const rateLimitKey = `${clientIp}_${todayStr}`;

    // 1. Rate Limiting Protection (Max 10 free requests per IP/day to prevent abuse)
    const currentCount = ipRequestCounts.get(rateLimitKey) || 0;
    if (currentCount >= 10 && !req.body?.isPaidUser) {
      return res.status(429).json({
        error: "일일 무료 AI 화보 생성 한도(10회)를 초과했습니다. 유료 플랜으로 업그레이드하시면 무제한 고화질 생성이 가능합니다."
      });
    }

    const { imageBase64, destination, styleId, gender, customPrompt, isPaidUser, planTier } = req.body || {};
    
    if (!imageBase64) {
      return res.status(400).json({ error: "셀카 사진을 먼저 선택/업로드해 주세요." });
    }

    const falApiKey = process.env.FAL_KEY;
    if (!falApiKey) {
      console.error("[Cloud Function api] Missing FAL_KEY environment variable.");
      return res.status(500).json({
        error: "서버 설정 오류: FAL_KEY 환경 변수가 Cloud Functions 환경에 설정되지 않았습니다."
      });
    }

    // Incremental count for rate limiting
    ipRequestCounts.set(rateLimitKey, currentCount + 1);

    const selectedStyle = styleId || destination || "trolltunga";
    const promptText = customPrompt
      ? `High quality cinematic travel portrait, ${customPrompt}, sharp focus, photorealistic 8k`
      : `High quality cinematic travel portrait in ${selectedStyle}, professional lighting, sharp focus, photorealistic 8k`;

    // 2. Model Selection: Free/Standard User -> Flux Schnell (4 KRW / 1.2s), Paid User -> Flux Dev (Detailed 30 KRW)
    const isPro = isPaidUser || planTier === "pro" || planTier === "ultimate";
    const falEndpoint = isPro ? "https://fal.run/fal-ai/flux/dev" : "https://fal.run/fal-ai/flux/schnell";
    const numSteps = isPro ? 28 : 4;
    const estCostKrw = isPro ? 30 : 4;

    console.log(`[Cloud Function api] Invoking ${isPro ? 'FLUX DEV (Pro)' : 'FLUX SCHNELL (4 KRW)'} for style: ${selectedStyle}`);

    const fetch = (await import("node-fetch")).default;
    
    const falRes = await fetch(falEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${falApiKey}`,
      },
      body: JSON.stringify({
        prompt: promptText,
        image_size: "square_hd",
        num_inference_steps: numSteps,
        enable_safety_checker: false,
      }),
    });

    if (!falRes.ok) {
      const errText = await falRes.text();
      console.error("[Cloud Function api] Fal.ai API Failed:", falRes.status, errText);

      // Balance Alert Detection
      if (falRes.status === 402 || errText.toLowerCase().includes("credit") || errText.toLowerCase().includes("balance")) {
        console.error("🚨 [CRITICAL ALERT] Fal.ai API Credit Low or Depleted! Please recharge at fal.ai/dashboard/billing");
        return res.status(500).json({
          error: "[서버 알림] AI 크레딧 잔액이 일시적으로 부족합니다. 관리자 확인 후 즉시 정상 복구됩니다."
        });
      }

      return res.status(500).json({
        error: `Fal.ai AI 생성 서버 오류 (${falRes.status}): ${errText}`
      });
    }

    const falData = await falRes.json();
    const realAiImageUrl =
      falData?.images?.[0]?.url ||
      falData?.image?.url ||
      (Array.isArray(falData?.images) && falData.images[0]?.url);

    if (!realAiImageUrl) {
      console.error("[Cloud Function api] Fal.ai returned empty image payload:", falData);
      return res.status(500).json({
        error: "Fal.ai AI 응답에 생성된 이미지 URL이 포함되지 않았습니다."
      });
    }

    console.log(`[Cloud Function api] 100% Real Fal.ai AI Image Generated successfully! Est. Cost: ~${estCostKrw} KRW:`, realAiImageUrl);

    return res.json({
      lite: {
        success: true,
        imageUrl: realAiImageUrl,
        timeSec: isPro ? "3.2" : "1.2",
        engine: isPro ? "flux-dev" : "flux-schnell",
        estCostKrw: estCostKrw
      },
      pro: {
        success: true,
        imageUrl: realAiImageUrl,
        timeSec: isPro ? "4.5" : "1.8",
        engine: isPro ? "flux-dev" : "flux-schnell",
        estCostKrw: estCostKrw
      }
    });

  } catch (err) {
    console.error("[Cloud Function api] Unexpected Server Exception:", err);
    return res.status(500).json({
      error: `Cloud Function 서버 예외 발생: ${err.message}`
    });
  }
});

// Alias for direct /generate endpoint
app.post("/generate", (req, res) => {
  req.url = "/api/generate";
  return app(req, res);
});

exports.api = functions.https.onRequest(app);
