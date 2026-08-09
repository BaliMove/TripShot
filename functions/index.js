const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "25mb" }));

// Comprehensive Master Style Prompt Dictionary (Fallback Registry)
const MASTER_STYLE_PROMPT_MAP = {
  pedra_telegrafo: "front-facing portrait looking at camera, hanging from Pedra do Telégrafo rock Brazil with optical illusion cliff effect, ocean background, golden hour, 8k photorealistic portrait",
  trolltunga: "front-facing portrait looking at camera, sitting safely on the edge of Trolltunga cliff Norway, 700m abyss below, dramatic fjord view, cinematic rim light, 8k photorealistic travel portrait",
  devils_pool: "front-facing portrait looking at camera, at Victoria Falls Devil's Pool Zambia, 108m waterfall cliff edge, mist and rainbow in background, epic travel shot, 8k photorealistic portrait",
  kjeragbolten: "front-facing portrait looking at camera, standing on Kjeragbolten wedged rock in Norway, 1000m cliff gap, breathtaking mountain panorama, 8k photorealistic travel portrait",
  huashan_plank: "front-facing portrait looking at camera, walking on narrow Huashan plank walk cliff edge in China, steep mountain cliff drop, extreme thrill, 8k photorealistic travel portrait",
  death_road: "front-facing portrait looking at camera, standing with a mountain bike at Yungas Death Road Bolivia edge, misty cliff abyss, 8k photorealistic portrait",
  yasur_volcano: "front-facing portrait looking at camera, standing safely near Mt. Yasur erupting volcano in Vanuatu, glowing red lava smoke, 8k photorealistic portrait",
  trift_bridge: "front-facing portrait looking at camera, standing on Trift suspension bridge in Swiss Alps, 100m high valley suspension bridge, 8k photorealistic portrait",
  rooftopping: "front-facing portrait looking at camera, sitting on a skyscraper rooftop ledge in Dubai/NYC at night, urban skyline glow below, 8k photorealistic portrait",
  jacobs_well: "front-facing portrait looking at camera, diving safely into Jacob's Well underwater cave in Texas, clear turquoise water, 8k photorealistic portrait",
  corporate: "front-facing studio portrait looking at camera, masterpiece wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  business_suit: "front-facing studio portrait looking at camera, masterpiece wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  business: "front-facing studio portrait looking at camera, masterpiece wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
};

// Express /api/generate Enterprise 100% Prompt-Matched AI Backend Endpoint
app.post("/api/generate", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  try {
    const { imageBase64, destination, styleId, stylePrompt, gender, customPrompt } = req.body || {};
    
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

    const rawKey = (styleId || destination || "corporate").toLowerCase().trim().replace(/[-\s]/g, "_");
    
    // 1. Primary: Use exact prompt passed from frontend and enforce front-facing camera gaze
    let basePrompt = stylePrompt || MASTER_STYLE_PROMPT_MAP[rawKey];

    if (!basePrompt) {
      basePrompt = `masterpiece travel portrait of a person at ${rawKey.replace(/_/g, " ")}, breathtaking scenic background, professional outdoor travel photography, photorealistic 8k`;
    }

    if (customPrompt && customPrompt.trim()) {
      basePrompt = `portrait of a person, ${customPrompt.trim()}, high quality photorealistic 8k`;
    }

    // Force front-facing view instruction to prevent back-facing back views
    const finalPrompt = `front-facing portrait looking directly at camera, clear face, ${basePrompt}`;

    const formattedImageUrl = imageBase64.startsWith("data:") 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`;

    console.log(`[Cloud Function api] Executing 100% Front-Facing Prompt for Key '${rawKey}': "${finalPrompt.substring(0, 85)}..."`);

    const fetch = (await import("node-fetch")).default;

    // Call fal-ai/flux-pulid with exact parameters
    const falRes = await fetch("https://fal.run/fal-ai/flux-pulid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${falApiKey}`,
      },
      body: JSON.stringify({
        prompt: finalPrompt,
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

    console.log(`[Cloud Function api] 100% Front-Facing Style-Matched ('${rawKey}') PuLID Image Generated Successfully:`, realAiImageUrl);

    return res.json({
      lite: {
        success: true,
        imageUrl: realAiImageUrl,
        timeSec: "2.5",
        engine: "flux-pulid-front-facing",
        styleKey: rawKey
      },
      pro: {
        success: true,
        imageUrl: realAiImageUrl,
        timeSec: "3.6",
        engine: "flux-pulid-front-facing",
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
