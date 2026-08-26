export type CategoryId = "extreme" | "travel" | "custom_travel" | "business" | "id_photo" | "concept" | "custom" | "fun";
export type Gender = "male" | "female";

export interface StyleCategory {
  id: CategoryId;
  label: string;
  emoji: string;
  description: string;
  group: "travel" | "studio";
}

export interface StyleDef {
  id: string;
  category: CategoryId;
  label: string;
  description: string;
  emoji: string;
  imageUrl?: string;
  thrillMeter?: string;
  dangerBadge?: string;
  /** English edit instruction sent to the image model */
  prompt: string;
  /** Overrides the default identity-preservation suffix (e.g. cartoon styles) */
  identityNote?: string;
  /** Styles that support background color selection (ID photos) */
  supportsBgColor?: boolean;
  /** Styles whose results make sense on a print sheet */
  printable?: boolean;
}


export const TRAVEL_CATEGORIES: StyleCategory[] = [
  {
    id: "extreme",
    label: "익스트림 아찔 명소",
    emoji: "⚡",
    description: "100% 안전한 방구석 0-Risk 스릴 인생샷 (700m 절벽, 화산, 루프탑)",
    group: "travel",
  },
  {
    id: "travel",
    label: "세계 명소 여행",
    emoji: "🌴",
    description: "발리, 보로부두르, 파리 등 안전한 글로벌 인생샷",
    group: "travel",
  },
  {
    id: "custom_travel",
    label: "커스텀 명소",
    emoji: "🎨",
    description: "원하는 여행지나 배경을 글로 자유롭게 입력",
    group: "travel",
  },
];

export const STUDIO_CATEGORIES: StyleCategory[] = [
  {
    id: "business",
    label: "비즈니스",
    emoji: "💼",
    description: "이력서·링크드인·사원증용 프로페셔널 수트 프로필",
    group: "studio",
  },
  {
    id: "id_photo",
    label: "증명·여권",
    emoji: "🪪",
    description: "단정한 규격 배경 및 정장 헤어 화보",
    group: "studio",
  },
  {
    id: "concept",
    label: "컨셉·재미",
    emoji: "🎭",
    description: "우주비행사, 고흐 유화, 셜록 홈즈 감성 등 이색 스튜디오",
    group: "studio",
  },
  {
    id: "custom",
    label: "커스텀",
    emoji: "🎨",
    description: "원하는 여행지나 명소를 직접 한 줄로 적어 완성",
    group: "studio",
  },
];

export const CATEGORIES: StyleCategory[] = [...TRAVEL_CATEGORIES, ...STUDIO_CATEGORIES];

export type BgColor = "white" | "blue" | "gray";

export const STYLE_PREVIEWS: Record<string, string> = {
  // Extreme Destinations (All 100% Unique 4K Landscape Photos with Cache-Busting v=2.0)
  trolltunga: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?v=2.0&auto=format&fit=crop&w=800&q=80",
  devils_pool: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?v=2.0&auto=format&fit=crop&w=800&q=80",
  kjeragbolten: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?v=2.0&auto=format&fit=crop&w=800&q=80",
  huashan_plank: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?v=2.0&auto=format&fit=crop&w=800&q=80",
  pedra_telegrafo: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?v=2.0&auto=format&fit=crop&w=800&q=80",
  death_road: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?v=2.0&auto=format&fit=crop&w=800&q=80",
  yasur_volcano: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?v=3.0&auto=format&fit=crop&w=800&q=80",
  trift_bridge: "https://images.unsplash.com/photo-1533105079780-92b9be482077?v=3.0&auto=format&fit=crop&w=800&q=80",
  rooftopping: "https://images.unsplash.com/photo-1514565131-fce0801e5785?v=3.0&auto=format&fit=crop&w=800&q=80",
  jacobs_well: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?v=3.0&auto=format&fit=crop&w=800&q=80",

  // Indonesia & Bali Hotspots (100% Fast Loading 4K Photos with Cache-Busting v=2.0)
  kelingking: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?v=2.0&auto=format&fit=crop&w=800&q=80",
  devils_tears: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?v=2.0&auto=format&fit=crop&w=800&q=80",
  bromo: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?v=2.0&auto=format&fit=crop&w=800&q=80",
  ijen: "https://images.unsplash.com/photo-1563299796-b729d0af54a5?v=2.0&auto=format&fit=crop&w=800&q=80",
  tumpak_sewu: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?v=2.0&auto=format&fit=crop&w=800&q=80",
  jomblang: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?v=2.0&auto=format&fit=crop&w=800&q=80",
  timang: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?v=2.0&auto=format&fit=crop&w=800&q=80",
  rinjani: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?v=2.0&auto=format&fit=crop&w=800&q=80",
  sipiso_piso: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?v=2.0&auto=format&fit=crop&w=800&q=80",
  wanagiri: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?v=2.0&auto=format&fit=crop&w=800&q=80",
  bali_swing: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?v=2.0&auto=format&fit=crop&w=800&q=80",
  borobudur: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?v=2.0&auto=format&fit=crop&w=800&q=80",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?v=2.0&auto=format&fit=crop&w=800&q=80",
  santorini: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?v=2.0&auto=format&fit=crop&w=800&q=80",

  // Studio & ID Photo Concepts (Dedicated High Quality Studio & ID Photo Assets)
  corporate: "/images/corporate_photo.png",
  business_suit: "/images/employee_id_photo.png",
  business: "/images/corporate_photo.png",
  studio: "/images/studio_headshot.png",
  id_photo: "/images/resume_photo.png",
  passport: "/images/passport_photo.png",
  student: "/images/profile_woman.png",
  astronaut: "/images/astronaut_photo.png",
  van_gogh: "/images/van_gogh_photo.png",
  yearbook: "/images/yearbook_photo.png",
  sherlock: "/images/sherlock_photo.png",
  idol: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  kdrama: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  magazine: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  noir: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  cartoon: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
};

export const BG_COLORS: { id: BgColor; label: string; swatch: string; prompt: string }[] = [
  { id: "white", label: "흰색", swatch: "#ffffff", prompt: "plain pure white background" },
  { id: "blue", label: "연한 파랑", swatch: "#cfe4f7", prompt: "solid soft light blue studio background" },
  { id: "gray", label: "연한 회색", swatch: "#e5e7eb", prompt: "solid light gray studio background" },
];

