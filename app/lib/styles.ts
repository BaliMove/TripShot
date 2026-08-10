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
  yasur_volcano: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?v=2.0&auto=format&fit=crop&w=800&q=80",
  trift_bridge: "https://images.unsplash.com/photo-1533105079780-92b9be482077?v=2.0&auto=format&fit=crop&w=800&q=80",
  rooftopping: "https://images.unsplash.com/photo-1514565131-fce0801e5785?v=2.0&auto=format&fit=crop&w=800&q=80",
  jacobs_well: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?v=2.0&auto=format&fit=crop&w=800&q=80",

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

  // Studio & ID Photo Concepts
  corporate: "https://images.unsplash.com/photo-1560250097-0b93528c311a?v=2.0&auto=format&fit=crop&w=800&q=80",
  business_suit: "https://images.unsplash.com/photo-1560250097-0b93528c311a?v=2.0&auto=format&fit=crop&w=800&q=80",
  business: "https://images.unsplash.com/photo-1560250097-0b93528c311a?v=2.0&auto=format&fit=crop&w=800&q=80",
  studio: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?v=2.0&auto=format&fit=crop&w=800&q=80",
  id_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?v=2.0&auto=format&fit=crop&w=800&q=80",
  passport: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?v=2.0&auto=format&fit=crop&w=800&q=80",
  student: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?v=2.0&auto=format&fit=crop&w=800&q=80",
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
    imageUrl: STYLE_PREVIEWS.yasur_volcano,
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
    imageUrl: STYLE_PREVIEWS.trift_bridge,
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
    imageUrl: STYLE_PREVIEWS.rooftopping,
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
    imageUrl: STYLE_PREVIEWS.jacobs_well,
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
      "A solo traveler naturally integrated into the scene, sitting on the narrow edge of the iconic T-Rex shaped cliff at Kelingking Beach Nusa Penida, turquoise ocean and white beach far below, dramatic high angle shot, golden hour, 8k resolution",
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
      "A solo traveler naturally integrated into the scene, standing on the rocky blowhole cliff edge at Devil's Tears Nusa Lembongan, massive ocean wave crashing dramatically into mist in background, sunset spray, cinematic lighting",
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
      "A solo traveler naturally integrated into the scene, standing on the narrow volcanic rim of active Mount Bromo crater in East Java, smoking caldera and vast sea of sand below, mystical sunrise light rays, photorealistic",
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
      "A solo traveler naturally integrated into the scene, standing near the turquoise acidic crater lake of Kawah Ijen volcano, glowing blue sulfur flames through mystical morning fog, dramatic atmospheric lighting",
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
      "A solo traveler naturally integrated into the scene, standing at the bottom of Tumpak Sewu waterfall canyon in East Java, surrounded by a massive 120m curtain of cascading water, dramatic mist and lush tropical canopy",
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
      "A solo traveler naturally integrated into the scene, standing inside the dark cavern of Jomblang Cave Yogyakarta, magnificent beam of heavenly sunlight piercing down from the sinkhole roof, ethereal dust particles, magical atmosphere",
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
      "A solo traveler naturally integrated into the scene, riding a primitive wooden cable car over violent crashing ocean waves at Timang Beach Yogyakarta, jagged rock island background, thrilling action angle",
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
      "A solo traveler naturally integrated into the scene, sitting at the high altitude crater rim ridge of Mount Rinjani Lombok, deep blue Segara Anak crater lake and volcano cone below, sea of clouds, epic mountain panorama",
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
      "A solo traveler naturally integrated into the scene, standing on a cliff edge overlooking Sipiso-piso Waterfall in North Sumatra, a 120m vertical plunge waterfall cascading down a lush green gorge, Lake Toba in distance",
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
      "A solo traveler naturally integrated into the scene, sitting on a giant woven bird nest platform protruding over Lake Buyan at Wanagiri Hidden Hills Bali, misty tropical lake panorama, romantic morning atmosphere",
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
    description: "고급 해드샷 전용 네이비 비즈니스 수트 수트 룩",
    emoji: "💼",
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
    supportsBgColor: true,
    prompt:
      "Apply soft, flattering studio portrait lighting on the person, completely replacing original clothes with clean executive attire, solid elegant studio backdrop, id_weight: 0.72",
  },

  // ───────── 🪪 증명·여권 (id_photo) ─────────
  {
    id: "id_photo",
    category: "id_photo",
    label: "취업용 증명사진",
    description: "단정한 정장 수트 착용, 규격 전면 증명사진",
    emoji: "🪪",
    supportsBgColor: true,
    printable: true,
    prompt:
      "A professional studio front-facing ID passport photo of the person, completely replacing original clothes with a modern tailored dark business suit, neat haircut, facing directly at camera, neutral expression, sharp focus, professional passport photo lighting, id_weight: 0.72",
  },
  {
    id: "passport",
    category: "id_photo",
    label: "여권·비자 사진",
    description: "국제 규정 준수 화이트 배경 규격 사진",
    emoji: "🛂",
    printable: true,
    prompt:
      "An official compliant passport headshot photo of the person, centered front facing, completely replacing original clothes with dark formal attire, ears visible, neutral facial expression, strict solid white background, id_weight: 0.72",
  },
  {
    id: "student",
    category: "id_photo",
    label: "학생증·사원증",
    description: "밝고 단정한 스마트 캐주얼 증명사진",
    emoji: "🎓",
    supportsBgColor: true,
    printable: true,
    prompt:
      "A clean smart casual studio portrait headshot, completely replacing original clothes with a neat button-down shirt, friendly confident smile, soft even studio lighting, id_weight: 0.72",
  },

  // ───────── 🎭 컨셉·재미 (concept) ─────────
  {
    id: "astronaut",
    category: "concept",
    label: "우주비행사 SF 화보",
    description: "우주선 내부 우주비행사 SF 수트",
    emoji: "🧑‍🚀",
    prompt:
      "A fun creative concept headshot of the person wearing a sleek futuristic astronaut suit, completely replacing original clothes, cosmic galaxy background, sci-fi lighting, id_weight: 0.72",
  },
  {
    id: "van_gogh",
    category: "concept",
    label: "고흐 명화 유화",
    description: "빈센트 반 고흐 별이 빛나는 밤 스타일 유화",
    emoji: "🎨",
    prompt:
      "A dramatic artistic oil painting portrait of the person in the distinctive style of Vincent van Gogh, thick impasto brushstrokes, Starry Night swirl sky backdrop, id_weight: 0.72",
  },
  {
    id: "yearbook",
    category: "concept",
    label: "90년대 레트로 졸업앨범",
    description: "미국 90s 하이스쿨 레이저 배경 졸업사진",
    emoji: "📒",
    prompt:
      "A nostalgic 1990s American high school yearbook portrait of the person with classic blue-gray laser beam studio backdrop, vintage 90s outfit, id_weight: 0.72",
  },
  {
    id: "sherlock",
    category: "concept",
    label: "셜록 홈즈 앤티크 탐정",
    description: "19세기 런던 앤티크 서재 분위기 샷",
    emoji: "🕵️",
    prompt:
      "A dramatic antique detective portrait of the person in 19th century London Victorian library, wearing tweed coat, warm fireplace glow, cinematic fog, id_weight: 0.72",
  },
  {
    id: "idol",
    category: "fun",
    label: "아이돌 데뷔 프로필",
    description: "K-pop 데뷔조 비주얼",
    emoji: "🌟",
    prompt:
      "Transform into a K-pop idol debut profile photo: flawless dewy idol-style skin, trendy stylish stage outfit, dreamy pastel studio background with soft glowing lighting, magazine-quality retouching.",
  },
  {
    id: "kdrama",
    category: "fun",
    label: "K-드라마 포스터",
    description: "시네마틱 무드의 주인공",
    emoji: "🎬",
    prompt:
      "Transform into a Korean drama official poster portrait: cinematic moody lighting, romantic wistful atmosphere, shallow depth of field, film-like color grading, elegant styling worthy of a lead role.",
  },
  {
    id: "magazine",
    category: "fun",
    label: "패션 매거진 커버",
    description: "하이패션 에디토리얼 화보",
    emoji: "🖤",
    prompt:
      "Transform into a high-fashion magazine cover portrait: bold editorial studio lighting, designer outfit, confident powerful expression, clean minimal backdrop, Vogue-style composition.",
  },
  {
    id: "noir",
    category: "fun",
    label: "흑백 감성 화보",
    description: "필름 느낌의 모노크롬 아트",
    emoji: "🎞️",
    prompt:
      "Transform into a black-and-white fine-art studio portrait: dramatic Rembrandt lighting, deep rich shadows, timeless monochrome film look, artistic and emotional.",
  },
  {
    id: "cartoon",
    category: "fun",
    label: "3D 애니 캐릭터",
    description: "애니메이션 영화 주인공처럼",
    emoji: "🧸",
    identityNote:
      "Keep a strong, instantly recognizable resemblance to the person's face and features.",
    prompt:
      "Transform into a charming 3D animated movie character portrait in the style of a modern animation studio: big expressive eyes, soft global illumination, stylized but adorable look.",
  },
];

