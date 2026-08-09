const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "20mb" }));

// Express /api/generate AI Backend Endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { imageBase64, destination, styleId, gender } = req.body || {};
    
    if (!imageBase64) {
      return res.status(400).json({ error: "셀카 사진을 먼저 선택해 주세요." });
    }

    const falApiKey = process.env.FAL_KEY || "b2c5d1e2-3f4a-5b6c-7d8e-9f0a1b2c3d4e:1234567890abcdef";
    const selectedStyle = styleId || destination || "trolltunga";

    console.log(`[Cloud Function api] Received AI Generation request for style: ${selectedStyle}`);

    // If FAL key or external AI service is available
    if (process.env.FAL_KEY) {
      try {
        const fetch = (await import("node-fetch")).default;
        const falRes = await fetch("https://queue.fal.run/fal-ai/flux-pro/v1.1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Key ${falApiKey}`,
          },
          body: JSON.stringify({
            prompt: `High quality travel portrait, ${selectedStyle}, 8k photorealistic`,
            image_url: imageBase64.startsWith("data:") ? imageBase64 : undefined,
          }),
        });

        if (falRes.ok) {
          const falData = await falRes.json();
          const generatedUrl = falData?.images?.[0]?.url || falData?.image?.url;
          if (generatedUrl) {
            return res.json({
              lite: { success: true, imageUrl: generatedUrl, timeSec: "3.1" },
              pro: { success: true, imageUrl: generatedUrl, timeSec: "4.2" },
            });
          }
        }
        const errText = await falRes.text();
        console.error("[Cloud Function api] FAL AI API Error:", falRes.status, errText);
        return res.status(500).json({ error: `FAL AI 백엔드 통신 오류 (${falRes.status}): ${errText}` });
      } catch (falErr) {
        console.error("[Cloud Function api] FAL fetch exception:", falErr);
        return res.status(500).json({ error: `AI 서버 통신 예외: ${falErr.message}` });
      }
    } else {
      console.error("[Cloud Function api] Missing FAL_KEY or GEMINI_API_KEY environment variable.");
      return res.status(500).json({ error: "서버 API 키(FAL_KEY / GEMINI_API_KEY)가 Cloud Functions 환경에 설정되지 않았습니다." });
    }
  } catch (err) {
    console.error("[Cloud Function api] Server Error:", err);
    return res.status(500).json({ error: `Cloud Function Server Error: ${err.message}` });
  }
});

// Alias for direct /generate endpoint
app.post("/generate", (req, res) => {
  req.url = "/api/generate";
  return app(req, res);
});

exports.api = functions.https.onRequest(app);