export const STYLES: StyleDef[] = [
  // ───────── ⚡ 익스트림 아찔 명소 (100% Safe Thrill) ─────────
  // 글로벌 익스트림 명소
  {
    id: "trolltunga",
    category: "extreme",
    label: "노르웨이 트롤퉁가",
    description: "700m 까마득한 절벽 끝에 앉은 아찔한 샷",
    emoji: "🇳🇴",
    imageUrl: STYLE_PREVIEWS.trolltunga,
    thrillMeter: "THRILL 99%",
    dangerBadge: "100% Safe AI",
    prompt:
      "sitting safely on the edge of Trolltunga cliff Norway, 700m abyss below, dramatic fjord view, cinematic rim light, 8k",
  },
  {
    id: "devils_pool",
    category: "extreme",
    label: "잠비아 데빌스 풀",
    description: "빅토리아 폭포 108m 낭떠러지 바로 앞 샷",
    emoji: "🌊",
    imageUrl: STYLE_PREVIEWS.devils_pool,
    thrillMeter: "THRILL 98%",
    dangerBadge: "100% Safe AI",
    prompt:
      "medium shot portrait resting hands naturally on edge of Victoria Falls Devil's Pool Zambia, 108m waterfall cliff plunge, vibrant vivid rainbow mist in background, natural smile, epic travel photography, photorealistic 8k",
  },
  {
    id: "kjeragbolten",
    category: "extreme",
    label: "노르웨이 셰라그볼텐",
    description: "1,000m 공중에 낀 바위 위 아찔한 포즈",
    emoji: "🪨",
    imageUrl: STYLE_PREVIEWS.kjeragbolten,
    thrillMeter: "THRILL 97%",
    dangerBadge: "100% Safe AI",
    prompt:
      "standing on Kjeragbolten wedged rock in Norway, 1000m cliff gap, breathtaking mountain panorama, 8k",
  },
  {
    id: "huashan_plank",
    category: "extreme",
    label: "중국 화산 장한로",
    description: "깎아지른 절벽 좁은 나무 판자 길 건너기",
    emoji: "🧗",
    imageUrl: STYLE_PREVIEWS.huashan_plank,
    thrillMeter: "THRILL 96%",
    dangerBadge: "100% Safe AI",
    prompt:
      "walking on the narrow Huashan plank walk cliff edge in China, steep mountain cliff drop, extreme thrill, 8k",
  },
  {
    id: "pedra_telegrafo",
    category: "extreme",
    label: "브라질 페드라 두 테드가포",
    description: "절벽에 매달려 있는 유명 착시 아찔 샷",
    emoji: "🇧🇷",
    imageUrl: STYLE_PREVIEWS.pedra_telegrafo,
    thrillMeter: "THRILL 95%",
    dangerBadge: "100% Safe AI",
    prompt:
      "hanging from Pedra do Telégrafo rock Brazil with optical illusion cliff effect, ocean background, golden hour, 8k",
  },
  {
    id: "death_road",
    category: "extreme",
    label: "볼리비아 융가스 데스로드",
    description: "낭떠러지 산악자전거 도로 끝자락 포즈",
    emoji: "🚴",
    imageUrl: STYLE_PREVIEWS.death_road,
    thrillMeter: "THRILL 94%",
    dangerBadge: "100% Safe AI",
    prompt:
      "standing with a mountain bike at Yungas Death Road Bolivia edge, misty cliff abyss, dramatic landscape, 8k",
  },
  {
    id: "yasur_volcano",
    category: "extreme",
    label: "바누아투 야수르 활화산",
    description: "붉은 용암과 연기가 분출하는 활화산 입구",
    emoji: "🌋",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?v=3.0&auto=format&fit=crop&w=800&q=80",
    thrillMeter: "THRILL 96%",
    dangerBadge: "100% Safe AI",
    prompt:
      "standing safely near Mt. Yasur erupting volcano in Vanuatu, glowing red lava smoke, epic night atmosphere, 8k",
  },
  {
    id: "trift_bridge",
    category: "extreme",
    label: "스위스 트리프트 현수교",
    description: "알프스 산맥 100m 골짜기 위 아찔 현수교",
    emoji: "🇨🇭",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?v=3.0&auto=format&fit=crop&w=800&q=80",
    thrillMeter: "THRILL 93%",
    dangerBadge: "100% Safe AI",
    prompt:
      "standing on Trift suspension bridge in Swiss Alps, 100m high valley suspension bridge, snowy mountains, 8k",
  },
  {
    id: "rooftopping",
    category: "extreme",
    label: "마천루 루프탑",
    description: "두바이·뉴욕 초고층 빌딩 난간 아찔 야경",
    emoji: "🏙️",
    imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?v=3.0&auto=format&fit=crop&w=800&q=80",
    thrillMeter: "THRILL 95%",
    dangerBadge: "100% Safe AI",
    prompt:
      "sitting on a skyscraper rooftop ledge in Dubai/NYC at night, hyper-realistic urban skyline glow below, 8k",
  },
  {
    id: "jacobs_well",
    category: "extreme",
    label: "미국 자콥스 웰",
    description: "깊은 수중 동굴 수영장 구멍 다이빙 샷",
    emoji: "🤿",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?v=3.0&auto=format&fit=crop&w=800&q=80",
    thrillMeter: "THRILL 92%",
    dangerBadge: "100% Safe AI",
    prompt:
      "diving into Jacob's Well underwater cave pool in Texas, crystal clear deep blue water, underwater rays, 8k",
  },

  // 🇮🇩 인도네시아 10대 아찔 명소
  {
    id: "kelingking",
    category: "extreme",
    label: "누사페니다 클링킹 비치",
    description: "공룡(T-Rex) 모양 200m 벼랑 끝 아찔 샷",
    emoji: "🇮🇩",
    imageUrl: STYLE_PREVIEWS.kelingking,
    thrillMeter: "THRILL 99%",
    dangerBadge: "100% Safe AI",
    prompt:
      "standing prominently in the scenic foreground at the iconic T-Rex shaped cliff edge at Kelingking Beach Nusa Penida, turquoise ocean and white beach below, dramatic high angle, golden hour, 8k resolution",
  },
  {
    id: "devils_tears",
    category: "extreme",
    label: "누사 렘봉안 데빌스 티어스",
    description: "거대 파도가 몰아치는 절벽 낭떠러지 샷",
    emoji: "🌊",
    imageUrl: STYLE_PREVIEWS.devils_tears,
    thrillMeter: "THRILL 98%",
    dangerBadge: "100% Safe AI",
    prompt:
      "standing on the rocky blowhole cliff edge at Devil's Tears Nusa Lembongan, massive ocean wave crashing dramatically into mist in background, sunset spray, cinematic lighting",
  },
  {
    id: "bromo",
    category: "extreme",
    label: "동자바 브로모 화산",
    description: "유황 연기가 분출하는 활화산 능선 샷",
    emoji: "🌋",
    imageUrl: STYLE_PREVIEWS.bromo,
    thrillMeter: "THRILL 97%",
    dangerBadge: "100% Safe AI",
    prompt:
      "standing on the volcanic rim of active Mount Bromo crater in East Java, smoking caldera and vast sea of sand below, mystical sunrise light rays, photorealistic",
  },
  {
    id: "ijen",
    category: "extreme",
    label: "동자바 이젠 화산 블루파이어",
    description: "신비로운 푸른 유황 불꽃과 산성 호수 샷",
    emoji: "💙",
    imageUrl: STYLE_PREVIEWS.ijen,
    thrillMeter: "THRILL 96%",
    dangerBadge: "100% Safe AI",
    prompt:
      "standing near the turquoise acidic crater lake of Kawah Ijen volcano, glowing blue sulfur flames through mystical morning fog, dramatic atmospheric lighting",
  },
  {
    id: "tumpak_sewu",
    category: "extreme",
    label: "동자바 툼팍세우 폭포",
    description: "120m 거대 폭포 병풍 협곡 장관 샷",
    emoji: "💦",
    imageUrl: STYLE_PREVIEWS.tumpak_sewu,
    thrillMeter: "THRILL 95%",
    dangerBadge: "100% Safe AI",
    prompt:
      "standing prominently in the scenic foreground at Tumpak Sewu waterfall canyon in East Java, surrounded by the massive 120m curtain of cascading water, dramatic mist and lush tropical canopy",
  },
  {
    id: "jomblang",
    category: "extreme",
    label: "족자카르타 좀블랑 동굴",
    description: "60m 싱크홀 수직 동굴 천상의 빛 샷",
    emoji: "✨",
    imageUrl: STYLE_PREVIEWS.jomblang,
    thrillMeter: "THRILL 94%",
    dangerBadge: "100% Safe AI",
    prompt:
      "standing inside the dark cavern of Jomblang Cave Yogyakarta, magnificent beam of heavenly sunlight piercing down from the sinkhole roof, ethereal dust particles, magical atmosphere",
  },
  {
    id: "timang",
    category: "extreme",
    label: "족자카르타 티망 비치 곤돌라",
    description: "거센 파도 위 목재 로프 곤돌라 아찔 샷",
    emoji: "🛶",
    imageUrl: STYLE_PREVIEWS.timang,
    thrillMeter: "THRILL 96%",
    dangerBadge: "100% Safe AI",
    prompt:
      "riding a wooden rope gondola over crashing ocean waves at Timang Beach Yogyakarta, jagged rock island background, thrilling action angle",
  },
  {
    id: "rinjani",
    category: "extreme",
    label: "롬복 린자니 화산 능선",
    description: "2,700m 분화구 칼데라 호수 칼날 능선",
    emoji: "⛰️",
    imageUrl: STYLE_PREVIEWS.rinjani,
    thrillMeter: "THRILL 97%",
    dangerBadge: "100% Safe AI",
    prompt:
      "sitting at the high altitude crater rim ridge of Mount Rinjani Lombok, deep blue Segara Anak crater lake and volcano cone below, sea of clouds, epic mountain panorama",
  },
  {
    id: "sipiso_piso",
    category: "extreme",
    label: "북수마트라 시피소피소 폭포",
    description: "토바 호수 근처 120m 수직 절벽 폭포 샷",
    emoji: "🏞️",
    imageUrl: STYLE_PREVIEWS.sipiso_piso,
    thrillMeter: "THRILL 93%",
    dangerBadge: "100% Safe AI",
    prompt:
      "standing on a cliff edge overlooking Sipiso-piso Waterfall in North Sumatra, a 120m vertical plunge waterfall cascading down a lush green gorge, Lake Toba in distance",
  },
  {
    id: "wanagiri",
    category: "extreme",
    label: "발리 와나기리 히든힐스",
    description: "호수 절벽 허공 위의 나무 둥지 포토존",
    emoji: "🪺",
    imageUrl: STYLE_PREVIEWS.wanagiri,
    thrillMeter: "THRILL 92%",
    dangerBadge: "100% Safe AI",
    prompt:
      "sitting on a giant woven bird nest platform protruding over Lake Buyan at Wanagiri Hidden Hills Bali, misty tropical lake panorama, romantic morning atmosphere",
  },

  // ───────── 세계 명소 여행 (TripShot.world) ─────────
  {
    id: "bali_swing",
    category: "travel",
    label: "발리 정글 스윙",
    description: "열대 우림 우부드 정글 스윙 인스타 샷",
    emoji: "🌺",
    imageUrl: STYLE_PREVIEWS.bali_swing,
    prompt:
      "A stunning travel photo sitting on a giant jungle swing in Bali, lush green tropical background, cinematic lighting, 8k",
  },
  {
    id: "borobudur",
    category: "travel",
    label: "보로부두르 사원 일출",
    description: "인도네시아 보로부두르 사원의 신비로운 일출",
    emoji: "🌅",
    imageUrl: STYLE_PREVIEWS.borobudur,
    prompt:
      "A breathtaking travel portrait standing at Borobudur temple in Indonesia during a magical golden sunrise, ancient stupas, misty background, highly detailed",
  },
  {
    id: "paris",
    category: "travel",
    label: "파리 에펠탑 노을",
    description: "로맨틱한 파리 에펠탑 황금빛 노을 배경",
    emoji: "🗼",
    imageUrl: STYLE_PREVIEWS.paris,
    prompt:
      "A romantic travel portrait in front of Eiffel Tower in Paris, golden hour lighting, cinematic style, 8k",
  },
  {
    id: "santorini",
    category: "travel",
    label: "산토리니 블루돔",
    description: "그리스 산토리니의 에지해 석양 오션뷰",
    emoji: "🇬🇷",
    imageUrl: STYLE_PREVIEWS.santorini,
    prompt:
      "A picturesque travel photo standing on white dome balconies in Santorini Greece during sunset, Aegean sea background, 8k",
  },
  // ───────── 💼 비즈니스 (business) ─────────
  {
    id: "corporate",
    category: "business",
    label: "비즈니스 정장",
    description: "고급 헤드샷 전용 네이비 비즈니스 수트 룩",
    emoji: "💼",
    imageUrl: STYLE_PREVIEWS.corporate,
    supportsBgColor: true,
    prompt:
      "A high-end executive portrait of the person, completely replacing original clothes with a luxury fitted navy blue business suit with white dress shirt, elegant studio lighting, professional studio background, id_weight: 0.72",
  },
  {
    id: "studio",
    category: "business",
    label: "스튜디오 헤드샷",
    description: "인물 부각 실내 고급 스튜디오 조명",
    emoji: "📸",
    imageUrl: STYLE_PREVIEWS.studio,
    supportsBgColor: true,
    prompt:
      "Apply soft, flattering studio portrait lighting on the person, completely replacing original clothes with clean executive attire, solid elegant studio backdrop, id_weight: 0.72",
  },

  // ───────── 🪪 증명·여권 (id_photo) ─────────
  {
    id: "id_photo",
    category: "id_photo",
    label: "표준 증명사진 (주민증·면허)",
    description: "대한민국·국제 표준 신분증 규격 (머리 여백 확보 & 단정한 바스트 샷)",
    emoji: "🪪",
    imageUrl: STYLE_PREVIEWS.id_photo,
    supportsBgColor: true,
    printable: true,
    prompt:
      "Official standard ID photo (resident card / driver's license specification). CRITICAL FRAMING & COMPOSITION: Perfectly centered head-and-shoulders bust shot. MANDATORY HEADROOM: Leave 12% to 15% clear background space above the top of the hair (crown of head must NOT touch the top edge). The face occupies 50% to 58% of the vertical frame height, with visible neck, collarbones, and neat symmetrical shoulders occupying the bottom third. Completely replacing clothes with a clean tailored dark business suit and white shirt, straight front-facing posture, natural calm professional expression, sharp focus on eyes, crisp symmetrical studio lighting, strictly DO NOT crop head or hair, id_weight: 0.999",
  },
  {
    id: "passport",
    category: "id_photo",
    label: "여권·비자 규격 사진",
    description: "ICAO 국제 공식 여권 규격 (머리 위 흰 여백 확보 & 어깨선 안정)",
    emoji: "🛂",
    imageUrl: STYLE_PREVIEWS.passport,
    printable: true,
    prompt:
      "Official ICAO compliant international passport photo specification. CRITICAL FRAMING & HEADROOM: Centered front-facing official passport portrait. MANDATORY TOP MARGIN: Leave 10% to 14% of pure solid white background (#FFFFFF) space above the crown of the hair (hair must NOT touch top border, strictly NO cropped hair or head). The face from top of hair to bottom of chin occupies 60% to 68% of the total vertical frame height (balanced official passport proportions). Visible neck, collarbones, and neat symmetrical shoulders visible in lower frame. Both ears and eyebrows completely visible, neutral expression with mouth gently closed, sharp focus on eyes, dark formal attire contrasting against white background, id_weight: 0.999",
  },
  {
    id: "student",
    category: "id_photo",
    label: "학생증·단정 프로필",
    description: "산뜻한 셔츠 차림 스마트 캐주얼 (머리 여백 확보 & 상반신)",
    emoji: "🎓",
    imageUrl: STYLE_PREVIEWS.student,
    supportsBgColor: true,
    printable: true,
    prompt:
      "Clean smart casual student ID and young professional profile portrait. CRITICAL FRAMING & HEADROOM: Leave 12% to 16% headroom above hair. Face occupies 48% to 55% of vertical frame height (neat upper-chest portrait). Dressed in a neat crisp button-down oxford shirt or stylish knit (NOT a heavy dark executive suit), friendly warm confident smile, bright flattering studio lighting, strictly NO cropped hair, id_weight: 0.999",
  },

  // ───────── 🎭 컨셉·재미 (concept) ─────────
  {
    id: "astronaut",
    category: "concept",
    label: "우주비행사 SF 화보",
    description: "우주선 내부 우주비행사 SF 수트",
    emoji: "🧑‍🚀",
    imageUrl: STYLE_PREVIEWS.astronaut,
    prompt:
      "A fun creative concept headshot of the person wearing a sleek futuristic astronaut suit, completely replacing original clothes, cosmic galaxy background, sci-fi lighting, id_weight: 0.72",
  },
  {
    id: "van_gogh",
    category: "concept",
    label: "고흐 명화 유화",
    description: "빈센트 반 고흐 별이 빛나는 밤 스타일 유화",
    emoji: "🎨",
    imageUrl: STYLE_PREVIEWS.van_gogh,
    prompt:
      "A dramatic artistic oil painting portrait of the person in the distinctive style of Vincent van Gogh, thick impasto brushstrokes, Starry Night swirl sky backdrop, id_weight: 0.72",
  },
  {
    id: "yearbook",
    category: "concept",
    label: "90년대 레트로 졸업앨범",
    description: "미국 90s 하이스쿨 레이저 배경 졸업사진",
    emoji: "📒",
    imageUrl: STYLE_PREVIEWS.yearbook,
    prompt:
      "A nostalgic 1990s American high school yearbook portrait of the person with classic blue-gray laser beam studio backdrop, vintage 90s outfit, id_weight: 0.72",
  },
  {
    id: "sherlock",
    category: "concept",
    label: "셜록 홈즈 앤티크 탐정",
    description: "19세기 런던 앤티크 서재 분위기 샷",
    emoji: "🕵️",
    imageUrl: STYLE_PREVIEWS.sherlock,
    prompt:
      "A dramatic antique detective portrait of the person in 19th century London Victorian library, wearing tweed coat, warm fireplace glow, cinematic fog, id_weight: 0.72",
  },
  {
    id: "idol",
    category: "fun",
    label: "아이돌 데뷔 프로필",
    description: "K-pop 데뷔조 비주얼",
    emoji: "🌟",
    imageUrl: STYLE_PREVIEWS.idol,
    prompt:
      "Transform into a K-pop idol debut profile photo: flawless dewy idol-style skin, trendy stylish stage outfit, dreamy pastel studio background with soft glowing lighting, magazine-quality retouching.",
  },
  {
    id: "kdrama",
    category: "fun",
    label: "K-드라마 포스터",
    description: "시네마틱 무드의 주인공",
    emoji: "🎬",
    imageUrl: STYLE_PREVIEWS.kdrama,
    prompt:
      "Transform into a Korean drama official poster portrait: cinematic moody lighting, romantic wistful atmosphere, shallow depth of field, film-like color grading, elegant styling worthy of a lead role.",
  },
  {
    id: "magazine",
    category: "fun",
    label: "패션 매거진 커버",
    description: "하이패션 에디토리얼 화보",
    emoji: "🖤",
    imageUrl: STYLE_PREVIEWS.magazine,
    prompt:
      "Transform into a high-fashion magazine cover portrait: bold editorial studio lighting, designer outfit, confident powerful expression, clean minimal backdrop, Vogue-style composition.",
  },
  {
    id: "noir",
    category: "fun",
    label: "흑백 감성 화보",
    description: "필름 느낌의 모노크롬 아트",
    emoji: "🎞️",
    imageUrl: STYLE_PREVIEWS.noir,
    prompt:
      "Transform into a black-and-white fine-art studio portrait: dramatic Rembrandt lighting, deep rich shadows, timeless monochrome film look, artistic and emotional.",
  },
  {
    id: "cartoon",
    category: "fun",
    label: "3D 애니 캐릭터",
    description: "애니메이션 영화 주인공처럼",
    emoji: "🧸",
    imageUrl: STYLE_PREVIEWS.cartoon,
    identityNote:
      "Keep a strong, instantly recognizable resemblance to the person's face and features.",
    prompt:
      "Transform into a charming 3D animated movie character portrait in the style of a modern animation studio: big expressive eyes, soft global illumination, stylized but adorable look.",
  },
];

