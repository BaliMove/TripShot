const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();

// 1. Allow CORS for tripshot.world
app.use(cors({ origin: true }));
app.use(express.json({ limit: "30mb" }));

// 100% Synced Master Style Prompt Dictionary (Identical to app/lib/styles.ts)
const MASTER_STYLE_PROMPT_MAP = {
  // Extreme Destinations
  trolltunga: "sitting safely on the edge of Trolltunga cliff Norway, 700m abyss below, dramatic fjord view, cinematic rim light, 8k",
  devils_pool: "medium shot portrait resting hands naturally on edge of Victoria Falls Devil's Pool Zambia, 108m waterfall cliff plunge, vibrant vivid rainbow mist in background, natural smile, epic travel photography, photorealistic 8k",
  kjeragbolten: "standing on Kjeragbolten wedged rock in Norway, 1000m cliff gap, breathtaking mountain panorama, 8k",
  huashan_plank: "walking on the narrow Huashan plank walk cliff edge in China, steep mountain cliff drop, extreme thrill, 8k",
  pedra_telegrafo: "hanging from Pedra do Telégrafo rock Brazil with optical illusion cliff effect, ocean background, golden hour, 8k",
  death_road: "standing with a mountain bike at Yungas Death Road Bolivia edge, misty cliff abyss, dramatic landscape, 8k",
  yasur_volcano: "standing safely near Mt. Yasur erupting volcano in Vanuatu, glowing red lava smoke, epic night atmosphere, 8k",
  trift_bridge: "standing on Trift suspension bridge in Swiss Alps, 100m high valley suspension bridge, snowy mountains, 8k",
  rooftopping: "sitting on a skyscraper rooftop ledge in Dubai/NYC at night, hyper-realistic urban skyline glow below, 8k",
  jacobs_well: "diving into Jacob's Well underwater cave pool in Texas, crystal clear deep blue water, underwater rays, 8k",

  // Indonesia & Bali Spots
  kelingking: "A solo traveler naturally integrated into the scene, sitting on the narrow edge of the iconic T-Rex shaped cliff at Kelingking Beach Nusa Penida, turquoise ocean and white beach far below, dramatic high angle shot, golden hour, 8k resolution",
  devils_tears: "A solo traveler naturally integrated into the scene, standing on the rocky blowhole cliff edge at Devil's Tears Nusa Lembongan, massive ocean wave crashing dramatically into mist in background, sunset spray, cinematic lighting",
  bromo: "A solo traveler naturally integrated into the scene, standing on the narrow volcanic rim of active Mount Bromo crater in East Java, smoking caldera and vast sea of sand below, mystical sunrise light rays, photorealistic",
  ijen: "A solo traveler naturally integrated into the scene, standing near the turquoise acidic crater lake of Kawah Ijen volcano, glowing blue sulfur flames through mystical morning fog, dramatic atmospheric lighting",
  tumpak_sewu: "A solo traveler naturally integrated into the scene, standing at the bottom of Tumpak Sewu waterfall canyon in East Java, surrounded by a massive 120m curtain of cascading water, dramatic mist and lush tropical canopy",
  jomblang: "A solo traveler naturally integrated into the scene, standing inside the dark cavern of Jomblang Cave Yogyakarta, magnificent beam of heavenly sunlight piercing down from the sinkhole roof, ethereal dust particles, magical atmosphere",
  timang: "A solo traveler naturally integrated into the scene, riding a primitive wooden cable car over violent crashing ocean waves at Timang Beach Yogyakarta, jagged rock island background, thrilling action angle",
  rinjani: "A solo traveler naturally integrated into the scene, sitting at the high altitude crater rim ridge of Mount Rinjani Lombok, deep blue Segara Anak crater lake and volcano cone below, sea of clouds, epic mountain panorama",
  sipiso_piso: "A solo traveler naturally integrated into the scene, standing on a cliff edge overlooking Sipiso-piso Waterfall in North Sumatra, a 120m vertical plunge waterfall cascading down a lush green gorge, Lake Toba in distance",
  wanagiri: "A solo traveler naturally integrated into the scene, sitting on a giant woven bird nest platform protruding over Lake Buyan at Wanagiri Hidden Hills Bali, misty tropical lake panorama, romantic morning atmosphere",
  bali_swing: "A stunning travel photo sitting on a giant jungle swing in Bali, lush green tropical background, cinematic lighting, 8k",
  borobudur: "A breathtaking travel portrait standing at Borobudur temple in Indonesia during a magical golden sunrise, ancient stupas, misty background, highly detailed",
  paris: "A romantic travel portrait in front of Eiffel Tower in Paris, golden hour lighting, cinematic style, 8k",
  santorini: "A picturesque travel photo standing on white dome balconies in Santorini Greece during sunset, Aegean sea background, 8k",

  // Studio & ID Photo Concepts
  corporate: "masterpiece studio portrait of a person wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  business_suit: "masterpiece studio portrait of a person wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  business: "masterpiece studio portrait of a person wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  studio: "professional studio headshot portrait, soft warm studio lighting, clean background, sharp focus, 8k photorealistic",
  id_photo: "official resume profile photo portrait, neat dark suit, solid clean background, professional lighting, 8k",
  passport: "official studio passport photo portrait, centered face, solid clean white background, formal suit jacket, 8k",
};