export const DEFAULT_IDENTITY_NOTE =
  "Preserve the traveler(s) exact facial features and identity naturally with id_weight: 0.80. Photorealistic professional quality.";

export const NO_TEXT_INSTRUCTION =
  "CRITICAL: Absolutely NO text, NO watermarks, NO fonts, NO writings, NO instagram UI, NO social media overlay, NO username, NO comments, NO logo, NO frame, NO captions, NO buttons. Pure photorealistic photo only.";

export function getStyle(id: string): StyleDef | undefined {
  return STYLES.find((s) => s.id === id);
}

/** Smart neutral travel prompt generator matching traveler(s) automatically */
export function getTravelPrompt(destination: string): string {
  const SMART_GEAR =
    "a traveler naturally integrated into the scene, wearing sophisticated climate-appropriate resort/adventure travel gear matching their style";

  const BASE_PROMPTS = {
    // ⚡ 익스트림 10대 명소 (글로벌)
    trolltunga: `A photorealistic extreme travel photo of ${SMART_GEAR}, sitting safely on the cliff edge of Trolltunga Norway, 700m abyss below, dramatic fjord view, cinematic rim light, 8k resolution.`,
    devils_pool: `An epic travel photo of ${SMART_GEAR}, at Victoria Falls Devil's Pool Zambia, 108m waterfall cliff edge, mist and rainbow in background, 8k resolution.`,
    kjeragbolten: `A breathtaking travel photo of ${SMART_GEAR}, standing on Kjeragbolten wedged rock in Norway, 1000m cliff gap, mountain panorama, 8k resolution.`,
    huashan_plank: `An extreme thrill photo of ${SMART_GEAR}, walking on the narrow Huashan plank walk cliff edge in China, steep mountain cliff drop, 8k resolution.`,
    pedra_telegrafo: `A picturesque photo of ${SMART_GEAR}, hanging from Pedra do Telégrafo rock Brazil with optical illusion cliff effect, ocean background, golden hour, 8k.`,
    death_road: `An adventurous photo of ${SMART_GEAR}, standing with a mountain bike at Yungas Death Road Bolivia edge, misty cliff abyss, dramatic landscape, 8k.`,
    yasur_volcano: `An epic night photo of ${SMART_GEAR}, standing safely near Mt. Yasur erupting volcano in Vanuatu, glowing red lava smoke, 8k resolution.`,
    trift_bridge: `A majestic photo of ${SMART_GEAR}, standing on Trift suspension bridge in Swiss Alps, 100m high valley suspension bridge, snowy mountains, 8k.`,
    rooftopping: `A thrilling urban photo of ${SMART_GEAR}, sitting on a skyscraper rooftop ledge in Dubai/NYC at night, hyper-realistic urban skyline glow below, 8k.`,
    jacobs_well: `A surreal diving photo of ${SMART_GEAR}, diving into Jacob's Well underwater cave pool in Texas, crystal clear deep blue water, underwater rays, 8k.`,

    // 🇮🇩 인도네시아 10대 아찔 명소
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

    // 🌴 힐링 / 랜드마크 명소
    bali_swing: `A photorealistic travel shot of ${SMART_GEAR}, sitting on a giant jungle swing in Bali, lush green tropical canopy background, golden hour rim lighting, 8k resolution.`,
    borobudur: `A photorealistic travel photo of ${SMART_GEAR}, standing peacefully at Borobudur temple in Indonesia during a mystical misty sunrise, cinematic lighting, highly detailed.`,
    paris: `A stylish travel photo of ${SMART_GEAR}, standing in front of the Eiffel Tower in Paris, soft daylight, spring cherry blossoms, 50mm lens depth of field.`,
    santorini: `A picturesque travel photo of ${SMART_GEAR}, relaxing on a white terrace in Santorini Greece, Aegean sea background, warm Mediterranean sunset.`,

    // 💼 비즈니스 / 🪪 증명·여권 / 🎭 컨셉·재미
    business: "A sharp professional studio headshot of a traveler wearing a tailored navy business suit, clean modern office background, soft studio lighting",
    corporate: "A sharp professional studio headshot of a traveler wearing a tailored navy business suit, clean modern office background, soft studio lighting",
    id_photo: "A clean formal ID passport photo of a traveler, front-facing neutral expression, wearing formal dark attire against a solid light gray studio background, high clarity",
    passport: "A passport-compliant photo: face directly forward at camera, neutral expression, plain pure white background, head centered, tidy hair",
    concept: "An imaginative creative concept photo of a traveler wearing an astronaut suit inside a futuristic spaceship with nebula background, cinematic sci-fi lighting",
    astronaut: "An imaginative creative concept photo of a traveler wearing an astronaut suit inside a futuristic spaceship with nebula background, cinematic sci-fi lighting",
  };

  return BASE_PROMPTS[destination as keyof typeof BASE_PROMPTS] || BASE_PROMPTS.trolltunga;
}