export const ULTRA_REALISM_POSITIVE =
  "Shot on Canon EOS R5, 35mm to 50mm environmental prime lens at f/2.8, shallow to medium depth of field, sharp focus on the near eye, realistic catchlights in detailed irises. Extreme microscopic skin texture with non-repeating visible pores and fine vellus peach fuzz, subtle uneven skin tone with natural minor blemishes, organic skin moisture sheen, subtle flyaway hair strands breaking the contour, authentic sub-surface scattering (SSS), soft directional Rembrandt lighting with deep natural shadow falloff, Kodak Portra 400 film aesthetic with organic fine sensor grain, raw unretouched capture, seamless edge blending.";

export const GOLDEN_RATIO_TRAVEL_DIRECTIVE =
  "CRITICAL GOLDEN-RATIO TRAVEL COMPOSITION & HARMONIOUS PROPORTIONS: Environmental cinematic travel masterpiece. The subject(s) MUST be framed in a natural Medium-to-Full or Waist-to-Knee shot occupying approximately 35% to 45% of the vertical frame height in the foreground/midground, gracefully standing or posing. The majestic background landmark and scenic panorama (e.g. the full Eiffel Tower from spire to base, dramatic cliff, or vast horizon) MUST occupy the remaining 55% to 65% of the frame with breathtaking grand perspective depth. DO NOT zoom in to a giant headshot or tight chest-up close-up that blocks the scenery. Reconstruct 100% exact real-life facial structure, eyes, double eyelids, nose bridge, lips, smile curvature, teeth, jawline, wrinkles, and authentic skin texture from Image 1 with id_weight: 0.999.";

