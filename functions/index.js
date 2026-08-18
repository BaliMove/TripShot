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
  kelingking: "standing at the iconic T-Rex shaped cliff edge at Kelingking Beach Nusa Penida, turquoise ocean and white beach below, dramatic high angle, golden hour, 8k resolution",
  devils_tears: "standing on the rocky blowhole cliff edge at Devil's Tears Nusa Lembongan, massive ocean wave crashing dramatically into mist in background, sunset spray, cinematic lighting",
  bromo: "standing on the volcanic rim of active Mount Bromo crater in East Java, smoking caldera and vast sea of sand below, mystical sunrise light rays, photorealistic",
  ijen: "standing near the turquoise acidic crater lake of Kawah Ijen volcano, glowing blue sulfur flames through mystical morning fog, dramatic atmospheric lighting",
  tumpak_sewu: "standing prominently in the scenic foreground at Tumpak Sewu waterfall canyon in East Java, surrounded by the massive 120m curtain of cascading water, dramatic mist and lush tropical canopy",
  jomblang: "standing inside the dark cavern of Jomblang Cave Yogyakarta, magnificent beam of heavenly sunlight piercing down from the sinkhole roof, ethereal dust particles, magical atmosphere",
  timang: "riding a wooden rope gondola over crashing ocean waves at Timang Beach Yogyakarta, jagged rock island background, thrilling action angle",
  rinjani: "sitting at the high altitude crater rim ridge of Mount Rinjani Lombok, deep blue Segara Anak crater lake and volcano cone below, sea of clouds, epic mountain panorama",
  sipiso_piso: "standing on a cliff edge overlooking Sipiso-piso Waterfall in North Sumatra, a 120m vertical plunge waterfall cascading down a lush green gorge, Lake Toba in distance",
  wanagiri: "sitting on a giant woven bird nest platform protruding over Lake Buyan at Wanagiri Hidden Hills Bali, misty tropical lake panorama, romantic morning atmosphere",
  bali_swing: "sitting on a giant jungle swing in Bali, lush green tropical background, cinematic lighting, 8k",
  borobudur: "standing at Borobudur temple in Indonesia during a magical golden sunrise, ancient stupas, misty background, highly detailed",
  paris: "in front of Eiffel Tower in Paris, golden hour lighting, cinematic style, 8k",
  santorini: "standing on white dome balconies in Santorini Greece during sunset, Aegean sea background, 8k",

  // Studio & ID Photo Concepts
  corporate: "masterpiece studio portrait of a person wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  business_suit: "masterpiece studio portrait of a person wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  business: "masterpiece studio portrait of a person wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  studio: "professional studio headshot portrait, soft warm studio lighting, clean background, sharp focus, 8k photorealistic",
  id_photo: "official resume profile photo portrait, neat dark suit, solid clean background, professional lighting, 8k",
  passport: "official studio passport photo portrait, centered face, solid clean white background, formal suit jacket, 8k",
};

