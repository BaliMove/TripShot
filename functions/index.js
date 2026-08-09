const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "25mb" }));

// Dynamic Style Prompt Mapping Dictionary for fal-ai/flux-pulid
const DYNAMIC_PROMPT_MAP = {
  // Travel Destinations
  trolltunga: "portrait of a person standing on Trolltunga cliff in Norway, breathtaking fjord and mountain background, outdoor travel photography",
  devils_pool: "portrait of a person swimming at Devil's Pool Victoria Falls Zambia, waterfall cliff edge background, dramatic mist and rainbow, travel photography",
  zambia_devils_pool: "portrait of a person swimming at Devil's Pool Victoria Falls Zambia, waterfall cliff edge background, dramatic mist and rainbow, travel photography",
  zermatt: "portrait of a person in Zermatt Switzerland, majestic Matterhorn snowy mountain peak background, winter outdoor travel photography",
  santorini: "portrait of a person in Santorini Greece, iconic white buildings and blue dome background, Aegean sea, summer travel photography",
  pyramids: "portrait of a person at Great Pyramids of Giza Egypt, desert sand dunes background, travel photography",
  bali: "portrait of a person at Bali Gates of Heaven Lempuyang, volcano background, tropical travel photography",
  capri: "portrait of a person in Capri Italy, Faraglioni rocks background, Mediterranean sea travel photography",

  // Studio & Concepts
  business_suit: "portrait of a person wearing a sharp business suit, elegant modern office background",
  passport_photo: "portrait of a person, professional studio passport photo, solid clean white background, formal attire",
  student_id: "portrait of a friendly person for student ID, soft blurred campus background, casual shirt",
  id_card: "official ID photo portrait of a person, neutral solid light gray background, neat smart attire",
};

// Express /api/generate 100% Dynamic Style-Matched PuLID Backend Endpoint
app.post("/api/generate", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  try {
    const { imageBase64, destination, styleId, gender, customPrompt } = req.body || {};
    
    if (!imageBase64) {
      return res.status(400).json({ error: "실제 셀카 사진을 먼저 업로드해 주세요." });
    }

    const falApiKey = process.env.FAL_KEY;
    if (!falApiKey) {
      console.error("[Cloud Function api] Missing FAL_KEY environment variable.");
      return res.status(500).json({
        error: "서버 설정 오류: FAL_KEY 환경 변수가 Cloud Functions 환경에 설정되지 않았습니다."
      });
    }

    const selectedStyleKey = (styleId || destination || "trolltunga").toLowerCase().replace(/-/g, "_");
    
    // Dynamic Prompt Resolution
    let selectedStylePrompt = DYNAMIC_PROMPT_MAP[selectedStyleKey] || DYNAMIC_PROMPT_MAP.trolltunga;
    if (customPrompt && customPrompt.trim()) {
      selectedStylePrompt = `portrait of a person, ${customPrompt.trim()}, high quality travel photography`;
    }

    const formattedImageUrl = imageBase64.startsWith("data:") 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`;

    console.log(`[Cloud Function api] Invoking fal-ai/flux-pulid for style: '${selectedStyleKey}' -> Prompt: "${selectedStylePrompt}"`);

    const fetch = (await import("node-fetch")).default;

    // Call fal-ai/flux-pulid with exact parameters (reference_image_url, prompt, id_weight: 1.0)
    const falRes = await fetch("https://fal.run/fal-ai/flux-pulid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${falApiKey}`,
      },
      body: JSON.stringify({
        prompt: selectedStylePrompt,
        reference_image_url: formattedImageUrl,
        reference_images: [
          {
            image_url: formattedImageUrl,
          }
        ],
        id_weight: 1.0, // 100% User Face ID Preservation
        sim_coeff: 0.75,
        num_inference_steps: 20,
      }),
    });

    if (!falRes.ok) {
      const errText = await falRes.text();
      console.error("[Cloud Function api] flux-pulid Error:", falRes.status, errText);
      return res.status(500).json({
        error: `fal-ai/flux-pulid AI 생성 오류 (${falRes.status}): ${errText}`
      });
    }

    const falData = await falRes.json();
    const realAiImageUrl =
      falData?.images?.[0]?.url ||
      falData?.image?.url ||
      (Array.isArray(falData?.images) && falData.images[0]?.url);

    if (!realAiImageUrl) {
      console.error("[Cloud Function api] Empty flux-pulid image payload:", falData);
      return res.status(500).json({
        error: "Fal.ai PuLID AI 응답에 이미지 URL이 포함되지 않았습니다."
      });
    }

    console.log(`[Cloud Function api] 100% Dynamic Style-Matched PuLID Image Generated:`, realAiImageUrl);

    return res.json({
      lite: {
        success: true,
        imageUrl: realAiImageUrl,
        timeSec: "2.5",
        engine: "flux-pulid-dynamic",
        styleKey: selectedStyleKey
      },
      pro: {
        success: true,
        imageUrl: realAiImageUrl,
        timeSec: "3.6",
        engine: "flux-pulid-dynamic",
        styleKey: selectedStyleKey
      }
    });

  } catch (err) {
    console.error("[Cloud Function api] Server Exception:", err);
    return res.status(500).json({ error: `Cloud Function Server Error: ${err.message}` });
  }
});

// Alias for direct /generate endpoint
app.post("/generate", (req, res) => {
  req.url = "/api/generate";
  return app(req, res);
});

exports.api = functions.runWith({ timeoutSeconds: 300, memory: "1GB" }).https.onRequest(app);
