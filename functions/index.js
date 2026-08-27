const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const zlib = require("zlib");

const app = express();

// 1. Allow CORS for tripshot.world
app.use(cors({ origin: true }));
app.use(express.json({ limit: "30mb" }));

// Helper to generate an authentic, pristine solid color PNG image buffer in memory
function createSolidPng(width, height, r, g, b) {
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
    }
  }
  const compressed = zlib.deflateSync(rawData);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type, "ascii");
    const crc = Buffer.alloc(4);
    const c = zlib.crc32(Buffer.concat([t, data]));
    crc.writeUInt32BE(c, 0);
    return Buffer.concat([len, t, data, crc]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const png = Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", compressed), chunk("IEND", Buffer.alloc(0))]);
  return png.toString("base64");
}

// 100% Synced Master Style Prompt Dictionary (Identical to app/lib/styles.ts)
const MASTER_STYLE_PROMPT_MAP = {
  // Extreme Destinations
  trolltunga: "standing safely and naturally near the iconic cliff edge of Trolltunga Norway in stylish outdoor mountain travel attire, environmental knee-up travel shot (occupying 33% to 40% of frame for crisp facial detail), 700m fjord abyss and snow peaks glowing in background, cinematic golden hour lighting, 8k",
  devils_pool: "safely resting naturally near the edge of Victoria Falls Devil's Pool Zambia in stylish travel swimwear/attire, environmental medium-full shot (occupying 33% to 40% of frame for crisp facial detail), 108m waterfall cliff plunge and rainbow mist in background, epic travel photography, 8k",
  kjeragbolten: "standing naturally on Kjeragbolten wedged rock in Norway in stylish mountain travel gear, knee-up environmental travel shot (occupying 33% to 40% of frame for crisp facial detail), vast deep fjord abyss below, 8k",
  huashan_plank: "walking naturally along the narrow Huashan plank walk in China in stylish adventure travel gear, environmental knee-up shot (occupying 33% to 40% of frame), misty mountain peaks in background, 8k",
  pedra_telegrafo: "at Pedra do Telégrafo rock Brazil in stylish travel clothes, environmental medium-full shot (occupying 33% to 40% of frame), sweeping ocean panorama below, golden sunset glow, 8k",
  death_road: "standing with a bike at Yungas Death Road Bolivia in adventure cycling attire, environmental knee-up shot (occupying 33% to 40% of frame), misty cliff abyss in background, 8k",
  yasur_volcano: "standing safely near Mt. Yasur volcano in Vanuatu in stylish travel jacket, environmental medium-full shot (occupying 33% to 40% of frame), glowing red lava fireworks in night background, 8k",
  trift_bridge: "walking gracefully on Trift suspension bridge in Swiss Alps in stylish alpine travel coat, environmental knee-up shot (occupying 33% to 40% of frame), turquoise glacier lake below, 8k",
  rooftopping: "at an open-air luxury rooftop lounge in Dubai in glamorous evening travel attire, environmental medium-full shot (occupying 33% to 40% of frame), glittering city skyline and Burj Khalifa in background, 8k",
  jacobs_well: "swimming gracefully in Jacob's Well natural cave pool in Texas in stylish swimwear, environmental shot (occupying 33% to 40% of frame), crystal clear turquoise water rays, 8k",

  // Indonesia & Bali Spots
  kelingking: "standing gracefully at the scenic viewpoint overlooking the iconic T-Rex cliff and turquoise beach at Kelingking Nusa Penida in chic tropical travel dress/attire, environmental knee-up shot (occupying 33% to 40% of frame for crisp facial detail), golden hour, 8k",
  devils_tears: "standing safely on the coastal cliff at Devil's Tears Nusa Lembongan in stylish ocean travel attire, environmental medium-full shot (occupying 33% to 40% of frame), massive ocean wave mist crashing in background, sunset spray, 8k",
  bromo: "standing at Mount Bromo crater rim in East Java in warm stylish travel jacket and scarf, environmental knee-up shot (occupying 33% to 40% of frame for crisp facial detail), vast sea of sand and smoking caldera in background, sunrise rays, 8k",
  ijen: "standing near the turquoise acidic crater lake of Kawah Ijen in stylish travel gear, environmental knee-up shot (occupying 33% to 40% of frame), ethereal morning sulfur mist, 8k",
  tumpak_sewu: "standing at the viewpoint of Tumpak Sewu waterfall canyon in East Java in stylish adventure travel clothes, environmental knee-up shot (occupying 33% to 40% of frame for crisp facial detail), massive 120m curtain waterfall in background, 8k",
  jomblang: "inside the vast cavern of Jomblang Cave Yogyakarta in stylish explorer gear, environmental medium-full shot (occupying 33% to 40% of frame), heavenly light beam piercing down from sinkhole roof in background, 8k",
  timang: "riding the wooden rope gondola at Timang Beach Yogyakarta in stylish travel clothes, environmental medium-full shot (occupying 33% to 40% of frame), crashing turquoise ocean waves below, 8k",
  rinjani: "at the crater rim ridge of Mount Rinjani Lombok in stylish trekking gear, environmental knee-up shot (occupying 33% to 40% of frame), deep blue Segara Anak lake and volcanic peak in background, sea of clouds, 8k",
  sipiso_piso: "overlooking Sipiso-piso Waterfall in North Sumatra in stylish travel attire, environmental knee-up shot (occupying 33% to 40% of frame), 120m plunge waterfall and Lake Toba in background, 8k",
  wanagiri: "sitting gracefully on the giant woven bird nest platform at Wanagiri Hidden Hills Bali in stylish vacation attire, environmental medium-full shot (occupying 33% to 40% of frame), misty Lake Buyan in background, 8k",
  bali_swing: "soaring gracefully on the giant jungle swing in Bali in a flowing elegant vacation dress/attire, environmental medium-full shot (occupying 33% to 40% of frame), lush palm canopy in background, golden hour rim light, 8k",
  borobudur: "walking peacefully along the stone terrace of Borobudur temple in Indonesia in elegant modest travel attire, environmental knee-up shot (occupying 33% to 40% of frame for crisp facial detail), ancient stupas and misty sunrise in background, 8k",
  paris: "standing gracefully on the Trocadéro terrace in Paris in chic stylish Parisian vacation attire (elegant trench coat or chic casual knitwear), environmental knee-up travel shot (occupying 33% to 40% of frame height for crisp facial detail), the entire iconic Eiffel Tower standing majestically in background against golden hour sky, authentic candid vacation lifestyle photograph, 8k",
  santorini: "standing on a white terrace in Santorini Greece in chic Mediterranean resort wear, environmental knee-up shot (occupying 33% to 40% of frame), blue domes and Aegean sea sunset in background, warm glow, 8k",

  // Studio & ID Photo Concepts
  corporate: "masterpiece studio portrait of a person wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  business_suit: "masterpiece studio portrait of a person wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  business: "masterpiece studio portrait of a person wearing a sharp formal navy blue business suit jacket, white shirt, elegant modern office glass background, professional corporate headshot, photorealistic 8k",
  studio: "professional studio headshot portrait, soft warm studio lighting, clean background, sharp focus, 8k photorealistic",
  id_photo: "Official standard ID card photo specification (resident card / driver's license standard). Centered head-and-shoulders bust shot. Headroom 15% to 20% clear solid background space above hair. Face occupies 48% to 54% of vertical frame height. Neatly tailored dark business suit and white shirt, perfectly centered front-facing posture, natural calm expression, symmetrical shoulders, sharp focus on eyes, 8k",
  passport: "Official ICAO compliant international passport photo specification. Centered front-facing official passport portrait. Headroom 15% to 20% clear solid background space above hair crown. Face occupies 48% to 54% of vertical frame height. Visible neck, collarbones, and neat symmetrical shoulders, dark formal attire, 8k",
  student: "Clean smart casual student ID and young professional profile portrait. Upper-chest portrait with 15% to 20% headroom above hair. Face occupies 46% to 52% of vertical frame height. Crisp button-down oxford shirt, friendly warm confident smile, bright flattering studio lighting, 8k",
};