// Express /api/generate 100% Real Face + Full-Body/Wide Environmental Scenic Framing Endpoint
app.post("/api/generate", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  try {
    const { imageBase64, imageUrl, destination, styleId, stylePrompt, prompt, customPrompt, customBgBase64, rawCustomFixPrompt } = req.body || {};
    
    // 1. Strict Validation - No Fake Data
    const userPhoto = imageBase64 || imageUrl;
    if (!userPhoto) {
      return res.status(400).json({
        success: false,
        error: "실제 셀카 사진을 먼저 업로드해 주세요."
      });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error("[Cloud Function api] Missing GEMINI_API_KEY environment variable.");
      return res.status(500).json({
        success: false,
        error: "서버 설정 오류: GEMINI_API_KEY 환경 변수가 구성되지 않았습니다."
      });
    }

    const rawKey = (styleId || destination || "corporate").toLowerCase().trim().replace(/[-\s]/g, "_");

    // 2. Exact Prompt Priority: 1st: stylePrompt/prompt from Frontend -> 2nd: MASTER_STYLE_PROMPT_MAP -> 3rd: Fallback
    let basePrompt = prompt || stylePrompt || MASTER_STYLE_PROMPT_MAP[rawKey];

    if (!basePrompt || !basePrompt.trim()) {
      basePrompt = `standing at ${rawKey.replace(/_/g, " ")}, full body or upper body view showing clothes, breathtaking wide scenic travel background, professional outdoor travel photography`;
    }

    if (customPrompt && customPrompt.trim()) {
      basePrompt = `${customPrompt.trim()}, wide scenic background`;
    }

    const finalPrompt = `A photorealistic travel portrait naturally integrating the person from Image 1, medium shot showing upper body and natural posture, ${basePrompt}, cinematic lighting, photorealistic 8k, epic scenic travel background`;

    // 3. Google Gemini 3.1 Flash Lite 100% Primary Vision Engine (Identical to local localhost:3001)
    const { GoogleGenAI } = require("@google/genai");
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    let rawSelfieBase64 = userPhoto;
    let selfieMime = "image/jpeg";
    const selfieMatch = userPhoto.match(/^data:(image\/\w+);base64,(.+)$/);
    if (selfieMatch && selfieMatch.length === 3) {
      selfieMime = selfieMatch[1];
      rawSelfieBase64 = selfieMatch[2];
    } else if (userPhoto.includes("base64,")) {
      rawSelfieBase64 = userPhoto.split("base64,")[1];
    }

    const inputs = [
      { type: "text", text: finalPrompt },
      { type: "image", data: rawSelfieBase64, mime_type: selfieMime }
    ];

    const startTime = Date.now();
    let geminiAiImageUrl = null;
    let usedEngine = "gemini-2.5-flash";

    // Method 1: Try Official GoogleGenAI SDK generateImages for Imagen 3
    try {
      console.log("[Cloud Function api] Method 1: Trying ai.models.generateImages (Imagen 3)");
      const imagenRes = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: finalPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: "image/jpeg",
          aspectRatio: "3:4"
        }
      });
      console.log("[Cloud Function api] Imagen Raw Response:", JSON.stringify(imagenRes, null, 2));

      const base64Data = imagenRes?.generatedImages?.[0]?.image?.imageBytes;
      if (base64Data) {
        geminiAiImageUrl = `data:image/jpeg;base64,${base64Data}`;
        usedEngine = "imagen-3.0-generate-002";
      }
    } catch (imagenErr) {
      console.error("[Cloud Function api] Method 1 Imagen failed with details:", JSON.stringify(imagenErr, Object.getOwnPropertyNames(imagenErr), 2));
      console.warn("[Cloud Function api] Method 1 Imagen failed message:", imagenErr.message);
    }

    // Method 2: Try Official GoogleGenAI SDK generateContent for Gemini 2.5/2.0 Vision
    if (!geminiAiImageUrl) {
      const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash"];
      for (const m of modelsToTry) {
        try {
          console.log(`[Cloud Function api] Method 2: Trying ai.models.generateContent (${m})`);
          const response = await ai.models.generateContent({
            model: m,
            contents: [
              finalPrompt,
              {
                inlineData: {
                  data: rawSelfieBase64,
                  mimeType: selfieMime
                }
              }
            ]
          });
          console.log(`[Cloud Function api] Gemini Raw Response for ${m}:`, JSON.stringify(response, null, 2));

          const candidates = response?.candidates || response?.response?.candidates;
          const parts = candidates?.[0]?.content?.parts || [];
          const imgPart = parts.find((p) => p.inlineData || p.inline_data);
          const base64Data = imgPart?.inlineData?.data || imgPart?.inline_data?.data;

          if (base64Data) {
            geminiAiImageUrl = `data:image/png;base64,${base64Data}`;
            usedEngine = m;
            break;
          }
        } catch (mErr) {
          console.warn(`[Cloud Function api] Method 2 ${m} failed:`, mErr.message);
        }
      }
    }

    // Method 3: Try Experimental ai.interactions.create
    if (!geminiAiImageUrl) {
      try {
        console.log("[Cloud Function api] Method 3: Trying ai.interactions.create (gemini-3.1-flash-lite-image)");
        const interaction = await ai.interactions.create({
          model: "gemini-3.1-flash-lite-image",
          input: inputs,
          response_format: {
            type: "image",
            aspect_ratio: "3:4",
            image_size: "2K"
          }
        });
        console.log("[Cloud Function api] Interaction Raw Response:", JSON.stringify(interaction, null, 2));

        const base64Data = 
          interaction?.output_image?.data ||
          interaction?.candidates?.[0]?.content?.parts?.find((p) => p.inline_data || p.inlineData)?.inline_data?.data ||
          interaction?.candidates?.[0]?.content?.parts?.find((p) => p.inline_data || p.inlineData)?.inlineData?.data;

        if (base64Data) {
          geminiAiImageUrl = `data:image/png;base64,${base64Data}`;
          usedEngine = "gemini-3.1-flash-lite-image";
        }
      } catch (intErr) {
        console.warn("[Cloud Function api] Method 3 Interaction failed:", intErr.message);
      }
    }

    if (geminiAiImageUrl) {
      const timeSec = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[Cloud Function api] Google Gemini Image Success (${usedEngine}) for '${rawKey}' in ${timeSec}s`);
      return res.json({
        success: true,
        imageUrl: geminiAiImageUrl,
        engine: usedEngine,
        styleKey: rawKey,
        lite: {
          success: true,
          imageUrl: geminiAiImageUrl,
          timeSec: timeSec,
          engine: usedEngine,
          styleKey: rawKey
        },
        pro: {
          success: true,
          imageUrl: geminiAiImageUrl,
          timeSec: timeSec,
          engine: usedEngine,
          styleKey: rawKey
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: "Google Gemini AI 응답에 이미지 데이터가 생성되지 않았습니다."
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