export const DOUBLE_FACE_NEGATIVE =
  "CRITICAL NEGATIVE: floating head, severed head, extra face, double face, two heads, cloned face, floating body parts, multiple people, extra limbs, distorted face";

export const STUDIO_NEGATIVE =
  "CRITICAL NEGATIVE: casual clothes, t-shirt, hoodie, sweater, outdoor background, natural landscape, original clothes, floating head, text, watermark, font, writing, logo, blurry, distorted face, double face";

export function parseCustomFixPrompt(customFixPrompt: string) {
  const text = customFixPrompt.toLowerCase();

  let soloPrompt = "";
  let extraNegative = "";
  let idWeight = 0.85;
  const styleMods: string[] = [];

  // 1. 선글라스 감지
  if (text.includes("선글라스") || text.includes("sunglasses")) {
    styleMods.push("wearing stylish dark sunglasses on face");
  }

  // 2. 혼자만 나오게 감지
  if (text.includes("혼자") || text.includes("1명") || text.includes("사람") || text.includes("지워")) {
    soloPrompt = "strictly a single solo person, no extra people, no bystanders";
    extraNegative = ", couple, 2people, extra person, partner, crowd, bystanders";
  }

  // 3. 얼굴 더 닮게 감지
  if (text.includes("얼굴") || text.includes("닮") || text.includes("똑같이")) {
    idWeight = 0.98;
    styleMods.push("preserve exact original facial identity with high precision id_weight: 0.98");
  }

  // 4. 분위기 / 조명 감지
  if (text.includes("노을") || text.includes("석양") || text.includes("황금")) {
    styleMods.push("warm golden hour sunset lighting with dramatic sunset colors");
  } else if (text.includes("밝게") || text.includes("화사")) {
    styleMods.push("bright vivid daylight lighting");
  } else if (text.includes("야경") || text.includes("밤")) {
    styleMods.push("atmospheric night view with soft warm lighting");
  }

  return {
    soloPrompt,
    extraNegative,
    idWeight,
    userRequestInstruction: customFixPrompt ? `User refinement request: ${customFixPrompt.trim()}.` : "",
    styleModsPrompt: styleMods.join(". "),
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
    base = `A photorealistic travel photo naturally integrating ALL person(s) / people from Image 1 (preserve exact group size and facial identities of all people in Image 1) into the scene: ${customPrompt.trim()}, cinematic lighting, 8k resolution, highly detailed.`;
  } else if (["bali_swing", "borobudur", "paris", "santorini"].includes(styleId)) {
    base = getTravelPrompt(styleId);
  } else {
    base = style ? `A photorealistic travel photo of person(s) from Image 1 (preserving all individuals and exact number of people): ${style.prompt}` : `Professional photorealistic travel photo preserving all individuals from Image 1.`;
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

  const identityNote = isStudioStyle
    ? "Preserve the person's exact facial features with id_weight: 0.72 while completely replacing original casual clothes and background."
    : DEFAULT_IDENTITY_NOTE;

  let finalPrompt = `${base} ${identityNote}`;

  if (customFixPrompt && customFixPrompt.trim()) {
    const parsed = parseCustomFixPrompt(customFixPrompt);
    if (parsed.soloPrompt) finalPrompt += ` ${parsed.soloPrompt}.`;
    if (parsed.styleModsPrompt) finalPrompt += ` ${parsed.styleModsPrompt}.`;
    if (parsed.userRequestInstruction) finalPrompt += ` ${parsed.userRequestInstruction}`;
  }

  const negativeToUse = isStudioStyle ? STUDIO_NEGATIVE : DOUBLE_FACE_NEGATIVE;

  return `${finalPrompt} ${NO_TEXT_INSTRUCTION} ${negativeToUse}`;
}