function parseCustomFixPrompt(customFixPrompt) {
  if (!customFixPrompt || !customFixPrompt.trim()) {
    return { enrichedDirective: "Enhance photorealistic quality and 100% exact resemblance to original selfie", soloPrompt: "" };
  }
  const rawText = customFixPrompt.trim();
  const lower = rawText.toLowerCase();
  const directives = [];
  let soloPrompt = "";

  // 0. 배경만 변경 & 인물/얼굴 그대로 보존 (최우선 감지: "배경만", "배경 바꿔", "얼굴은 그대로" 등)
  if (
    lower.includes("배경만") || lower.includes("배경 변경") || lower.includes("배경 바꿔") || 
    lower.includes("배경 수정") || lower.includes("얼굴은 그대로") || lower.includes("얼굴 그대로") || 
    lower.includes("인물 그대로") || lower.includes("사람 그대로") || lower.includes("only change background") || 
    lower.includes("change background only") || lower.includes("keep face") || lower.includes("keep people") || 
    lower.includes("背景だけ") || lower.includes("只换背景")
  ) {
    directives.push(
      "CRITICAL DIRECTIVE - KEEP ALL PERSONS & FACES 100% UNTOUCHED, CHANGE ONLY THE BACKGROUND: Detect and preserve EVERY SINGLE PERSON from Image 1 exactly as they are. DO NOT drop, crop, or zoom in on just one person. Keep all original faces, eyes, noses, mouths, smiles, expressions, hairstyles, poses, and group arrangement 100% authentic from Image 1, and ONLY replace/render the background environment."
    );
    soloPrompt = ""; // 단독 모드로 축소되는 것을 원천 차단
  }
  // 1. Face ID Lock (Multi-language)
  else if (
    lower.includes("얼굴") || lower.includes("닮") || lower.includes("똑같이") || lower.includes("원본") || 
    lower.includes("face") || lower.includes("resemble") || lower.includes("likeness") || lower.includes("identical") ||
    lower.includes("顔") || lower.includes("似") || lower.includes("脸") || lower.includes("wajah")
  ) {
    directives.push("CRITICAL 1:1 REAL FACE FIDELITY (id_weight: 1.0): Reconstruct the exact authentic facial features of the real person in Image 1 (identical eye shape, authentic eye size, authentic nose bridge width and tip, natural mouth, teeth, smile, authentic cheekbones and jawline, authentic skin tone, bangs, and natural hair texture). Under NO circumstances should the face be replaced with a different person or generic model.");
  }

  // 2. Character Addition (Spiderman, Superhero, Mascot, etc.)
  if (lower.includes("스파이더맨") || lower.includes("spider-man") || lower.includes("spiderman")) {
    directives.push("ADD SPIDER-MAN: Add ONLY Spider-Man in his classic red and blue superhero suit standing naturally posing next to the main subject. Strictly do NOT add any other extra people, random women, companions, or bystanders.");
    soloPrompt = "strictly only the main subject from Image 1 and Spider-Man, no other companions or background people";
  } else if (lower.includes("아이언맨") || lower.includes("ironman") || lower.includes("iron man")) {
    directives.push("ADD IRON MAN: Add ONLY Iron Man in his metallic armor suit next to the main subject.");
    soloPrompt = "strictly only the main subject from Image 1 and Iron Man, no other companions";
  }

  // 3. Remove other people / Exclusivity (~만 / only / solo) - "배경만"이 아닐 때만 발동!
  if (
    !lower.includes("배경만") && !lower.includes("배경 바꿔") && !lower.includes("얼굴은 그대로") && (
      lower.includes("혼자") || lower.includes("1명만") || lower.includes("다른 사람 지워") || 
      lower.includes("solo") || lower.includes("alone") || lower.includes("remove people") || lower.includes("no bystander") ||
      lower.includes("1명만 남겨") || lower.includes("一人だけ") || lower.includes("其他人去掉") || lower.includes("sendiri saja")
    )
  ) {
    soloPrompt = "strictly only the primary foreground subject, completely remove and ignore all other cropped people, bystanders, and strangers";
    directives.push("REMOVE BACKGROUND & CROPPED PEOPLE: Erase all other people or partially cropped figures from Image 1, show only the main subject");
  }

  // 3-B. Remove Unwanted Objects & Background Inpainting
  if (
    lower.includes("개체 삭제") || lower.includes("개체 지워") || lower.includes("사물 삭제") || lower.includes("사물 지워") ||
    lower.includes("물건 지워") || lower.includes("물건 삭제") || lower.includes("물체 삭제") || lower.includes("물체 지워") ||
    lower.includes("불필요한") || lower.includes("장애물") || lower.includes("지우개") || lower.includes("쓰레기 지워") ||
    lower.includes("remove object") || lower.includes("remove clutter") || lower.includes("erase item") || 
    lower.includes("clean background") || lower.includes("delete obstacle") || lower.includes("オブジェクト削除") || 
    lower.includes("消除物体") || lower.includes("hapus objek")
  ) {
    directives.push(
      "OBJECT REMOVAL & CLEAN BACKGROUND INPAINTING: Seamlessly remove, erase, and inpaint over any distracting background objects, unwanted clutter, trash, powerlines, stray items, foreign obstacles, and photobombers. Fill the removed areas with organic, clean, and harmonized background environment matching the surrounding natural scenery and lighting."
    );
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
  } else if (lower.includes("밝게") || lower.includes("bright") || lower.includes("화사") || lower.includes("sunny")) {
    directives.push("LIGHTING: Make overall lighting brighter, cleaner, and more vibrant with soft natural illumination");
  }

  const enrichedDirective = directives.length > 0
    ? directives.join(". ")
    : `User specific refinement request: "${rawText}". Ensure 100% exact facial preservation of all real people from Image 1.`;

  return { enrichedDirective, soloPrompt };
}