export const DEFAULT_IDENTITY_NOTE =
  `CRITICAL 1:1 REAL FACE ID LOCK & ULTRA-REALISTIC TRAVEL OPTICS: (masterpiece, best quality:1.2), RAW unretouched photo, 8k uhd. ${ULTRA_REALISM_POSITIVE} ${GOLDEN_RATIO_TRAVEL_DIRECTIVE} Seamlessly integrated with directional rim light, ground contact shadows, and edge blending into the magnificent background.`;

export const EDGE_INPAINTING_POSITIVE =
  "extreme microscopic skin texture with visible pores and fine vellus peach fuzz, seamless edge blending, harmonized ambient lighting, directional rim light, sharp hair strands integration, matching color grading with background, clean contour, high fidelity sub-surface scattering";

export const MASTER_NEGATIVE_PROMPT =
  "(plastic skin, waxy skin, airbrushed, smooth skin, poreless skin:1.4), (matte skin, powdery skin, flawless skin:1.3), tight close-up, cropped landmark, oversized head, gigantic face filling the entire screen, chest-up bust shot blocking the view, cut off Eiffel tower, obstructed scenery, zoomed-in headshot, beauty filter, glam, cgi, 3d render, cartoon, painting, illustration, drawing, unreal engine, ring-light flat lighting, front flash, overexposed highlights, dead eyes, bad anatomy, deformed hands, lowres, watermark, (worst quality, low quality:1.3), halo artifact around head, hard cutout edges, mismatched lighting, unnatural seams, skin tone boundary mismatch, blurry borders, oversmoothed skin, cartoonish outline, deformed facial features, mutated eyes, asymmetrical jaw, identity drift, face blending, duplicated face, identical features across multiple people, swapped identities, merged facial attributes, missing people, dropped members";