function parseCustomFixPrompt(customFixPrompt) {
  if (!customFixPrompt || !customFixPrompt.trim()) {
    return { enrichedDirective: "Enhance photorealistic quality and resemblance to original selfie", soloPrompt: "" };
  }
  const rawText = customFixPrompt.trim();
  const lower = rawText.toLowerCase();
  const directives = [];
  let soloPrompt = "";

  // 1. Face ID Lock (Multi-language)
  if (
    lower.includes("얼굴") || lower.includes("닮") || lower.includes("똑같이") || lower.includes("원본") || 
    lower.includes("face") || lower.includes("resemble") || lower.includes("likeness") || lower.includes("identical") ||
    lower.includes("顔") || lower.includes("似") || lower.includes("脸") || lower.includes("wajah")
  ) {
    directives.push("STRICT FACE ID LOCK: Exactly preserve the facial identity, eyes, nose, lips, facial bone structure, skin tone, and authentic smile from Image 1");
  }

  // 2. Character Addition (Spiderman, Superhero, Mascot, etc.)
  if (lower.includes("스파이더맨") || lower.includes("spider-man") || lower.includes("spiderman")) {
    directives.push("ADD SPIDER-MAN: Add ONLY Spider-Man in his classic red and blue superhero suit standing naturally posing next to the main subject. Strictly do NOT add any other extra people, random women, companions, or bystanders.");
    soloPrompt = "strictly only the main subject from Image 1 and Spider-Man, no other companions or background people";
  } else if (lower.includes("아이언맨") || lower.includes("ironman") || lower.includes("iron man")) {
    directives.push("ADD IRON MAN: Add ONLY Iron Man in his metallic armor suit next to the main subject.");
    soloPrompt = "strictly only the main subject from Image 1 and Iron Man, no other companions";
  }

  // 3. Remove other people / Exclusivity (~만 / only / solo)
  if (
    lower.includes("혼자") || lower.includes("1명") || lower.includes("지워") || lower.includes("다른 사람") || 
    lower.includes("solo") || lower.includes("alone") || lower.includes("remove people") || lower.includes("no bystander") ||
    lower.includes("만 ") || lower.includes("만 추가") || lower.includes("만 해") || lower.includes("only") ||
    lower.includes("一人") || lower.includes("其他人") || lower.includes("sendiri")
  ) {
    soloPrompt = "strictly only the primary foreground subject (and any explicitly requested character), completely remove and ignore all other cropped people, bystanders, and strangers";
    directives.push("REMOVE BACKGROUND & CROPPED PEOPLE: Erase all other people or partially cropped figures from Image 1, show only the main subject");
  }

  // 4. Props / Hands
  if (lower.includes("물병") || lower.includes("생수") || lower.includes("물") || lower.includes("bottle") || lower.includes("water bottle")) {
    directives.push("PROP IN HAND: Hold a transparent bottled water in hand naturally with realistic fingers and grip");
  } else if (lower.includes("커피") || lower.includes("음료") || lower.includes("잔") || lower.includes("coffee") || lower.includes("drink") || lower.includes("cup") || lower.includes("mug")) {
    directives.push("PROP IN HAND: Hold a beverage cup / coffee in hand naturally");
  } else if (lower.includes("카메라") || lower.includes("camera")) {
    directives.push("PROP IN HAND: Hold a camera in hands naturally");
  } else if (lower.includes("스마트폰") || lower.includes("핸드폰") || lower.includes("폰") || lower.includes("phone")) {
    directives.push("PROP IN HAND: Hold a smartphone in hand naturally");
  } else if (lower.includes("꽃") || lower.includes("flower") || lower.includes("bouquet")) {
    directives.push("PROP IN HAND: Hold fresh flowers / bouquet in hand");
  } else if (lower.includes("가방") || lower.includes("배낭") || lower.includes("bag") || lower.includes("backpack")) {
    directives.push("ACCESSORY: Wear / carry a stylish travel bag or backpack");
  }

  // 5. Fashion / Accessories
  if (lower.includes("선글라스") || lower.includes("sunglasses") || lower.includes("안경") || lower.includes("glasses")) {
    directives.push("ACCESSORY: Wear stylish sunglasses/glasses naturally on the face");
  }
  if (lower.includes("모자") || lower.includes("hat") || lower.includes("cap") || lower.includes("beanie")) {
    directives.push("ACCESSORY: Wear a stylish hat/cap on the head");
  }
  if (lower.includes("정장") || lower.includes("수트") || lower.includes("suit") || lower.includes("blazer")) {
    directives.push("ATTIRE: Dressed in an elegant tailored suit");
  } else if (lower.includes("원피스") || lower.includes("드레스") || lower.includes("dress")) {
    directives.push("ATTIRE: Dressed in an elegant resort dress");
  } else if (lower.includes("자켓") || lower.includes("코트") || lower.includes("jacket") || lower.includes("coat")) {
    directives.push("ATTIRE: Wearing a stylish jacket / coat");
  } else if (lower.includes("반팔") || lower.includes("t-shirt") || lower.includes("shirt") || lower.includes("셔츠")) {
    directives.push("ATTIRE: Wearing a clean tailored shirt");
  } else if (lower.includes("수영복") || lower.includes("비키니") || lower.includes("swimwear")) {
    directives.push("ATTIRE: Wearing stylish luxury resort swimwear");
  }

  // 6. Expression & Pose
  if (lower.includes("웃") || lower.includes("미소") || lower.includes("smile") || lower.includes("happy") || lower.includes("laugh")) {
    directives.push("EXPRESSION: Warm, cheerful, natural smile with teeth gently showing");
  } else if (lower.includes("시크") || lower.includes("진지") || lower.includes("serious") || lower.includes("chic") || lower.includes("confident")) {
    directives.push("EXPRESSION: Confident and chic calm expression looking at the camera");
  }

  if (lower.includes("전신") || lower.includes("발") || lower.includes("신발") || lower.includes("다리") || lower.includes("full body") || lower.includes("feet") || lower.includes("shoes")) {
    directives.push("FRAMING: Full body view showing head to toe with realistic footwear firmly on the ground");
  }

  // 7. Lighting & Atmosphere
  if (lower.includes("노을") || lower.includes("sunset") || lower.includes("석양") || lower.includes("golden hour")) {
    directives.push("LIGHTING: Warm golden hour sunset illumination with rich glowing amber rays");
  } else if (lower.includes("밝게") || lower.includes("bright") || lower.includes("화사")) {
    directives.push("LIGHTING: Make overall lighting brighter, cleaner, and more vibrant with soft natural illumination");
  }

  const enrichedDirective = directives.length > 0
    ? directives.join(". ")
    : `User specific request: "${rawText}"`;

  return { enrichedDirective, soloPrompt };
}