function buildPersonalizedLearningPrompt(prefs) {
  if (!prefs || (prefs.learningLevel <= 1 && (!prefs.preferredExpressions?.length && !prefs.preferredLighting?.length && !prefs.preferredFidelity?.length && !prefs.preferredProportions?.length))) {
    return "";
  }
  const directives = [];
  if (prefs.preferredFidelity && prefs.preferredFidelity.length > 0) {
    directives.push(`FACE FIDELITY LOCK: ${prefs.preferredFidelity.slice(-1).join(", ")}`);
  }
  if (prefs.preferredProportions && prefs.preferredProportions.length > 0) {
    directives.push(`PROPORTION RULE: ${prefs.preferredProportions.slice(-1).join(", ")}`);
  }
  if (prefs.preferredRealism && prefs.preferredRealism.length > 0) {
    directives.push(`PHYSICAL REALISM: ${prefs.preferredRealism.slice(-1).join(", ")}`);
  }
  if (prefs.preferredExpressions && prefs.preferredExpressions.length > 0) {
    directives.push(`EXPRESSION PREFERENCE: ${prefs.preferredExpressions.slice(-2).join(", ")}`);
  }
  if (prefs.preferredLighting && prefs.preferredLighting.length > 0) {
    directives.push(`LIGHTING PREFERENCE: ${prefs.preferredLighting.slice(-2).join(", ")}`);
  }
  if (prefs.preferredFraming && prefs.preferredFraming.length > 0) {
    directives.push(`COMPOSITION PREFERENCE: ${prefs.preferredFraming.slice(-1).join(", ")}`);
  }
  if (prefs.preferredAccessories && prefs.preferredAccessories.length > 0) {
    directives.push(`ACCESSORY SYNERGY: When appropriate, complement with ${prefs.preferredAccessories.slice(-2).join(", ")}`);
  }
  if (directives.length === 0) return "";
  return `\nUSER PERSONALIZED ADAPTIVE MEMORY (Learned from User History Lv.${prefs.learningLevel}):\n${directives.map((d, i) => `${i + 1}. ${d}`).join("\n")}\nApply these learned personalized aesthetic preferences seamlessly while preserving 100% authentic facial fidelity.`;
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
      bgColor,
      userPreferences,
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
    const isIdPhotoStyle = ["id_photo", "passport", "student"].includes(rawKey);

    // CRITICAL: For ID Photo styles, inject an authentic pristine solid color studio backdrop image as Image 2
    if (isIdPhotoStyle && !rawBgBase64) {
      if (bgColor === "blue") {
        rawBgBase64 = createSolidPng(600, 800, 235, 243, 252); // #EBF3FC (Light pastel cyan blue)
      } else if (bgColor === "gray") {
        rawBgBase64 = createSolidPng(600, 800, 242, 244, 248); // #F2F4F8 (Light neutral studio gray)
      } else {
        rawBgBase64 = createSolidPng(600, 800, 255, 255, 255); // #FFFFFF (Pure solid white)
      }
      bgMime = "image/png";
    }

    let finalPrompt = "";
    if (customBgBase64) {
      const fixAddon = effectiveFixPrompt ? ` User modification instruction: ${effectiveFixPrompt}.` : "";
      const customPromptAddon = customPrompt ? ` Custom style/scene direction: ${customPrompt.trim()}.` : "";
      finalPrompt = `[MANDATORY MULTI-IMAGE ROLE SPECIFICATION]:
- Image 1: PRIMARY & EXCLUSIVE REAL FACE IDENTITY SOURCE (id_weight: 1.0).
  The person in Image 1 is the ONLY subject who must appear in the final photo. Reconstruct 100% EXACT authentic facial structure: exact eye shape, natural eyelid fold, exact eye size and distance, authentic nose contour (maintain exact nose tip width and bridge curve, DO NOT sharpen or elongate), natural lip shape and smile lines, authentic cheekbone and jawline curvature (maintain exact natural face shape from Image 1, DO NOT elongate or reshape the jaw), authentic age, skin tone, and facial bone structure. ZERO hallucination, ZERO feature morphing. Every single facial proportion from Image 1 MUST be 100% identical.
- Image 2: VACANT LOCATION & ARCHITECTURAL BACKGROUND ONLY.
  Image 2 provides strictly the physical venue/location reference (e.g. padel tennis court, stadium lights, glass walls, cliff edge, suspension bridge).
  CRITICAL: COMPLETELY PURGE & ERASE ANY PRE-EXISTING PLAYERS, ATHLETES, OR BYSTANDERS originally visible in Image 2. Treat Image 2 as a completely empty stage. DO NOT borrow, blend, or cross-contaminate any facial features, body shape, or hair from anyone originally in Image 2!

[REALISTIC SPORTS & PHYSICAL REALISM]:
- CRITICAL BALL PHYSICS & REALISM: Strictly DO NOT glue or stick a ball to the racket face! In authentic professional sports photography, players either hold their racket naturally in a confident athletic ready stance (NO ball touching the racket strings at all), OR the ball is captured in realistic mid-air motion with natural motion blur away from the racket. A ball glued or frozen onto the racket strings looks completely fake and AI-generated. NEVER render a ball attached or stuck to the racket!

[CONTEXT-AWARE OPTIMAL HERO PLACEMENT & GOLDEN-RATIO FRAMING]:
(masterpiece, best quality:1.2), RAW unretouched travel photo, 8k uhd, shot on Canon EOS R5 with 35mm-50mm environmental prime lens at f/2.8.
1. CONTEXT-AWARE HERO POSITIONING: Intelligently analyze the physical terrain of Image 2 and place the person from Image 1 at the MOST DRAMATIC & NATURAL HERO SPOT:
   - If Image 2 is a sports court (e.g. padel tennis, court): Position the subject in the foreground/midground in a natural athletic ready stance, holding the paddle racket naturally by the grip, ready for action.
   - If Image 2 is a cliff, rock ledge, or mountain overlook: Position the subject securely in the foreground/midground standing naturally on the rock overlook.
   - If Image 2 is a bridge, walkway, or rooftop terrace: Position the subject standing proudly at the railing or deck in the foreground/midground.
2. GOLDEN-RATIO PROPORTION LOCK:
   - Frame the subject in an environmental Medium-to-Full or Waist-to-Knee shot occupying EXACTLY 38% to 48% of the vertical frame height.
   - The face must be CRISP, SHARP, AND PROMINENT ENOUGH so that all fine facial features, eyes, expressions, and 100% identical face identity from Image 1 are instantly recognizable.
   - The background environment and panoramic venue of Image 2 MUST occupy the remaining 52% to 62% of the frame with full majestic perspective and grand depth.
   - STRICTLY AVOID: DO NOT place the subject as a tiny blurry figure in the far background, and DO NOT zoom into an oversized ID headshot that crops out the scenery.
3. PHYSICAL & OPTICAL INTEGRATION:
   - Ground contact shadows: The subject must stand firmly on the ground surface with natural contact and ambient occlusion shadows (no floating sticker look).
   - Directional lighting harmonization: Match the lighting direction, color temperature, and rim highlights on the subject's face, hair, and body seamlessly with the ambient light source of Image 2.
   - Attire adaptation: Elegantly adapt the subject's clothing to match the travel/sports venue (e.g. athletic sports polo/t-shirt, shorts, sneakers) while keeping 100% original head and face.
   - Realistic texture: Microscopic pores, fine vellus peach fuzz, natural sub-surface scattering (SSS), and organic fine sensor grain on Kodak Portra 400 film aesthetic.${customPromptAddon}${fixAddon} Do not render any visible text, watermark, logos, or letters.
CRITICAL NEGATIVE: (plastic skin, waxy skin, airbrushed, smooth skin, poreless skin:1.4), (matte skin, powdery skin, flawless skin:1.3), ball stuck to racket, ball glued to paddle, frozen ball on strings, ball attached to racket face, fake ball, elongated face, pointy nose, narrowed eyes, distorted facial bone structure, stranger face, different face, morphed face, altered identity, cross-contaminated features, generic young model, wrong face, face drift, tiny distant figure, distant person, blurry face, unrecognizable face, tight close-up, cropped landmark, oversized head, gigantic face filling the entire screen, fake floating cutout, sticker cutout, missing ground shadow, beauty filter, glam, cgi, 3d render, cartoon, painting, illustration, drawing, unreal engine, ring-light flat lighting, front flash, overexposed highlights, dead eyes, bad anatomy, deformed hands, lowres, watermark, halo artifact around head, hard cutout edges, mismatched lighting, unnatural seams, skin tone boundary mismatch, blurry borders, oversmoothed skin, deformed facial features, mutated eyes, plastic face, asymmetrical jaw, identity drift, duplicated face, identical features across multiple people, swapped identities, merged facial attributes, missing people, dropped members.`;
    } else {
      let basePrompt = "";
      if ((rawKey === "custom" || rawKey === "custom_travel" || (customPrompt && customPrompt.trim())) && customPrompt) {
        basePrompt = `creating the custom scene: "${customPrompt.trim()}".
CRITICAL MANDATORY INSTRUCTIONS:
1. 100% UNTOUCHED ORIGINAL REAL FACE IDENTITY (IP-Adapter FaceID Fidelity, id_weight: 0.999): The exact real-life facial features, eyes, double eyelids, nose bridge, mouth, smile, teeth, expressions, jawline, wrinkles, and skin texture with microscopic visible pores, fine vellus peach fuzz, and natural sub-surface scattering (SSS) of EVERY person from Image 1 MUST be preserved 100% authentically with zero hallucination. Under NO circumstances should the face be replaced with a generic model, plastic skin, or morphed face.
2. DYNAMIC ACTION POSE & ATTIRE: Transform ONLY the body pose, action/motion (e.g. playing basketball, shooting a jump shot, active sports dynamics, dancing, or adventure poses), apparel/uniform, and surrounding environment matching "${customPrompt.trim()}" while seamlessly connecting to the real head and face from Image 1.
3. GOLDEN-RATIO TRAVEL PROPORTIONS: Frame the subject in an environmental Medium-Full view (occupying 35%-45% of vertical frame height), allowing the breathtaking background scenery to occupy 55%-65% of the frame with soft directional Rembrandt lighting and deep shadow falloff. DO NOT zoom in to an oversized headshot.
4. MULTI-PERSON REGIONAL SPLIT [SEP]: If multiple individuals (e.g. 2, 4, or a group) are present in Image 1, detect and include ALL of them together [Person 1] [SEP] [Person 2] naturally with balanced group framing.`;
      } else if (MASTER_STYLE_PROMPT_MAP[rawKey]) {
        basePrompt = MASTER_STYLE_PROMPT_MAP[rawKey];
      } else if (prompt || stylePrompt) {
        basePrompt = prompt || stylePrompt;
      } else {
        basePrompt = `standing prominently at ${rawKey.replace(/_/g, " ")}, environmental medium full view occupying 35%-45% of frame height, breathtaking panoramic scenic travel background occupying 55%-65% of frame, professional travel photography`;
      }

      // Studio background color customization (if provided)
      let bgStr = "solid clean pure white (#FFFFFF)";
      if (bgColor === "blue") bgStr = "solid uniform clean light pastel blue (#EBF3FC, smooth sky blue)";
      if (bgColor === "gray") bgStr = "solid clean light neutral studio gray (#F2F4F8)";
      if (bgColor) {
        basePrompt += `. Background: ${bgStr}.`;
      }

      const isIdPhotoStyle = ["id_photo", "passport", "student"].includes(rawKey);
      const fixAddon = effectiveFixPrompt ? ` User refinement request: ${effectiveFixPrompt}.` : "";

      if (isIdPhotoStyle) {
        finalPrompt = `[MANDATORY MULTI-IMAGE COMPOSITING SPECIFICATION FOR OFFICIAL ID & PASSPORT]:
- Image 1: PRIMARY & EXCLUSIVE REAL FACE IDENTITY SOURCE (id_weight: 1.0).
  Extract ONLY the person's authentic face, eyes, nose, mouth, skin tone, and natural hairstyle from Image 1. Reconstruct 100% exact authentic facial structure and natural hair volume. If ears are covered by hair in Image 1, keep the hair naturally draping over the ears with ZERO fake or deformed ears.
- Image 2: 100% VACANT PURE SOLID STUDIO BACKDROP.
  Image 2 provides strictly the pure solid background canvas.
  CRITICAL MANDATORY INSTRUCTION: COMPLETELY PURGE, DISCARD, AND ERASE 100% OF THE ORIGINAL BACKGROUND, ROOM, WALLS, WALLPAPER, FURNITURE, PAINTINGS, SHELVES, AND CLUTTER FROM IMAGE 1. Place the subject from Image 1 seamlessly and cleanly directly in front of Image 2's flat, seamless solid backdrop. There must be ZERO objects, ZERO furniture, ZERO wall decor, and ZERO room shadows behind the person.
- ATTIRE & FRAMING:
  Replace clothing with a clean tailored dark business suit and white shirt. Perfectly centered front-facing bust shot. Headroom 15% to 20% clear solid space above top of hair. Face occupies 48% to 54% of vertical frame height. Visible neck, collarbones, and neat symmetrical shoulders. Flattering symmetrical studio lighting.${fixAddon}
CRITICAL NEGATIVE: (room, interior, wall, wallpaper pattern, furniture, painting on wall, picture frame, shelf, curtain, window, clutter in background:1.8), (deformed ears, mutated ears, unnatural ears, weird ears, fake ears sticking out of hair:1.5), (slicked back hair, unnaturally flattened hair, bald appearance, tight hair bun:1.3), cropped head, cropped hair, cropped ears, cropped chin, head touching top border, tight face crop, oversized giant face, plastic skin, 3d render, cartoon, blurry, lowres.`;
      } else {
        const ratioInstruction = `2. GOLDEN-RATIO TRAVEL COMPOSITION & 100% BACKGROUND REPLACEMENT: Seamlessly replace 100% of the original background environment from Image 1 with the grand new destination scenery. Zero original room, wallpaper, or indoor clutter. Frame the subject in an environmental Knee-Up or Thigh-Up travel shot (occupying 33% to 40% of vertical frame height), ensuring the subject is close enough that all fine facial features, large expressive eyes, double eyelids, and authentic smile from Image 1 are rendered in razor-sharp 1:1 high-resolution detail, while the grand majestic landmark (e.g. fjord cliff, Eiffel Tower) and panoramic background occupy 60% to 67% of the frame with expansive depth of field. Strictly DO NOT place the person too far away as a tiny blurry figure, and do NOT zoom in into an oversized face.
4. STYLISH TRAVEL ATTIRE & NATURAL CANDID POSE: Completely replace casual indoor home clothes with stylish, elegant vacation travel attire suited for the location (e.g. chic mountain jacket/coat, stylish knitwear). Pose the person naturally standing or admiring the scenic landmark, authentic candid vacation photography, NOT a stiff selfie.`;
        finalPrompt = `(masterpiece, best quality:1.2), RAW unretouched photo, 8k uhd, professional photography seamlessly integrating ALL person(s) present in Image 1 into the scene: ${basePrompt}.
CRITICAL MANDATORY INSTRUCTIONS:
1. DETECT & PRESERVE EVERY REAL PERSON (MULTI-PERSON [SEP]): Accurately count and include EVERY SINGLE INDIVIDUAL present in Image 1 without dropping anyone.
${ratioInstruction}
3. 1:1 EXACT REAL FACE RECONSTRUCTION & EYE INTEGRITY (id_weight: 1.0): Transfer and preserve the EXACT real-life facial features of EVERY single person in Image 1 (identical eye shape, authentic eye size, clear distinct double eyelids, authentic nose bridge width and tip, natural lip contours, authentic smile, jawline, wrinkles, age, skin tone, hair style, bangs, and glasses).
   CRITICAL EYE DIRECTIVE: The eyes MUST remain naturally wide open, round, and clearly defined matching Image 1. Strictly DO NOT squint eyes, DO NOT narrow eyes into slits, DO NOT squint against the sun, and DO NOT alter the eye shape. Under NO circumstances should the face be replaced with a generic stranger or generic Asian model.
   If ears are covered by hair in Image 1, keep the hair naturally draping over the ears with zero fake ears. Apply microscopic visible pores, fine vellus peach fuzz, sub-surface scattering, seamless edge blending, directional rim light, and natural contact shadows on Kodak Portra 400 film aesthetic.${fixAddon} Do not render any visible text, watermark, logos, or letters.
CRITICAL NEGATIVE: (narrowed eyes, squinting eyes, slits eyes, small eyes, altered eyes, closed eyes, different eye shape:1.6), (generic Asian model, stranger face, different face, morphed face, altered identity, generic model face:1.6), (distant tiny figure, distant face, blurry face, unrecognizable face, lowres face:1.5), (plastic skin, waxy skin, airbrushed, smooth skin, poreless skin:1.4), (matte skin, powdery skin, flawless skin:1.3), (giant close-up headshot, oversized face filling the screen, selfie pose, stiff passport posture, indoor t-shirt, casual striped shirt, chest-up bust shot blocking the view, camera staring, oversized person filling lower half:1.5), (deformed ears, mutated ears, unnatural ears, weird ears, fake ears sticking out of hair:1.4), tight close-up, cropped landmark, zoomed-in headshot, oversized head, gigantic face filling the entire screen, cut off Eiffel tower, obstructed scenery, beauty filter, glam, cgi, 3d render, cartoon, painting, illustration, drawing, unreal engine, ring-light flat lighting, front flash, overexposed highlights, dead eyes, bad anatomy, deformed hands, lowres, watermark, halo artifact around head, hard cutout edges, mismatched lighting, unnatural seams, skin tone boundary mismatch, blurry borders, oversmoothed skin, cartoonish outline, deformed facial features, mutated eyes, plastic face, asymmetrical jaw, identity drift, face blending, duplicated face, identical features across multiple people, swapped identities, merged facial attributes, missing people, dropped members.`;
      }

      if (rawPrevImageBase64) {
        const { enrichedDirective, soloPrompt } = parseCustomFixPrompt(effectiveFixPrompt);
        if (isIdPhotoStyle) {
          finalPrompt += ` CRITICAL USER REFINEMENT: ${enrichedDirective}. MANDATORY: Retain 100% pure solid studio backdrop and neat formal/student attire with zero room clutter.`;
        } else {
          finalPrompt = `CRITICAL MANDATORY INSTRUCTION FOR IMAGE MODIFICATION & REFINEMENT:
1. DETECT & RENDER ALL PERSONS (EXACT HEADCOUNT): Accurately count and include EVERY SINGLE INDIVIDUAL present in Image 1 (whether 1 person, 2 people, 4 people, or a group). Never drop, crop, or zoom into just one person unless explicitly requested. Maintain the group composition and relative positions naturally with [SEP] token partitioning.
2. STRICT 100% REAL FACE LOCK & EDGE INPAINTING: Preserve 100% exact authentic facial identity, eyes, nose, lips, jawline, facial bone structure, skin tone, and natural smile of EVERY real person from Image 1 with id_weight: 0.999. Apply microscopic visible pores, fine vellus peach fuzz, sub-surface scattering, seamless edge blending, and natural directional Rembrandt lighting.
3. THEME & PROPORTIONS: Harmoniously maintain the original scene theme: "${basePrompt}". Keep realistic environmental proportions (subject occupies 25%-32% of frame height, landmark occupies 68%-75%). DO NOT zoom in to oversized headshot.
4. USER REQUESTED MODIFICATIONS: Apply the user's specific requested changes with high precision: ${enrichedDirective}. ${soloPrompt ? `Ensure: ${soloPrompt}.` : ""}
5. ATTIRE & COMPOSITION: Stylish travel attire. Do not render any visible text, watermark, logos, or letters. CRITICAL NEGATIVE: (plastic skin, waxy skin, airbrushed, smooth skin, poreless skin:1.4), (matte skin, powdery skin, flawless skin:1.3), (giant close-up headshot, oversized face filling the screen, selfie pose, stiff passport posture, indoor t-shirt, casual striped shirt, chest-up bust shot blocking the view, camera staring:1.5), cropped landmark, oversized head, gigantic face filling the entire screen, cut off Eiffel tower, obstructed scenery, beauty filter, glam, cgi, 3d render, cartoon, painting, illustration, drawing, unreal engine, ring-light flat lighting, front flash, overexposed highlights, dead eyes, bad anatomy, deformed hands, lowres, watermark, halo artifact around head, hard cutout edges, mismatched lighting, unnatural seams, skin tone boundary mismatch, blurry borders, oversmoothed skin, deformed facial features, mutated eyes, plastic face, asymmetrical jaw, identity drift, face blending, duplicated face, identical features across multiple people, swapped identities, merged facial attributes, missing people, dropped members.`;
        }
      }
    }

    // Append learned user preferences from memory if available
    if (userPreferences) {
      const personalMemoryPrompt = buildPersonalizedLearningPrompt(userPreferences);
      if (personalMemoryPrompt) {
        finalPrompt += ` ${personalMemoryPrompt}`;
      }
    }

    // 3. Google Gemini 3.1 Flash Lite 100% Primary Vision Engine
    const { GoogleGenAI } = require("@google/genai");
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    const inputs = [{ type: "text", text: finalPrompt }];
    inputs.push({ type: "image", data: rawSelfieBase64, mime_type: selfieMime });
    if (isIdPhotoStyle && rawBgBase64) {
      // For ID/Passport/Student photo, ALWAYS supply the pure solid background canvas as Image 2
      inputs.push({ type: "image", data: rawBgBase64, mime_type: bgMime });
    } else if (rawPrevImageBase64) {
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
