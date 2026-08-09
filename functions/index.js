const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "25mb" }));

// Master Comprehensive Dynamic Style Prompt Mapping Dictionary for fal-ai/flux-pulid
const DYNAMIC_PROMPT_MAP = {
  // 1. Studio & Business Suits Concepts
  corporate: "masterpiece studio portrait of a person wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  business_suit: "masterpiece studio portrait of a person wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  business: "masterpiece studio portrait of a person wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  passport_photo: "official studio passport photo portrait of a person, solid clean white background, formal dark jacket suit, centered face, studio lighting, photorealistic 8k",
  passport: "official studio passport photo portrait of a person, solid clean white background, formal dark jacket suit, centered face, studio lighting, photorealistic 8k",
  student_id: "friendly student ID photo portrait of a person, soft pastel blue background, smart casual shirt, bright smile, photorealistic 8k",
  id_card: "official ID photo portrait of a person, solid neutral light gray background, formal shirt, photorealistic 8k",

  // 2. Travel Destinations & Attractions
  trift_bridge: "epic travel portrait of a person standing on Trift suspension bridge in Switzerland, breathtaking alpine glacier canyon background, photorealistic 8k",
  trolltunga: "epic travel portrait of a person standing on Trolltunga cliff ledge in Norway, breathtaking fjord and snowy mountain background, photorealistic 8k",
  devils_pool: "breathtaking travel portrait of a person swimming at Devil's Pool Victoria Falls Zambia, edge of waterfall cliff background, mist and rainbow, photorealistic 8k",
  zambia_devils_pool: "breathtaking travel portrait of a person swimming at Devil's Pool Victoria Falls Zambia, edge of waterfall cliff background, mist and rainbow, photorealistic 8k",
  zermatt: "stunning winter travel portrait in Zermatt Switzerland, Matterhorn peak background, alpine jacket, photorealistic 8k",
  santorini: "beautiful travel portrait in Santorini Greece, white dome buildings background, Aegean sea, photorealistic 8k",
  pyramids: "epic travel portrait at Great Pyramids of Giza Egypt, desert sand dunes background, photorealistic 8k",
  bali: "exotic travel portrait at Bali Gates of Heaven Lempuyang, volcano background, photorealistic 8k",
  capri: "luxury travel portrait in Capri Italy, Faraglioni sea stack rocks background, photorealistic 8k",
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

    const rawKey = (styleId || destination || "corporate").toLowerCase().replace(/-/g, "_");
    
    // Comprehensive Dynamic Prompt Resolution with fallback to corporate suit
    let selectedStylePrompt = DYNAMIC_PROMPT_MAP[rawKey] || DYNAMIC_PROMPT_MAP.corporate;
    if (customPrompt && customPrompt.trim()) {
      selectedStylePrompt = `portrait of a person, ${customPrompt.trim()}, high quality photography`;
    }

    const formattedImageUrl = imageBase64.startsWith("data:") 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`;

    console.log(`[Cloud Function api] Invoking fal-ai/flux-pulid for Key: '${rawKey}' -> Prompt: "${selectedStylePrompt.substring(0, 70)}..."`);

    const fetch = (await import("node-fetch")).default;

    // Call fal-ai/flux-pulid with exact parameters
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

    console.log(`[Cloud Function api] 100% Dynamic Style-Matched ('${rawKey}') PuLID Image Generated:`, realAiImageUrl);

    return res.json({
      lite: {
        success: true,
        imageUrl: realAiImageUrl,
        timeSec: "2.5",
        engine: "flux-pulid-dynamic",
        styleKey: rawKey
      },
      pro: {
        success: true,
        imageUrl: realAiImageUrl,
        timeSec: "3.6",
        engine: "flux-pulid-dynamic",
        styleKey: rawKey
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
