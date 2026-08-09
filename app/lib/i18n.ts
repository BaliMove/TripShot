export type Language = "ko" | "en" | "ja" | "zh" | "id";

export interface Translation {
  title: string;
  navDestinations: string;
  navWhy: string;
  navHowItWorks: string;
  navPricing: string;
  badgeExtreme: string;
  badgeGlobal: string;
  badgeSafe: string;
  heroHeadlineLine1: string;
  heroHeadlineLine2: string;
  heroSub: string;
  ctaMakeMyPhoto: string;
  uploadSectionTitle: string;
  selectTravelCategoryTitle: string;
  selectStudioCategoryTitle: string;
  tabExtreme: string;
  tabTravel: string;
  tabCustomTravel: string;
  tabBusiness: string;
  tabIdPhoto: string;
  tabConcept: string;
  tabCustomStudio: string;
  bgSelectTitle: string;
  bgWhite: string;
  bgBlue: string;
  bgGray: string;
  btnGenerate: string;
  deviceMobile: string;
  deviceDesktop: string;
  detectedLang: string;
  customPromptPlaceholder: string;
  chipSoloText: string;
  chipResemblanceText: string;
  chipSunsetText: string;
}

export const TRANSLATIONS: Record<Language, Translation> = {
  ko: {
    title: "TripShot.world",
    navDestinations: "인기 명소",
    navWhy: "왜 TripShot인가?",
    navHowItWorks: "이용 방법",
    navPricing: "요금제",
    badgeExtreme: "⚡ 100% Zero-Risk Extreme",
    badgeGlobal: "🌐 Global AI Studio",
    badgeSafe: "🛡️ 100% 안전 합성",
    heroHeadlineLine1: "전 세계 아찔한 명소부터 로맨틱 여행지까지,",
    heroHeadlineLine2: "10초 만에 안전한 인생샷",
    heroSub: "위험한 절벽이나 통제 구역에 들어갈 필요 없이, 방구석에서 100% 안전하게 고화질 화보를 완성하세요. ⚡📸",
    ctaMakeMyPhoto: "내 인생샷 만들기 ✨",
    uploadSectionTitle: "1. 사진 업로드 (혼자 / 커플 / 단체 사진 모두 가능 📸)",
    selectTravelCategoryTitle: "2. 명소 배경 선택 (여행 스팟 카테고리)",
    selectStudioCategoryTitle: "3. 스튜디오 & 컨셉 촬영 선택",
    tabExtreme: "익스트림 아찔 명소",
    tabTravel: "세계 명소 여행",
    tabCustomTravel: "커스텀 명소",
    tabBusiness: "비즈니스",
    tabIdPhoto: "증명·여권",
    tabConcept: "컨셉·재미",
    tabCustomStudio: "커스텀",
    bgSelectTitle: "🎨 스튜디오 단색 배경색 선택",
    bgWhite: "흰색",
    bgBlue: "연한 파랑",
    bgGray: "연한 회색",
    btnGenerate: "인생샷 생성하러 가기 ➔",
    deviceMobile: "📱 모바일 접속",
    deviceDesktop: "💻 컴퓨터(데스크톱) 접속",
    detectedLang: "🇰🇷 대한민국 (한국어) 감지됨",
    customPromptPlaceholder: "원하시는 배경이나 분위기를 자유롭게 입력해 주세요 (예: 알프스 산 정상에서 헬기 타고 찍은 사진)",
    chipSoloText: "다른 사람 없이 혼자만 나오게 해줘",
    chipResemblanceText: "내 원본 얼굴과 더 똑같이 해줘",
    chipSunsetText: "배경을 따뜻한 노을빛으로 바꿔줘",
  },
  en: {
    title: "TripShot.world",
    navDestinations: "Destinations",
    navWhy: "Why TripShot?",
    navHowItWorks: "How It Works",
    navPricing: "Pricing",
    badgeExtreme: "⚡ 100% Zero-Risk Extreme",
    badgeGlobal: "🌐 Global AI Studio",
    badgeSafe: "🛡️ 100% Safe Synthetic",
    heroHeadlineLine1: "From thrilling extreme spots to iconic global travel,",
    heroHeadlineLine2: "Stunning AI Photos in 10 Seconds",
    heroSub: "No dangerous cliff posing or restricted zones needed. Create 100% safe, high-quality travel & profile shots from home! ⚡📸",
    ctaMakeMyPhoto: "Create My AI Shot ✨",
    uploadSectionTitle: "1. Upload Photo (Solo, Couple & Group Photos 📸)",
    selectTravelCategoryTitle: "2. Select Travel Destination Spot",
    selectStudioCategoryTitle: "3. Select Studio & Concept Shoot",
    tabExtreme: "Extreme Thrill",
    tabTravel: "Global Travel",
    tabCustomTravel: "Custom Spot",
    tabBusiness: "Business Suit",
    tabIdPhoto: "ID / Passport",
    tabConcept: "Fun Concept",
    tabCustomStudio: "Custom Concept",
    bgSelectTitle: "🎨 Select Studio Backdrop Color",
    bgWhite: "Solid White",
    bgBlue: "Light Blue",
    bgGray: "Light Gray",
    btnGenerate: "Generate AI Shot Now ➔",
    deviceMobile: "📱 Mobile Device",
    deviceDesktop: "💻 Desktop Computer",
    detectedLang: "🇺🇸 English (US) Detected",
    customPromptPlaceholder: "Describe your custom background or style (e.g. Standing on top of Alps mountain with a helicopter)",
    chipSoloText: "Remove other people, show only me solo",
    chipResemblanceText: "Make it resemble my original selfie face more closely",
    chipSunsetText: "Change the background lighting to warm sunset golden hour",
  },
  ja: {
    title: "TripShot.world",
    navDestinations: "人気スポット",
    navWhy: "選ばれる理由",
    navHowItWorks: "ご利用方法",
    navPricing: "料金プラン",
    badgeExtreme: "⚡ 100% Risk-Free エクストリーム",
    badgeGlobal: "🌐 グローバル AI スタジオ",
    badgeSafe: "🛡️ 100% 安全合成",
    heroHeadlineLine1: "世界中のスリリングな絶景からロマンチックな観光地まで、",
    heroHeadlineLine2: "10秒で完成する感動のAIショット",
    heroSub: "危険な崖や立ち入り禁止区域に行く必要はありません。自宅で100% safeに高品質な写真集を完成させましょう！⚡📸",
    ctaMakeMyPhoto: "写真を作成する ✨",
    uploadSectionTitle: "1. 写真をアップロード（1人・カップル・団体対応 📸）",
    selectTravelCategoryTitle: "2. 観光スポット背景を選択",
    selectStudioCategoryTitle: "3. スタジオ＆コンセプト撮影を選択",
    tabExtreme: "エクストリーム絶景",
    tabTravel: "世界の観光地",
    tabCustomTravel: "カスタムスポット",
    tabBusiness: "ビジネススーツ",
    tabIdPhoto: "証明写真・パスポート",
    tabConcept: "コンセプト・Fun",
    tabCustomStudio: "カスタム",
    bgSelectTitle: "🎨 スタジオ単色背景色の選択",
    bgWhite: "ホワイト",
    bgBlue: "ライトブルー",
    bgGray: "ライトグレー",
    btnGenerate: "AI写真を作成する ➔",
    deviceMobile: "📱 スマホ接続",
    deviceDesktop: "💻 PC接続",
    detectedLang: "🇯🇵 日本 (日本語) 検出",
    customPromptPlaceholder: "ご希望の背景や雰囲気を自由に入力してください（例：アルプス山頂でヘリコプターに乗って撮影）",
    chipSoloText: "他の人を消して、一人だけ映るようにして",
    chipResemblanceText: "私の元の顔にもっと似せて修正して",
    chipSunsetText: "背景を温かい夕焼けの光に変更して",
  },
  zh: {
    title: "TripShot.world",
    navDestinations: "热门景点",
    navWhy: "为什么选择TripShot?",
    navHowItWorks: "使用方法",
    navPricing: "价格方案",
    badgeExtreme: "⚡ 100% 零风险极限名胜",
    badgeGlobal: "🌐 全球 AI 工作室",
    badgeSafe: "🛡️ 100% 安全合成",
    heroHeadlineLine1: "从惊险刺激的悬崖绝景到浪漫环球旅拍，",
    heroHeadlineLine2: "10秒生成高品质AI人生大片",
    heroSub: "无需冒着危险前往悬崖或禁区，在室内即可100%安全生成超清环球旅行与商务写真！⚡📸",
    ctaMakeMyPhoto: "立即生成AI大片 ✨",
    uploadSectionTitle: "1. 上传照片 (支持单人 / 情侣 / 合照 📸)",
    selectTravelCategoryTitle: "2. 选择旅行名胜背景",
    selectStudioCategoryTitle: "3. 选择商务与创意写真",
    tabExtreme: "极限惊险",
    tabTravel: "环球旅拍",
    tabCustomTravel: "自定义景点",
    tabBusiness: "商务正装",
    tabIdPhoto: "证件照·护照",
    tabConcept: "创意写真",
    tabCustomStudio: "自定义",
    bgSelectTitle: "🎨 选择影棚纯色背景",
    bgWhite: "纯白",
    bgBlue: "浅蓝",
    bgGray: "浅灰",
    btnGenerate: "生成AI写真 ➔",
    deviceMobile: "📱 移动端连接",
    deviceDesktop: "💻 电脑PC端连接",
    detectedLang: "🇨🇳 中国 (简体中文) 已识别",
    customPromptPlaceholder: "请输入您想要的自定义背景或风格（例如：阿尔卑斯山顶直升机前的合影）",
    chipSoloText: "移除其他人，只保留我单人",
    chipResemblanceText: "修改得更像我原图自拍的面部特征",
    chipSunsetText: "将背景光线调整为温暖的夕阳晚霞",
  },
  id: {
    title: "TripShot.world",
    navDestinations: "Destinasi Populer",
    navWhy: "Mengapa TripShot?",
    navHowItWorks: "Cara Kerja",
    navPricing: "Harga & Paket",
    badgeExtreme: "⚡ 100% Zero-Risk Ekstrem",
    badgeGlobal: "🌐 Studio AI Global",
    badgeSafe: "🛡️ 100% Sintetis Aman",
    heroHeadlineLine1: "Dari spot ekstrem yang memicu adrenalin hingga wisata dunia,",
    heroHeadlineLine2: "Foto AI Spektakuler dalam 10 Detik",
    heroSub: "Tidak perlu mengambil risiko di tebing berbahaya. Buat foto perjalanan & pasfoto profesional 100% aman dari rumah! ⚡📸",
    ctaMakeMyPhoto: "Buat Foto AI ✨",
    uploadSectionTitle: "1. Unggah Foto (Sendiri, Pasangan & Grup 📸)",
    selectTravelCategoryTitle: "2. Pilih Destinasi Wisata",
    selectStudioCategoryTitle: "3. Pilih Studio & Foto Konsep",
    tabExtreme: "Sensasi Ekstrem",
    tabTravel: "Wisata Dunia",
    tabCustomTravel: "Spot Kustom",
    tabBusiness: "Jas Bisnis",
    tabIdPhoto: "Pasfoto / Visa",
    tabConcept: "Konsep Unik",
    tabCustomStudio: "Kustom",
    bgSelectTitle: "🎨 Pilih Warna Latar Studio",
    bgWhite: "Putih Plain",
    bgBlue: "Biru Muda",
    bgGray: "Abu-abu Muda",
    btnGenerate: "Hasilkan Foto AI ➔",
    deviceMobile: "📱 Perangkat Seluler",
    deviceDesktop: "💻 Komputer / Laptop",
    detectedLang: "🇮🇩 Indonesia (Bahasa) Terdeteksi",
    customPromptPlaceholder: "Tuliskan latar belakang kustom Anda (contoh: Di atas helikopter Pegunungan Alpen)",
    chipSoloText: "Hapus orang lain, tampilkan hanya saya sendiri",
    chipResemblanceText: "Buat lebih mirip dengan wajah foto asli saya",
    chipSunsetText: "Ubah latar belakang menjadi nuansa matahari terbenam yang hangat",
  },
};

/** Detect user device and location language automatically */
export function detectUserDeviceAndLang(): { lang: Language; isMobile: boolean } {
  if (typeof window === "undefined") {
    return { lang: "ko", isMobile: false };
  }

  const userAgent = navigator.userAgent || "";
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  const browserLang = (navigator.language || (navigator as any).userLanguage || "").toLowerCase();

  let lang: Language = "ko";
  if (browserLang.startsWith("en")) {
    lang = "en";
  } else if (browserLang.startsWith("ja")) {
    lang = "ja";
  } else if (browserLang.startsWith("zh")) {
    lang = "zh";
  } else if (browserLang.startsWith("id")) {
    lang = "id";
  } else if (browserLang.startsWith("ko")) {
    lang = "ko";
  }

  return { lang, isMobile };
}