export const NO_TEXT_INSTRUCTION =
  "CRITICAL: Absolutely NO text, NO watermarks, NO fonts, NO writings, NO instagram UI, NO social media overlay, NO username, NO comments, NO logo, NO frame, NO captions, NO buttons. Pure photorealistic photo only.";

export function getStyle(id: string): StyleDef | undefined {
  return STYLES.find((s) => s.id === id);
}

/** Smart neutral travel prompt generator matching traveler(s) automatically */
export function getTravelPrompt(destination: string): string {
  const SMART_GEAR =
    "the traveler(s) from Image 1 looking naturally stunning in stylish travel attire, posed in an environmental Medium-Full view (occupying 35%-45% of the frame) beautifully harmonized with the expansive landmark panorama in background";

  const BASE_PROMPTS = {
    // ⚡ 익스트림 10대 명소 (글로벌)
    trolltunga: `A breathtaking cinematic travel photo of ${SMART_GEAR}, standing safely near the iconic cliff edge of Trolltunga Norway with magnificent fjord abyss and snow peaks in the background, golden hour rim lighting, 8k resolution.`,
    devils_pool: `An epic cinematic travel photo of ${SMART_GEAR}, at Victoria Falls Devil's Pool Zambia, with the majestic 108m waterfall plunge and misty rainbow in background, 8k resolution.`,
    kjeragbolten: `A stunning travel photo of ${SMART_GEAR}, standing naturally on Kjeragbolten rock in Norway with vast mountain panorama and deep fjord in background, 8k resolution.`,
    huashan_plank: `An adventurous travel photo of ${SMART_GEAR}, on the historic Huashan cliff walk in China with steep misty mountain peaks in background, 8k resolution.`,
    pedra_telegrafo: `A picturesque travel photo of ${SMART_GEAR}, at Pedra do Telégrafo rock Brazil with sweeping Rio ocean view and golden sunset glow, 8k.`,
    death_road: `An adventurous travel photo of ${SMART_GEAR}, at Yungas Death Road Bolivia overlooking the lush misty mountain abyss, dramatic scenic lighting, 8k.`,
    yasur_volcano: `An epic night travel photo of ${SMART_GEAR}, safely near Mt. Yasur volcano in Vanuatu with glowing red lava fireworks in background, 8k resolution.`,
    trift_bridge: `A majestic travel photo of ${SMART_GEAR}, on the Trift suspension bridge in Swiss Alps with turquoise glacier lake and snowy peaks in background, 8k.`,
    rooftopping: `A glamorous urban night photo of ${SMART_GEAR}, at an open-air luxury skyscraper rooftop terrace in Dubai with glittering Burj Khalifa and skyline bokeh in background, 8k.`,
    jacobs_well: `A magical travel photo of ${SMART_GEAR}, swimming in Jacob's Well natural cave pool in Texas with crystal clear turquoise water and sunbeams filtering down, 8k.`,

    // 🇮🇩 인도네시아 10대 아찔 명소
    kelingking: `A stunning cinematic travel photo of ${SMART_GEAR}, standing at the scenic viewpoint overlooking the iconic T-Rex cliff and turquoise beach of Kelingking Beach Nusa Penida, warm tropical sunlight, 8k resolution`,
    devils_tears: `A dynamic travel photo of ${SMART_GEAR}, on the coastal cliff of Devil's Tears Nusa Lembongan with massive ocean wave spray crashing in background, sunset spray, cinematic lighting`,
    bromo: `A mystical sunrise travel photo of ${SMART_GEAR}, at Mount Bromo crater rim in East Java with smoking caldera, sea of sand, and golden morning sun rays in background, 8k`,
    ijen: `A mesmerizing travel photo of ${SMART_GEAR}, near the turquoise acidic crater lake of Kawah Ijen volcano with morning mist and glowing blue sulfur smoke in background, 8k`,
    tumpak_sewu: `A magnificent travel photo of ${SMART_GEAR}, at the base canyon of Tumpak Sewu waterfall in East Java with the 120m curtain of cascading water and lush jungle in background, 8k`,
    jomblang: `An ethereal travel photo of ${SMART_GEAR}, inside Jomblang Cave Yogyakarta with a magnificent heavenly beam of light piercing down from the roof in background, 8k`,
    timang: `An exhilarating travel photo of ${SMART_GEAR}, on the wooden cable gondola at Timang Beach Yogyakarta over crashing turquoise ocean waves, 8k`,
    rinjani: `An epic mountain travel photo of ${SMART_GEAR}, at the crater rim of Mount Rinjani Lombok with deep blue Segara Anak lake and volcanic peak in background, sea of clouds, 8k`,
    sipiso_piso: `A picturesque travel photo of ${SMART_GEAR}, overlooking Sipiso-piso Waterfall in North Sumatra with the vertical 120m plunge waterfall and Lake Toba in background, 8k`,
    wanagiri: `A romantic travel photo of ${SMART_GEAR}, on the giant woven bird nest overlook at Wanagiri Hidden Hills Bali with misty Lake Buyan in background, 8k`,

    // 🌴 힐링 / 랜드마크 명소
    bali_swing: `A gorgeous travel photo of ${SMART_GEAR}, soaring gracefully on the giant jungle swing in Bali with lush tropical palm canopy in background, golden hour rim lighting, 8k resolution.`,
    borobudur: `A serene travel photo of ${SMART_GEAR}, at Borobudur temple terrace in Indonesia with ancient stone stupas and mystical sunrise in background, cinematic lighting, highly detailed.`,
    paris: `A romantic cinematic travel photo of ${SMART_GEAR}, standing gracefully on the Trocadéro terrace overlooking the entire majestic Eiffel Tower from base to spire against the golden sunset sky, perfect environmental portrait composition where the Eiffel Tower is fully visible in background, authentic vacation photography, 8k.`,
    santorini: `A picturesque travel photo of ${SMART_GEAR}, on a white terrace in Santorini Greece with blue domes and Aegean sea sunset in background, warm Mediterranean glow, 8k.`,

    // 💼 비즈니스 / 🪪 증명·여권 / 🎭 컨셉·재미
    business: "A sharp professional studio headshot wearing a tailored navy business suit, clean modern office background, soft studio lighting",
    corporate: "A sharp professional studio headshot wearing a tailored navy business suit, clean modern office background, soft studio lighting",
    id_photo: "A clean formal ID passport photo, front-facing neutral expression, wearing formal dark attire against a solid light gray studio background, high clarity",
    passport: "A passport-compliant photo: face directly forward at camera, neutral expression, plain pure white background, head centered, tidy hair",
    concept: "An imaginative creative concept photo wearing an astronaut suit inside a futuristic spaceship with nebula background, cinematic sci-fi lighting",
    astronaut: "An imaginative creative concept photo wearing an astronaut suit inside a futuristic spaceship with nebula background, cinematic sci-fi lighting",
  };

  return BASE_PROMPTS[destination as keyof typeof BASE_PROMPTS] || BASE_PROMPTS.trolltunga;
}