// Express /api/generate 100% Real Face + Multi-Person/Group & Full-Body Environmental Framing Endpoint
app.post("/api/generate", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  try {
    const {
      imageBase64,
      imageUrl,
      destination,
      styleId,
      stylePrompt,
      prompt,
      customPrompt,
      customBgBase64,
      enhanceStyle,
      customFixPrompt,
      rawCustomFixPrompt,
      previousImageUrl,
      bgColor
    } = req.body || {};

    const effectiveFixPrompt = (customFixPrompt || rawCustomFixPrompt || "").trim();

    // 1. Strict Validation - No Fake Data
    const userPhoto = imageBase64 || imageUrl;
    if (!userPhoto) {
      return res.status(400).json({
        success: false,
        error: "실제 사진을 먼저 업로드해 주세요."
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

    // Parse Selfie Base64
    let rawSelfieBase64 = userPhoto;
    let selfieMime = "image/jpeg";
    const selfieMatch = userPhoto.match(/^data:(image\/\w+);base64,(.+)$/);
    if (selfieMatch && selfieMatch.length === 3) {
      selfieMime = selfieMatch[1];
      rawSelfieBase64 = selfieMatch[2];
    } else if (userPhoto.includes("base64,")) {
      rawSelfieBase64 = userPhoto.split("base64,")[1];
    }

    // Parse Custom Background Base64 if present
    let rawBgBase64 = null;
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
    let rawPrevImageBase64 = null;
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
          console.warn("[Cloud Function api] Could not fetch previousImageUrl as binary buffer:", e);
        }
      }
    }

    const rawKey = (styleId || destination || "corporate").toLowerCase().trim().replace(/[-\s]/g, "_");

    let finalPrompt = "";
    if (customBgBase64) {
      const fixAddon = effectiveFixPrompt ? ` User fix request: ${effectiveFixPrompt}.` : "";
      finalPrompt = `A photorealistic high-end masterpiece portrait naturally integrating ALL person(s) present in Image 1 into the provided background photo (Image 2).
CRITICAL MANDATORY INSTRUCTIONS:
1. DETECT & PRESERVE EVERY REAL PERSON: Whether Image 1 contains a single person, a couple, or a group/family (3, 4, 5+ people), detect and include EVERY individual together in a unified, natural group composition.
2. PROMINENT SUBJECT FRAMING (NO TINY BODIES): Position all subjects prominently in the foreground or midground (Medium to Full Shot occupying 50%-75% of the frame height). DO NOT shrink people into tiny unidentifiable background figures. Ensure large, crystal-clear, high-resolution faces for every person.
3. EXACT 1:1 FACIAL FEATURE & IDENTITY LOCK: For each and every person from Image 1, transfer and preserve their EXACT real-life facial features with 100% precision (id_weight: 0.99). Match specific eye shape, eyelid fold, eyebrows, nose structure, smile/teeth, cheekbones, jawline, wrinkles/age lines, hairstyle, hairline, skin tone, and eyeglasses. DO NOT morph, generalize, or replace with generic AI stock faces.
4. AUTHENTIC LIGHTING & FEET GROUNDING: Match lighting and shadows seamlessly, with realistic footwear firmly standing on the ground surface.${fixAddon} Do not render any visible text, watermark, logos, or letters. CRITICAL NEGATIVE: different faces, morphed faces, random strangers, swapped people, stock models, distorted face, changed ethnicity, tiny unidentifiable people.`;
    } else {
      let basePrompt = "";
      if ((rawKey === "custom" || rawKey === "custom_travel" || (customPrompt && customPrompt.trim())) && customPrompt) {
        basePrompt = `naturally integrated into the scene: ${customPrompt.trim()}, cinematic lighting, 8k resolution, highly detailed`;
      } else if (MASTER_STYLE_PROMPT_MAP[rawKey]) {
        basePrompt = MASTER_STYLE_PROMPT_MAP[rawKey];
      } else if (prompt || stylePrompt) {
        basePrompt = prompt || stylePrompt;
      } else {
        basePrompt = `standing at ${rawKey.replace(/_/g, " ")}, full body or medium full view showing clothes, breathtaking scenic travel background, professional travel photography`;
      }

      // Studio background color customization (if provided)
      if (bgColor) {
        let bgStr = "solid pure white studio background";
        if (bgColor === "blue") bgStr = "solid clean light blue passport ID background";
        if (bgColor === "gray") bgStr = "solid clean light gray studio background";
        basePrompt += `. Background: ${bgStr}.`;
      }

      const fixAddon = effectiveFixPrompt ? ` User refinement request: ${effectiveFixPrompt}.` : "";
      finalPrompt = `A photorealistic travel photography masterpiece seamlessly integrating ALL person(s) present in Image 1 into the scene: ${basePrompt}.
CRITICAL MANDATORY INSTRUCTIONS:
1. DETECT & PRESERVE EVERY REAL PERSON: Detect and include EVERY individual subject present in Image 1 (whether 1 person, 2 people, or a family/group of 3~12+ people). Place all subjects together with natural, cohesive poses.
2. PROMINENT SUBJECT FRAMING (LARGE CLEAR FACES): Position the subjects prominently in the foreground / midground (Medium-Full Group Shot framing, occupying 50%-75% of vertical frame). DO NOT shrink people into tiny distant dots. Every person's face must be large, well-lit, and high-resolution.
3. STRICT 1:1 FACIAL FEATURE & EXPRESSION LOCK: Transfer and preserve the EXACT real-life facial features of EVERY single person in Image 1 (id_weight: 0.99). Reconstruct each person's exact eye shape, eyelids, nose bridge, lips, smile curvature, teeth, jawline, facial proportions, age, skin complexion, hair style, and glasses. Absolutely DO NOT generalize, morph, or replace with generic AI faces.
4. PROFESSIONAL LIGHTING & COMPOSITION: Flattering natural travel photography illumination with authentic contact shadows.${fixAddon} Do not render any visible text, watermark, logos, or letters. CRITICAL NEGATIVE: different faces, morphed faces, random strangers, swapped people, stock models, distorted face, changed ethnicity, tiny unidentifiable people.`;

      if (rawPrevImageBase64) {
        const { enrichedDirective, soloPrompt } = parseCustomFixPrompt(effectiveFixPrompt);
        finalPrompt = `CRITICAL MANDATORY INSTRUCTION FOR IMAGE MODIFICATION & REFINEMENT:
1. THEME & ENVIRONMENT: Seamlessly place the subject(s) into the target theme: ${basePrompt}.
2. STRICT 1:1 EXACT FACE ID LOCK: Preserve 100% exact facial identity, eyes, nose, lips, jawline, facial bone structure, skin tone, and authentic likeness of EVERY real person from Image 1 (ORIGINAL USER PHOTO) with id_weight: 0.99. Keep faces large, clear, and prominently framed.
3. USER REQUESTED MODIFICATIONS: Apply the user's specific requested changes with high precision: ${enrichedDirective}. ${soloPrompt ? `Ensure: ${soloPrompt}.` : ""}
4. AUTHENTIC HIGH-END COMPOSITION: Maintain the styled travel/concept attire and scenic backdrop while perfecting each person's face to match Image 1 authentically. Do not render any visible text, watermark, logos, or letters. CRITICAL NEGATIVE: unchanged raw room background, unstyled clothes, different faces, morphed faces, random strangers, swapped people, stock models, distorted face, changed ethnicity, tiny people.`;
      }
    }

    // 3. Google Gemini 3.1 Flash Lite 100% Primary Vision Engine
    const { GoogleGenAI } = require("@google/genai");
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    const inputs = [{ type: "text", text: finalPrompt }];
    inputs.push({ type: "image", data: rawSelfieBase64, mime_type: selfieMime });
    if (rawPrevImageBase64) {
      inputs.push({ type: "image", data: rawPrevImageBase64, mime_type: prevMime });
    } else if (rawBgBase64) {
      inputs.push({ type: "image", data: rawBgBase64, mime_type: bgMime });
    }

    const callModel = async (modelName) => {
      const startTime = Date.now();
      const interaction = await ai.interactions.create({
        model: modelName,
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
          engine: modelName,
          timeSec
        };
      }
      return null;
    };

    const modelsToTry = [
      "gemini-3.1-flash-lite-image",
      "gemini-3.1-flash-image",
      "gemini-2.5-flash",
      "imagen-3.0-generate-002"
    ];

    let lastErrorMsg = "";
    for (const m of modelsToTry) {
      try {
        console.log(`[Cloud Function api] Trying model: ${m}`);
        const result = await callModel(m);
        if (result) {
          console.log(`[Cloud Function api] Success with engine ${m} in ${result.timeSec}s`);
          return res.json({
            success: true,
            imageUrl: result.imageUrl,
            engine: result.engine,
            styleKey: rawKey,
            lite: { success: true, imageUrl: result.imageUrl, timeSec: result.timeSec, engine: result.engine },
            pro: { success: true, imageUrl: result.imageUrl, timeSec: result.timeSec, engine: result.engine }
          });
        }
      } catch (err) {
        lastErrorMsg = err.message || String(err);
        console.warn(`[Cloud Function api] Model ${m} failed: ${lastErrorMsg}`);
      }
    }

    return res.status(500).json({
      success: false,
      error: `Google Gemini AI 화보 생성 실패 (${lastErrorMsg})`
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
