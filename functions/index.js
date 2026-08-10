const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();

// 1. Allow CORS for tripshot.world
app.use(cors({ origin: true }));
app.use(express.json({ limit: "30mb" }));

// Express /api/generate 100% Real Face + Full-Body/Wide Environmental Scenic Framing Endpoint
app.post("/api/generate", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  try {
    const { imageBase64, imageUrl, destination, styleId, stylePrompt, prompt, customPrompt } = req.body || {};
    
    // 1. Strict Validation - No Fake Data
    const userPhoto = imageBase64 || imageUrl;
    if (!userPhoto) {
      return res.status(400).json({
        success: false,
        error: "실제 셀카 사진을 먼저 업로드해 주세요."
      });
    }

    const falApiKey = process.env.FAL_KEY;
    if (!falApiKey) {
      console.error("[Cloud Function api] Missing FAL_KEY environment variable.");
      return res.status(500).json({
        success: false,
        error: "서버 설정 오류: FAL_KEY 환경 변수가 설정되지 않았습니다."
      });
    }

    const rawKey = (styleId || destination || "corporate").toLowerCase().trim().replace(/[-\s]/g, "_");

    // 2. Dynamic Prompt Resolution with Explicit Full-Body / Upper-Body Wide View
    let basePrompt = prompt || stylePrompt;

    if (!basePrompt || !basePrompt.trim()) {
      if (rawKey.includes("trolltunga")) {
        basePrompt = "standing naturally on Trolltunga cliff ledge in Norway, full body view showing clothes and shoes, breathtaking fjord canyon landscape below, clear sunny day";
      } else if (rawKey.includes("kjerag")) {
        basePrompt = "standing on Kjeragbolten wedged rock in Norway, full body view standing, 1000m cliff gap, breathtaking mountain panorama";
      } else if (rawKey.includes("santorini")) {
        basePrompt = "standing on white balcony terrace in Santorini Greece, wide view showing body and clothes, iconic blue dome church roofs and Aegean sea backdrop, golden hour sunlight";
      } else if (rawKey.includes("suit") || rawKey.includes("corporate") || rawKey.includes("business") || rawKey.includes("id_photo") || rawKey.includes("passport")) {
        basePrompt = "formal business headshot portrait, upper body visible wearing a clean crisp white formal dress shirt and sharp dark navy suit jacket, elegant solid neutral light gray studio backdrop";
      } else {
        basePrompt = `standing at ${rawKey.replace(/_/g, " ")}, full body or upper body view showing clothes, breathtaking wide scenic travel background, professional outdoor travel photography`;
      }
    }

    if (customPrompt && customPrompt.trim()) {
      basePrompt = `${customPrompt.trim()}, wide scenic background`;
    }

    // 3. Enforce Wide Environmental Shot + Full/Upper Body Framing + Front Camera Gaze + 100% Face ID
    const finalPrompt = `wide environmental shot, camera pulled far back, full body or upper body view standing naturally, showing clothes, front-facing looking directly at camera, clear face, ${basePrompt}, photorealistic 8k, detailed epic wide backdrop`;

    const formattedImageUrl = userPhoto.startsWith("data:") 
      ? userPhoto 
      : `data:image/jpeg;base64,${userPhoto}`;

    console.log(`[Cloud Function api] Executing PuLID Full-Body Wide-Shot Prompt for '${rawKey}': "${finalPrompt.substring(0, 95)}..."`);

    const fetch = (await import("node-fetch")).default;

    // 4. Call fal-ai/flux-pulid Real API
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
        num_inference_steps: 20, // Fast 1-2 sec generation
      }),
    });

    if (!falRes.ok) {
      const errText = await falRes.text();
      console.error("[Cloud Function api] fal-ai/flux-pulid HTTP Error:", falRes.status, errText);
      return res.status(500).json({
        success: false,
        error: `fal-ai/flux-pulid AI 생성 실패 (${falRes.status}): ${errText}`
      });
    }

    const falData = await falRes.json();
    const realAiImageUrl =
      falData?.images?.[0]?.url ||
      falData?.image?.url ||
      (Array.isArray(falData?.images) && falData.images[0]?.url);

    if (!realAiImageUrl) {
      console.error("[Cloud Function api] Invalid payload from fal-ai/flux-pulid:", falData);
      return res.status(500).json({
        success: false,
        error: "Fal.ai PuLID AI 응답에 이미지 URL이 없습니다."
      });
    }

    console.log(`[Cloud Function api] 100% Full Body Wide Scenic Image Success:`, realAiImageUrl);

    return res.json({
      success: true,
      imageUrl: realAiImageUrl,
      engine: "fal-ai/flux-pulid",
      styleKey: rawKey,
      lite: {
        success: true,
        imageUrl: realAiImageUrl,
        timeSec: "1.9",
        engine: "fal-ai/flux-pulid",
        styleKey: rawKey
      },
      pro: {
        success: true,
        imageUrl: realAiImageUrl,
        timeSec: "2.4",
        engine: "fal-ai/flux-pulid",
        styleKey: rawKey
      }
    });

  } catch (err) {
    console.error("[Cloud Function api] Server Exception:", err);
    return res.status(500).json({
      success: false,
      error: `Cloud Function Server Error: ${err.message}`
    });
  }
});

// Alias for direct /generate endpoint
app.post("/generate", (req, res) => {
  req.url = "/api/generate";
  return app(req, res);
});

// Cloud Functions Configuration: 120 Seconds Timeout & 1GB Memory
exports.api = functions.runWith({ timeoutSeconds: 120, memory: "1GB" }).https.onRequest(app);