export const DOUBLE_FACE_NEGATIVE =
  "CRITICAL NEGATIVE: different faces, morphed faces, random strangers, swapped people, stock models, floating head, severed head, extra limbs, distorted face";

export const STUDIO_NEGATIVE =
  "CRITICAL NEGATIVE: casual clothes, t-shirt, hoodie, sweater, outdoor background, natural landscape, original clothes, floating head, text, watermark, font, writing, logo, blurry, distorted face, double face";

export function parseCustomFixPrompt(customFixPrompt: string) {
  if (!customFixPrompt || !customFixPrompt.trim()) {
    return {
      soloPrompt: "",
      extraNegative: "",
      idWeight: 0.999,
      userRequestInstruction: "Enhance photorealistic quality and 100% exact resemblance to original selfie.",
      styleModsPrompt: "",
    };
  }

  const rawText = customFixPrompt.trim();
  const lower = rawText.toLowerCase();
  const detectedDirectives: string[] = [];
  let soloPrompt = "";
  let extraNegative = "";
  let idWeight = 0.999;

  // 0. 배경만 변경 & 인물/얼굴 그대로 보존 (최우선 감지)
  if (
    lower.includes("배경만") || lower.includes("배경 변경") || lower.includes("배경 바꿔") || 
    lower.includes("배경 수정") || lower.includes("얼굴은 그대로") || lower.includes("얼굴 그대로") || 
    lower.includes("인물 그대로") || lower.includes("사람 그대로") || lower.includes("only change background") || 
    lower.includes("change background only") || lower.includes("keep face") || lower.includes("keep people") || 
    lower.includes("背景だけ") || lower.includes("只换背景")
  ) {
    idWeight = 0.999;
    detectedDirectives.push(
      "CRITICAL DIRECTIVE - KEEP ALL PERSONS & FACES 100% UNTOUCHED, CHANGE ONLY THE BACKGROUND: Detect and preserve EVERY SINGLE PERSON from Image 1 exactly as they are. DO NOT drop, crop, or zoom in on just one person. Keep all original faces, eyes, noses, mouths, smiles, expressions, hairstyles, poses, and group arrangement 100% authentic from Image 1, and ONLY replace/render the background environment."
    );
    soloPrompt = ""; 
  }
  // 1. 얼굴 정밀 보존 & 닮음
  else if (
    lower.includes("얼굴") || lower.includes("닮") || lower.includes("똑같이") || lower.includes("원본") || 
    lower.includes("face") || lower.includes("resemble") || lower.includes("likeness") || lower.includes("identical") ||
    lower.includes("顔") || lower.includes("似") || lower.includes("脸") || lower.includes("wajah")
  ) {
    idWeight = 0.999;
    detectedDirectives.push("STRICT 1:1 FACE ID LOCK: Exactly preserve the authentic real facial features, eyes, double eyelids, nose, lips, jawline, skin tone, and natural smile of EVERY person from Image 1 with id_weight: 0.999.");
  }

  // 2. 특정 캐릭터 추가
  if (lower.includes("스파이더맨") || lower.includes("spider-man") || lower.includes("spiderman")) {
    detectedDirectives.push("ADD SPIDER-MAN: Add ONLY Spider-Man in his classic superhero suit standing naturally posing next to the main subject. Strictly do NOT add any other extra people, random women, companions, or bystanders.");
    soloPrompt = "strictly only the main subject from Image 1 and Spider-Man, no other companions or background people";
    extraNegative = ", extra people, extra women, random companions, bystanders, pedestrians, tourists, double people";
  } else if (lower.includes("아이언맨") || lower.includes("ironman") || lower.includes("iron man")) {
    detectedDirectives.push("ADD IRON MAN: Add ONLY Iron Man in his metallic armor suit next to the main subject.");
    soloPrompt = "strictly only the main subject from Image 1 and Iron Man, no other companions";
    extraNegative = ", extra people, extra women, random companions, bystanders";
  }

  // 3. 다른 사람 제거 / 배타적 추가
  if (
    !lower.includes("배경만") && !lower.includes("배경 바꿔") && !lower.includes("얼굴은 그대로") && (
      lower.includes("혼자") || lower.includes("1명만") || lower.includes("다른 사람 지워") || 
      lower.includes("solo") || lower.includes("alone") || lower.includes("remove people") || lower.includes("no bystander") ||
      lower.includes("1명만 남겨") || lower.includes("一人だけ") || lower.includes("其他人去掉") || lower.includes("sendiri saja")
    )
  ) {
    soloPrompt = "strictly only the primary foreground subject, completely remove and ignore all other cropped people, bystanders, and strangers";
    extraNegative = ", crowd, extra people, bystanders, pedestrians, tourists, double people, unwanted companions";
    detectedDirectives.push("REMOVE BACKGROUND & CROPPED PEOPLE: Erase all other people or partially cropped figures from Image 1, show only the main subject");
  }

  // 3-B. 불필요한 개체 / 사물 / 장애물 / 잡동사니 삭제 (Clean Background & Object Inpainting)
  if (
    lower.includes("개체 삭제") || lower.includes("개체 지워") || lower.includes("사물 삭제") || lower.includes("사물 지워") ||
    lower.includes("물건 지워") || lower.includes("물건 삭제") || lower.includes("물체 삭제") || lower.includes("물체 지워") ||
    lower.includes("불필요한") || lower.includes("장애물") || lower.includes("지우개") || lower.includes("쓰레기 지워") ||
    lower.includes("remove object") || lower.includes("remove clutter") || lower.includes("erase item") || 
    lower.includes("clean background") || lower.includes("delete obstacle") || lower.includes("オブジェクト削除") || 
    lower.includes("消除物体") || lower.includes("hapus objek")
  ) {
    detectedDirectives.push(
      "OBJECT REMOVAL & CLEAN BACKGROUND INPAINTING: Seamlessly remove, erase, and inpaint over any distracting background objects, unwanted clutter, trash, powerlines, stray items, foreign obstacles, and photobombers. Fill the removed areas with organic, clean, and harmonized background environment matching the surrounding natural scenery and lighting."
    );
    extraNegative += ", unwanted objects, clutter, trash, photobombers, stray items, distracting obstacles, foreign artifacts, floating objects, visual noise, power lines, litter";
  }

  // 4. 소품 / 손 동작
  if (lower.includes("물병") || lower.includes("생수") || lower.includes("물") || lower.includes("bottle") || lower.includes("water bottle")) {
    detectedDirectives.push("PROP IN HAND: Hold a transparent bottled water in hand naturally with realistic fingers and grip");
  } else if (lower.includes("커피") || lower.includes("음료") || lower.includes("잔") || lower.includes("coffee") || lower.includes("drink") || lower.includes("cup") || lower.includes("mug")) {
    detectedDirectives.push("PROP IN HAND: Hold a beverage cup / coffee in hand naturally");
  } else if (lower.includes("카메라") || lower.includes("camera")) {
    detectedDirectives.push("PROP IN HAND: Hold a camera in hands naturally");
  } else if (lower.includes("스마트폰") || lower.includes("핸드폰") || lower.includes("폰") || lower.includes("phone")) {
    detectedDirectives.push("PROP IN HAND: Hold a smartphone in hand naturally");
  } else if (lower.includes("꽃") || lower.includes("flower") || lower.includes("bouquet")) {
    detectedDirectives.push("PROP IN HAND: Hold fresh flowers / bouquet in hand");
  } else if (lower.includes("가방") || lower.includes("배낭") || lower.includes("bag") || lower.includes("backpack")) {
    detectedDirectives.push("ACCESSORY: Wear / carry a stylish travel bag or backpack");
  }

  // 5. 착용 액세서리 / 헤어 / 의상
  if (lower.includes("선글라스") || lower.includes("sunglasses") || lower.includes("안경") || lower.includes("glasses")) {
    detectedDirectives.push("ACCESSORY: Wear stylish sunglasses/glasses naturally on the face");
  }
  if (lower.includes("모자") || lower.includes("hat") || lower.includes("cap") || lower.includes("beanie")) {
    detectedDirectives.push("ACCESSORY: Wear a stylish hat/cap on the head");
  }
  if (lower.includes("정장") || lower.includes("수트") || lower.includes("suit") || lower.includes("blazer")) {
    detectedDirectives.push("ATTIRE: Dressed in an elegant tailored suit");
  } else if (lower.includes("원피스") || lower.includes("드레스") || lower.includes("dress")) {
    detectedDirectives.push("ATTIRE: Dressed in an elegant resort dress");
  } else if (lower.includes("자켓") || lower.includes("코트") || lower.includes("jacket") || lower.includes("coat")) {
    detectedDirectives.push("ATTIRE: Wearing a stylish jacket / coat");
  } else if (lower.includes("반팔") || lower.includes("t-shirt") || lower.includes("shirt") || lower.includes("셔츠")) {
    detectedDirectives.push("ATTIRE: Wearing a clean tailored shirt");
  } else if (lower.includes("수영복") || lower.includes("비키니") || lower.includes("swimwear")) {
    detectedDirectives.push("ATTIRE: Wearing stylish luxury resort swimwear");
  }

  // 6. 표정 & 포즈
  if (lower.includes("웃") || lower.includes("미소") || lower.includes("smile") || lower.includes("happy") || lower.includes("laugh")) {
    detectedDirectives.push("EXPRESSION: Warm, cheerful, natural smile with teeth gently showing");
  } else if (lower.includes("시크") || lower.includes("진지") || lower.includes("serious") || lower.includes("chic") || lower.includes("confident")) {
    detectedDirectives.push("EXPRESSION: Confident and chic calm expression looking at the camera");
  }
  if (lower.includes("전신") || lower.includes("발") || lower.includes("신발") || lower.includes("다리") || lower.includes("full body") || lower.includes("feet") || lower.includes("shoes")) {
    detectedDirectives.push("FRAMING: Full body view showing head to toe with realistic footwear firmly on the ground");
  }

  // 7. 조명 & 분위기 & 날씨
  if (lower.includes("노을") || lower.includes("석양") || lower.includes("황금") || lower.includes("sunset") || lower.includes("golden hour")) {
    detectedDirectives.push("LIGHTING: Warm golden hour sunset illumination with rich glowing amber rays");
  } else if (lower.includes("밝게") || lower.includes("bright") || lower.includes("화사") || lower.includes("sunny")) {
    detectedDirectives.push("LIGHTING: Make overall lighting brighter, cleaner, and more vibrant with soft flattering natural illumination");
  } else if (lower.includes("야경") || lower.includes("밤") || lower.includes("night") || lower.includes("starry")) {
    detectedDirectives.push("LIGHTING: Atmospheric evening night view with ambient lights");
  } else if (lower.includes("눈") || lower.includes("snow") || lower.includes("winter")) {
    detectedDirectives.push("ATMOSPHERE: Beautiful soft falling snow winter atmosphere");
  } else if (lower.includes("비") || lower.includes("rain")) {
    detectedDirectives.push("ATMOSPHERE: Romantic light rain moody atmosphere");
  }

  const fullInstruction = detectedDirectives.length > 0
    ? detectedDirectives.join(". ")
    : `User specific refinement request: "${rawText}". Ensure 100% exact facial preservation of all real people from Image 1.`;

  return {
    soloPrompt,
    extraNegative,
    idWeight,
    userRequestInstruction: fullInstruction,
    styleModsPrompt: detectedDirectives.join(". "),
  };
}

/** Build the final English prompt sent to the model. */
export function buildPrompt(opts: {
  styleId: string;
  bgColor?: BgColor;
  customPrompt?: string;
  customFixPrompt?: string;
}): string {
  const { styleId, bgColor, customPrompt, customFixPrompt } = opts;
  const style = getStyle(styleId);

  const isStudioStyle =
    ["business", "id_photo", "concept"].includes(style?.category ?? "") ||
    ["corporate", "studio", "id_photo", "passport", "student", "astronaut", "van_gogh", "yearbook", "sherlock", "idol", "kdrama"].includes(styleId);

  let base = "";
  if ((styleId === "custom" || styleId === "custom_travel") && customPrompt) {
    base = `(masterpiece, best quality:1.2), RAW unretouched photo, 8k uhd, shot on Canon EOS R5 (85mm f/2.2), creating the custom scene: "${customPrompt.trim()}".
CRITICAL MANDATORY INSTRUCTIONS:
1. 100% UNTOUCHED ORIGINAL REAL FACE IDENTITY (IP-Adapter FaceID Fidelity, id_weight: 0.999): The exact real-life facial features, eyes, double eyelids, nose bridge, mouth, smile, teeth, expressions, jawline, wrinkles, and authentic skin texture with microscopic visible pores, fine vellus peach fuzz, and natural sub-surface scattering (SSS) of EVERY person from Image 1 MUST be preserved 100% authentically with zero hallucination. Under NO circumstances should the face be replaced with a generic model, plastic skin, or morphed face.
2. DYNAMIC ACTION POSE & ATTIRE: Transform ONLY the body pose, action/motion (e.g. playing basketball, shooting a jump shot, active sports dynamics, dancing, or adventure poses), apparel/uniform, and surrounding environment matching "${customPrompt.trim()}" while seamlessly connecting to the real head and face from Image 1.
3. NATURAL PROPORTIONS & SCENIC HARMONY: Strictly DO NOT zoom in to an oversized headshot. Maintain natural anatomical human proportions (head-to-body ratio 1:7 to 1:8, Medium Shot / Waist-Up occupying 45%-60% of frame height) with soft directional Rembrandt lighting and deep shadow falloff.
4. MULTI-PERSON REGIONAL SPLIT [SEP]: If multiple individuals (e.g. 2, 4, or a group) are present in Image 1, detect and include ALL of them together [Person 1] [SEP] [Person 2] naturally with balanced group framing.`;
  } else if (["bali_swing", "borobudur", "paris", "santorini"].includes(styleId)) {
    base = getTravelPrompt(styleId);
  } else {
    base = style
      ? `A photorealistic travel photo naturally integrating ALL person(s) present in Image 1: ${style.prompt}. Detect and include every individual (whether solo or a group of 2~10+ people) with 100% facial preservation (id_weight: 0.999).`
      : `Professional photorealistic photo preserving all subjects from Image 1 with 100% facial fidelity.`;
  }

  // Studio background color mapping
  if (bgColor) {
    let bgPrompt = "clean solid white studio background";
    if (bgColor === "blue") bgPrompt = "clean solid light blue passport ID background";
    if (bgColor === "gray") bgPrompt = "clean solid light gray professional studio background";

    if (style?.supportsBgColor || isStudioStyle) {
      base += ` Background: ${bgPrompt}.`;
    }
  }

  const isPassport = styleId === "passport";
  const isStandardId = styleId === "id_photo";
  const isStudentId = styleId === "student";

  let identityNote = "";
  if (isPassport) {
    identityNote = `STRICT ICAO PASSPORT SPECIFICATION: (masterpiece, best quality:1.2), 8k uhd. Preserve the person's exact 100% facial features, eyes, nose, mouth, and skin tone with id_weight: 0.999. MANDATORY PASSPORT FRAMING & HEADROOM: Leave 10% to 14% pure solid white background (#FFFFFF) space above the crown of hair. Face occupies 60% to 68% of vertical frame height. Visible neck, collarbones, and neat symmetrical shoulders visible in lower frame. Centered front-facing, ears visible, strictly DO NOT crop head or hair. ${EDGE_INPAINTING_POSITIVE}.`;
  } else if (isStandardId) {
    identityNote = `STRICT STANDARD ID SPECIFICATION: (masterpiece, best quality:1.2), 8k uhd. Preserve the person's exact 100% facial features, eyes, nose, mouth, and skin tone with id_weight: 0.999. MANDATORY ID RATIO: Head-and-shoulders bust shot with 12%-15% headroom above hair. Face occupies 50% to 58% of vertical frame height. Clean tailored dark business suit, symmetrical shoulders, strictly DO NOT crop head or hair. ${EDGE_INPAINTING_POSITIVE}.`;
  } else if (isStudentId) {
    identityNote = `STRICT STUDENT ID & PROFILE SPECIFICATION: (masterpiece, best quality:1.2), 8k uhd. Preserve the person's exact 100% facial features, eyes, nose, mouth, and skin tone with id_weight: 0.999. MANDATORY PROFILE RATIO: Upper-chest portrait with 12%-16% headroom above hair. Face occupies 48% to 55% of vertical frame height. Neat button-down collar shirt (no heavy dark suits), warm friendly smile. ${EDGE_INPAINTING_POSITIVE}.`;
  } else if (isStudioStyle) {
    identityNote = `STRICT FACE IDENTITY LOCK & STUDIO INPAINTING: (masterpiece, best quality:1.2), 8k uhd, 85mm lens. Preserve the person's exact 100% facial features, eyes, nose, mouth, jawline, and skin tone with id_weight: 0.999 while completely transforming clothes, outfit, and background into the requested concept. ${EDGE_INPAINTING_POSITIVE}. Professional corporate headshot ratio (face occupies 42%-50% of vertical frame height).`;
  } else {
    identityNote = `${DEFAULT_IDENTITY_NOTE} ${EDGE_INPAINTING_POSITIVE}.`;
  }

  let finalPrompt = `${base} ${identityNote}`;

  if (customFixPrompt && customFixPrompt.trim()) {
    const parsed = parseCustomFixPrompt(customFixPrompt);
    if (parsed.soloPrompt) finalPrompt += ` ${parsed.soloPrompt}.`;
    if (parsed.styleModsPrompt) finalPrompt += ` ${parsed.styleModsPrompt}.`;
    if (parsed.userRequestInstruction) finalPrompt += ` ${parsed.userRequestInstruction}`;
  }

  const idNegative = (isPassport || isStandardId || isStudentId)
    ? "cropped head, cropped hair, cropped ears, cropped chin, head touching top edge, tight face crop, oversized giant face, "
    : "";

  const negativeToUse = isStudioStyle
    ? `${idNegative}${STUDIO_NEGATIVE}, ${MASTER_NEGATIVE_PROMPT}`
    : MASTER_NEGATIVE_PROMPT;

  return `${finalPrompt} ${NO_TEXT_INSTRUCTION} ${negativeToUse}`;
}
