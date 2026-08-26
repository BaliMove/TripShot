export type Language = "ko" | "en" | "ja" | "zh" | "id";

export interface Translation {
  // Navigation & Header
  title: string;
  navDestinations: string;
  navWhy: string;
  navHowItWorks: string;
  navPricing: string;
  navCoupon: string;
  navLogin: string;
  navLogout: string;
  ctaMakeMyPhoto: string;
  ctaMakeMyPhotoFree: string;

  // Hero Section
  badgeExtreme: string;
  badgeGlobal: string;
  badgeSafe: string;
  heroHeadlineLine1: string;
  heroHeadlineLine2: string;
  heroSub: string;

  // Categories & Tabs
  uploadSectionTitle: string;
  facePreserveBadge: string;
  facePreserveDesc: string;
  selectTravelCategoryTitle: string;
  selectStudioCategoryTitle: string;
  tabExtreme: string;
  tabTravel: string;
  tabCustomTravel: string;
  tabBusiness: string;
  tabIdPhoto: string;
  tabConcept: string;
  tabCustomStudio: string;

  // Destination Grid Section
  destSectionTitle: string;
  destSectionSub: string;
  btnSelectThisBg: string;

  // Value Proposition (Why Section)
  valueBadge: string;
  valueTitleLine1: string;
  valueTitleLine2: string;
  valueSub: string;
  valSafeTitle: string;
  valSafeDesc: string;
  valFreeTitle: string;
  valFreeDesc: string;
  valFaceTitle: string;
  valFaceDesc: string;

  // How It Works (3 Steps)
  howBadge: string;
  howTitle: string;
  howSub: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // Pricing Section
  pricingBadge: string;
  pricingTitle: string;
  pricingSub: string;
  planStarterTitle: string;
  planStarterBadge: string;
  planStarterDesc: string;
  planStarterF1: string;
  planStarterF2: string;
  planStarterF3: string;
  planProTitle: string;
  planProBadge: string;
  planProDesc: string;
  planProF1: string;
  planProF2: string;
  planProF3: string;
  planUltimateTitle: string;
  planUltimateBadge: string;
  planUltimateDesc: string;
  planUltimateF1: string;
  planUltimateF2: string;
  planUltimateF3: string;
  btnSelectPlan: string;

  // Upload & Studio Controls
  dropzoneTitle: string;
  dropzoneSub: string;
  dropzoneChange: string;
  dropzoneRemove: string;
  bgSelectTitle: string;
  bgWhite: string;
  bgBlue: string;
  bgGray: string;
  customPromptPlaceholder: string;
  customBgUploadLabel: string;
  tabDualUpload: string;
  tabPresetLandmark: string;
  dualUploadTitle: string;
  dualPersonPhotoLabel: string;
  dualPersonPhotoSub: string;
  dualBgPhotoLabel: string;
  dualBgPhotoSub: string;
  dualBlendBadge: string;
  dualBlendDesc: string;
  quickKeywordsTitle: string;
  chipSoloText: string;
  chipResemblanceText: string;
  chipSunsetText: string;
  btnGenerate: string;
  btnGenerating: string;
  deviceMobile: string;
  deviceDesktop: string;
  detectedLang: string;
  remainingCredits: string;
  freeTrialBadge: string;

  // Modals - Auth
  authTitleLogin: string;
  authTitleSignUp: string;
  authSyncNotice: string;
  authGoogleBtn: string;
  authOrEmail: string;
  authNameLabel: string;
  authNamePlaceholder: string;
  authEmailLabel: string;
  authEmailPlaceholder: string;
  authPassLabel: string;
  authPassPlaceholder: string;
  authMarketingConsent: string;
  authBtnLogin: string;
  authBtnSignUp: string;
  authSwitchToSignUp: string;
  authSwitchToLogin: string;

  // Modals - Coupon
  couponBadge: string;
  couponTitle: string;
  couponSub: string;
  couponCodeLabel: string;
  couponPlaceholder: string;
  couponBtnApply: string;
  couponSuccess: string;
  couponErrorEmpty: string;
  couponErrorInvalid: string;

  // Modals - PayPal / Payment
  payTitle: string;
  paySub: string;
  paySecureNotice: string;
  payCreditsNotice: string;

  // Loading Messages
  loadingTravel1: string;
  loadingTravel2: string;
  loadingTravel3: string;
  loadingTravel4: string;
  loadingTravel5: string;
  loadingStudio1: string;
  loadingStudio2: string;
  loadingStudio3: string;
  loadingStudio4: string;
  loadingStudio5: string;
}

export const TRANSLATIONS: Record<Language, Translation> = {
  ko: {
    title: "TripShot.world",
    navDestinations: "인기 명소",
    navWhy: "왜 TripShot인가?",
    navHowItWorks: "이용 방법",
    navPricing: "요금제",
    navCoupon: "쿠폰",
    navLogin: "로그인",
    navLogout: "로그아웃",
    ctaMakeMyPhoto: "내 인생샷 만들기 ✨",
    ctaMakeMyPhotoFree: "✈️ 내 인생샷 생성하기 (무료 2회)",

    badgeExtreme: "⚡ 100% Zero-Risk Extreme",
    badgeGlobal: "🌐 Global AI Studio",
    badgeSafe: "🛡️ 100% 안전 합성",
    heroHeadlineLine1: "전 세계 아찔한 명소부터 로맨틱 여행지까지,",
    heroHeadlineLine2: "10초 만에 안전한 인생샷",
    heroSub: "위험한 절벽이나 통제 구역에 들어갈 필요 없이, 방구석에서 100% 안전하게 고화질 화보를 완성하세요. ⚡📸",

    uploadSectionTitle: "1. 인물 사진 업로드 📸",
    facePreserveBadge: "🛡️ 100% 실물 얼굴 고정 모드 (1:1 원본 완벽 보존)",
    facePreserveDesc: "AI 변형 없이 모든 인물의 실제 눈, 코, 미소, 안경, 고유 특징을 100% 온전히 유지합니다.",
    selectTravelCategoryTitle: "2. 명소 배경 선택 (여행 스팟 카테고리)",
    selectStudioCategoryTitle: "3. 스튜디오 & 컨셉 촬영 선택",
    tabExtreme: "익스트림 아찔 명소",
    tabTravel: "세계 명소 여행",
    tabCustomTravel: "커스텀 명소",
    tabBusiness: "비즈니스",
    tabIdPhoto: "증명·여권",
    tabConcept: "컨셉·재미",
    tabCustomStudio: "커스텀",

    destSectionTitle: "⚡ 100% 안전한 익스트림 & 대표 명소",
    destSectionSub: "노르웨이 트롤퉁가, 셰라그볼텐부터 발리, 파리까지 방구석에서 10초 만에 완성하세요.",
    btnSelectThisBg: "이 배경 선택하기",

    valueBadge: "SAFE & STUNNING",
    valueTitleLine1: "위험한 촬영은 그만!",
    valueTitleLine2: "100% 안전하게 만드는 나만의 명소 화보",
    valueSub: "위험천만한 절벽 스윙이나 통제 구역에 들어가는 리스크 없이, AI 기술로 내 인물 특징은 그대로 보존하면서 가장 아름다운 명소의 햇살과 배경을 완벽하게 드레스업해드립니다.",
    valSafeTitle: "100% 안전함",
    valSafeDesc: "위험 지대 방문 필요 없이 안심 제작",
    valFreeTitle: "여행 경비 0원",
    valFreeDesc: "비행기 표 값 없이 방구석 10초 완성",
    valFaceTitle: "얼굴 ID 유지",
    valFaceDesc: "나의 실제 얼굴 특징을 완벽히 유지",

    howBadge: "HOW IT WORKS",
    howTitle: "10초 완성 이용 방법 3단계",
    howSub: "셀카 한 장 업로드부터 맞춤 화보 완성까지 세 단계만 거치세요.",
    step1Title: "사진 업로드",
    step1Desc: "얼굴이 또렷하게 나온 셀카나 전신 사진 1장을 업로드합니다.",
    step2Title: "명소 & 컨셉 선택",
    step2Desc: "세계 명소, 익스트림 스윙, 비즈니스 정장 중 원하는 템플릿을 클릭합니다.",
    step3Title: "10초 완성 & 소장",
    step3Desc: "AI가 이목구비 핏을 100% 보존한 고화질 화보를 즉시 완성합니다.",

    pricingBadge: "PRICING PLANS",
    pricingTitle: "합리적인 1회 충전 요금제",
    pricingSub: "매달 나가는 구독료 없이, 필요한 만큼 충전하고 평생 소장하세요 (유효기간 없음).",
    planStarterTitle: "Starter 패스 (20장)",
    planStarterBadge: "⚡ 20장 충전",
    planStarterDesc: "가볍게 2~3개 명소 화보를 완성하는 실속형 체험 패스 (유효기간 없음)",
    planStarterF1: "고화질 AI 화보 20장 생성",
    planStarterF2: "30+ 글로벌 명소 & 듀얼 합성 지원",
    planStarterF3: "크레딧 유효기간 없음 (평생 소장)",
    planProTitle: "Pro 프로 패스 (60장)",
    planProBadge: "🔥 MOST POPULAR (60장)",
    planProDesc: "가격은 2배, 매수는 3배! 친구·연인과 다양한 명소 화보 완성 (30% 할인)",
    planProF1: "2K 초고화질 AI 화보 60장 생성",
    planProF2: "1회 무료 A/S 마법 수정 포함 (0원)",
    planProF3: "여권·증명사진 8분할 인쇄 시트 제공",
    planUltimateTitle: "Ultimate VIP 패스 (150장)",
    planUltimateBadge: "👑 VIP (150장)",
    planUltimateDesc: "장당 최저 단가! 크리에이터, 단체 모임, 30개 명소 전체 완성 패키지 (42% 할인)",
    planUltimateF1: "2K 초고화질 AI 화보 150장 생성",
    planUltimateF2: "최우선 고속 생성 + 워터마크 영구 제거",
    planUltimateF3: "상업적 이용 및 원본 무제한 소장",
    btnSelectPlan: "이 플랜 시작하기",

    dropzoneTitle: "클릭하여 사진 업로드 또는 파일 드래그",
    dropzoneSub: "얼굴이 선명한 정면 인물 사진일수록 최상의 화보가 완성됩니다 (최대 10MB)",
    dropzoneChange: "사진 변경하기",
    dropzoneRemove: "삭제",
    bgSelectTitle: "🎨 스튜디오 단색 배경색 선택",
    bgWhite: "흰색",
    bgBlue: "연한 파랑",
    bgGray: "연한 회색",
    customPromptPlaceholder: "원하시는 배경이나 분위기를 자유롭게 입력해 주세요 (예: 알프스 산 정상에서 헬기 타고 찍은 사진)",
    customBgUploadLabel: "내가 가진 배경 이미지 직접 업로드",
    tabDualUpload: "⛰️ 위험 명소/현장 사진 합성 (사진 2장)",
    tabPresetLandmark: "🌴 추천 명소 템플릿 (사진 1장)",
    dualUploadTitle: "100% 안전 AI 합성: 방구석 인물 + 위험 현장 배경",
    dualPersonPhotoLabel: "1. 내 인물/셀카 사진 (방구석에서 편안하게)",
    dualPersonPhotoSub: "내 얼굴 이목구비와 표정을 100% 유지합니다.",
    dualBgPhotoLabel: "2. 위험한 명소 / 현장 배경 사진 (절벽, 통제구역 등)",
    dualBgPhotoSub: "직접 들어가기 위험한 절벽이나 멋진 풍경 사진을 넣어주세요.",
    dualBlendBadge: "🛡️ 100% 안전 AI 현장 합성 엔진 가동",
    dualBlendDesc: "위험한 절벽 끝에 서지 않아도, AI가 완벽한 햇살과 그림자로 현장에 서 있는 것처럼 합성합니다.",
    quickKeywordsTitle: "✨ 원클릭 퀵 보정 키워드",
    chipSoloText: "다른 사람 없이 혼자만 나오게 해줘",
    chipResemblanceText: "내 원본 얼굴과 더 똑같이 해줘",
    chipSunsetText: "배경을 따뜻한 노을빛으로 바꿔줘",
    btnGenerate: "인생샷 생성하러 가기 ➔",
    btnGenerating: "AI 화보 생성 중... ⏳",
    deviceMobile: "📱 모바일 접속",
    deviceDesktop: "💻 컴퓨터(데스크톱) 접속",
    detectedLang: "🇰🇷 대한민국 (한국어) 감지됨",
    remainingCredits: "남은 생성 크레딧",
    freeTrialBadge: "무료 체험 가능",

    authTitleLogin: "TripShot 로그인",
    authTitleSignUp: "1초 회원가입",
    authSyncNotice: "로그인 시 구매하신 이용권 혜택이 모바일과 즉시 연동됩니다.",
    authGoogleBtn: "Google 계정으로 1초 로그인",
    authOrEmail: "또는 이메일",
    authNameLabel: "이름 / 닉네임",
    authNamePlaceholder: "예: 홍길동",
    authEmailLabel: "이메일 주소",
    authEmailPlaceholder: "example@domain.com",
    authPassLabel: "비밀번호",
    authPassPlaceholder: "비밀번호 6자리 이상",
    authMarketingConsent: "신규 명소 템플릿 및 할인 쿠폰 혜택 알림 받기 (선택)",
    authBtnLogin: "이메일로 로그인",
    authBtnSignUp: "무료 회원가입 완료",
    authSwitchToSignUp: "계정이 없으신가요? 1초 회원가입",
    authSwitchToLogin: "이미 계정이 있으신가요? 로그인하기",

    couponBadge: "🎟️ BETA TEST COUPON",
    couponTitle: "무료 크레딧 쿠폰 등록",
    couponSub: "발급받으신 쿠폰 코드를 입력하시면 무료 생성권이 즉시 충전됩니다.",
    couponCodeLabel: "COUPON CODE",
    couponPlaceholder: "쿠폰 코드를 입력하세요 (예: TRIP30)",
    couponBtnApply: "쿠폰 적용하기 ✨",
    couponSuccess: "🎉 쿠폰 적용 완료! 무료 크레딧이 충전되었습니다.",
    couponErrorEmpty: "쿠폰 코드를 입력해 주세요.",
    couponErrorInvalid: "유효하지 않거나 만료된 쿠폰 코드입니다.",

    payTitle: "안전한 결제 및 플랜 선택",
    paySub: "PayPal 및 신용카드로 안전하고 빠르게 결제하실 수 있습니다.",
    paySecureNotice: "🔒 256비트 암호화로 안전하게 결제됩니다.",
    payCreditsNotice: "결제 즉시 계정에 생성 크레딧이 충전됩니다.",

    loadingTravel1: "1번 셀카 인물 고화질 스캔 중... 📸",
    loadingTravel2: "선택하신 명소 배경 레이아웃을 매칭하고 있어요 🌅",
    loadingTravel3: "자연스러운 글로벌 조명과 그림자를 합성 중 ✨",
    loadingTravel4: "이목구비와 얼굴 고유 특징을 100% 보존하는 중 👤",
    loadingTravel5: "최고 화질 인생샷 합성 완료 직전! 🎨",
    loadingStudio1: "프리미엄 AI 인물 스튜디오 세팅 중... 📸",
    loadingStudio2: "맞춤 전문 조명과 톤을 조정하고 있어요 ✨",
    loadingStudio3: "실내 스튜디오 배경과 의상을 정교하게 튜닝 중 💼",
    loadingStudio4: "이목구비와 얼굴 고유 특징을 100% 보존하는 중 👤",
    loadingStudio5: "고품격 프로페셔널 화보 완성 직전! 🎨",
  },

  en: {
    title: "TripShot.world",
    navDestinations: "Destinations",
    navWhy: "Why TripShot?",
    navHowItWorks: "How It Works",
    navPricing: "Pricing",
    navCoupon: "Coupon",
    navLogin: "Sign In",
    navLogout: "Sign Out",
    ctaMakeMyPhoto: "Create My AI Shot ✨",
    ctaMakeMyPhotoFree: "✈️ Generate My AI Shot (2 Free)",

    badgeExtreme: "⚡ 100% Zero-Risk Extreme",
    badgeGlobal: "🌐 Global AI Studio",
    badgeSafe: "🛡️ 100% Safe Synthetic",
    heroHeadlineLine1: "From thrilling extreme spots to iconic global travel,",
    heroHeadlineLine2: "Stunning AI Photos in 10 Seconds",
    heroSub: "No dangerous cliff posing or restricted zones needed. Create 100% safe, high-quality travel & profile shots from home! ⚡📸",

    uploadSectionTitle: "1. Upload Portrait Photo 📸",
    facePreserveBadge: "🛡️ 100% Original Face ID Preservation (1:1 Exact Facial Lock)",
    facePreserveDesc: "Preserves 100% exact real-life eyes, nose, teeth smile, expressions, and glasses for every individual without AI distortion.",
    selectTravelCategoryTitle: "2. Select Travel Destination Spot",
    selectStudioCategoryTitle: "3. Select Studio & Concept Shoot",
    tabExtreme: "Extreme Thrill",
    tabTravel: "Global Travel",
    tabCustomTravel: "Custom Spot",
    tabBusiness: "Business Suit",
    tabIdPhoto: "ID / Passport",
    tabConcept: "Fun Concept",
    tabCustomStudio: "Custom Concept",

    destSectionTitle: "⚡ 100% Safe Extreme & Iconic Destinations",
    destSectionSub: "From Norway's Trolltunga & Kjeragbolten to Bali and Paris, craft stunning shots in 10 seconds from home.",
    btnSelectThisBg: "Select This Spot",

    valueBadge: "SAFE & STUNNING",
    valueTitleLine1: "No more dangerous shoots!",
    valueTitleLine2: "Create 100% Safe, Epic Landmark Portraits",
    valueSub: "Zero risk of cliff accidents or restricted zones. Our AI preserves your exact facial identity while seamlessly dressing you up in iconic worldwide locations with golden sunlight.",
    valSafeTitle: "100% Safe & Risk-Free",
    valSafeDesc: "Create dramatic shots without visiting hazardous zones",
    valFreeTitle: "Zero Travel Cost",
    valFreeDesc: "No expensive flight tickets needed — 10 seconds at home",
    valFaceTitle: "Exact Face ID Preservation",
    valFaceDesc: "Preserves your authentic facial details 100% accurately",

    howBadge: "HOW IT WORKS",
    howTitle: "3 Easy Steps to Your Dream Photo",
    howSub: "From a single selfie to a magazine-cover portrait in under 10 seconds.",
    step1Title: "Upload Photo",
    step1Desc: "Upload 1 clear selfie or full-body picture with visible face.",
    step2Title: "Pick Spot & Concept",
    step2Desc: "Choose from extreme cliffs, worldwide landmarks, or business suits.",
    step3Title: "Get 10s AI Result",
    step3Desc: "AI instantly composites a high-definition, true-to-life masterpiece.",

    pricingBadge: "PRICING PLANS",
    pricingTitle: "Simple One-Time Recharge Plans",
    pricingSub: "No monthly subscriptions. Recharge credits as needed and use them forever with no expiration.",
    planStarterTitle: "Starter Pass (20 Photos)",
    planStarterBadge: "⚡ 20 Credits",
    planStarterDesc: "Perfect trial pass to create 2~3 iconic destination portraits (No Expiration)",
    planStarterF1: "20 High-Quality AI Composites",
    planStarterF2: "30+ Global Landmarks & Dual Synthesis",
    planStarterF3: "Credits Never Expire (Keep Forever)",
    planProTitle: "Pro Pass (60 Photos)",
    planProBadge: "🔥 MOST POPULAR (60 Credits)",
    planProDesc: "2x Price for 3x Photos! Complete multiple destinations with friends & family (30% OFF)",
    planProF1: "60 Ultra High-Quality 2K Composites",
    planProF2: "Free 1x AI Magic Refinement Included ($0)",
    planProF3: "Includes Passport 8-Photo Print Sheet",
    planUltimateTitle: "Ultimate VIP Pass (150 Photos)",
    planUltimateBadge: "👑 VIP (150 Credits)",
    planUltimateDesc: "Lowest unit price! For creators, groups, and complete global portfolio (42% OFF)",
    planUltimateF1: "150 Masterpiece 2K AI Generations",
    planUltimateF2: "Priority GPU Queue + Zero Watermark",
    planUltimateF3: "Commercial Use & Lifetime Original Downloads",
    btnSelectPlan: "Get This Plan",

    dropzoneTitle: "Click to upload or drag & drop photo",
    dropzoneSub: "Clear front-facing portrait yields the most stunning, true-to-life results (Max 10MB)",
    dropzoneChange: "Change Photo",
    dropzoneRemove: "Remove",
    bgSelectTitle: "🎨 Select Studio Backdrop Color",
    bgWhite: "Solid White",
    bgBlue: "Light Blue",
    bgGray: "Light Gray",
    customPromptPlaceholder: "Describe your custom background or style (e.g. Standing on top of Alps mountain with a helicopter)",
    customBgUploadLabel: "Upload your custom background image",
    tabDualUpload: "⛰️ Blend with Extreme / Landmark Photo (2 Photos)",
    tabPresetLandmark: "🌴 Landmark Style Templates (1 Photo)",
    dualUploadTitle: "100% Safe AI Blend: Cozy Indoor Portrait + Extreme Backdrop",
    dualPersonPhotoLabel: "1. Your Portrait / Selfie (Taken safely at home)",
    dualPersonPhotoSub: "Preserves 100% of your authentic facial features & expression.",
    dualBgPhotoLabel: "2. Extreme / Hazardous Destination Photo (Cliffs, restricted zones, etc.)",
    dualBgPhotoSub: "Upload photos of dangerous cliffs or breathtaking scenic spots.",
    dualBlendBadge: "🛡️ 100% Zero-Risk AI Scenic Blending Engine",
    dualBlendDesc: "No need to stand on dangerous cliffs. AI blends you into the scene with matched lighting & contact shadows.",
    quickKeywordsTitle: "✨ 1-Click Quick Refinement Tags",
    chipSoloText: "Remove other people, show only me solo",
    chipResemblanceText: "Make it resemble my original selfie face more closely",
    chipSunsetText: "Change the background lighting to warm sunset golden hour",
    btnGenerate: "Generate AI Shot Now ➔",
    btnGenerating: "Generating AI Masterpiece... ⏳",
    deviceMobile: "📱 Mobile Device",
    deviceDesktop: "💻 Desktop Computer",
    detectedLang: "🇺🇸 English (US) Detected",
    remainingCredits: "Credits Remaining",
    freeTrialBadge: "Free Trial Available",

    authTitleLogin: "TripShot Sign In",
    authTitleSignUp: "1-Second Sign Up",
    authSyncNotice: "Signing in syncs your purchased credits across mobile and PC seamlessly.",
    authGoogleBtn: "Continue with Google",
    authOrEmail: "or with email",
    authNameLabel: "Name / Nickname",
    authNamePlaceholder: "e.g. Alex Smith",
    authEmailLabel: "Email Address",
    authEmailPlaceholder: "example@domain.com",
    authPassLabel: "Password",
    authPassPlaceholder: "6+ characters",
    authMarketingConsent: "Receive new landmark drops & discount coupons (Optional)",
    authBtnLogin: "Sign In with Email",
    authBtnSignUp: "Complete Free Registration",
    authSwitchToSignUp: "Don't have an account? Sign up in 1s",
    authSwitchToLogin: "Already have an account? Sign in",

    couponBadge: "🎟️ BETA TEST COUPON",
    couponTitle: "Redeem Free Credit Coupon",
    couponSub: "Enter your promotional code to instantly receive free generation credits.",
    couponCodeLabel: "COUPON CODE",
    couponPlaceholder: "Enter coupon code (e.g. TRIP30)",
    couponBtnApply: "Apply Coupon ✨",
    couponSuccess: "🎉 Coupon applied successfully! Free credits have been added.",
    couponErrorEmpty: "Please enter a coupon code.",
    couponErrorInvalid: "Invalid or expired coupon code.",

    payTitle: "Secure Checkout & Plan Selection",
    paySub: "Fast and safe checkout powered by PayPal and Credit Cards.",
    paySecureNotice: "🔒 256-bit SSL encrypted secure payment.",
    payCreditsNotice: "Credits will be added to your balance immediately after payment.",

    loadingTravel1: "Scanning high-resolution selfie portrait... 📸",
    loadingTravel2: "Matching chosen destination perspective & sunlight 🌅",
    loadingTravel3: "Synthesizing authentic global lighting & shadows ✨",
    loadingTravel4: "Preserving 100% of your unique facial features 👤",
    loadingTravel5: "Finishing ultra-sharp travel masterpiece! 🎨",
    loadingStudio1: "Setting up premium AI portrait studio... 📸",
    loadingStudio2: "Balancing customized professional lighting ✨",
    loadingStudio3: "Refining studio backdrop and tailored attire 💼",
    loadingStudio4: "Preserving 100% of your unique facial features 👤",
    loadingStudio5: "Delivering professional high-definition portrait! 🎨",
  },

  ja: {
    title: "TripShot.world",
    navDestinations: "人気スポット",
    navWhy: "選ばれる理由",
    navHowItWorks: "ご利用方法",
    navPricing: "料金プラン",
    navCoupon: "クーポン",
    navLogin: "ログイン",
    navLogout: "ログアウト",
    ctaMakeMyPhoto: "写真を作成する ✨",
    ctaMakeMyPhotoFree: "✈️ AI写真を作成する（無料2回）",

    badgeExtreme: "⚡ 100% Risk-Free エクストリーム",
    badgeGlobal: "🌐 グローバル AI スタジオ",
    badgeSafe: "🛡️ 100% 安全合成",
    heroHeadlineLine1: "世界中のスリリングな絶景からロマンチックな観光地まで、",
    heroHeadlineLine2: "10秒で完成する感動のAIショット",
    heroSub: "危険な崖や立ち入り禁止区域に行く必要はありません。自宅で100% safeに高品質な写真集を完成させましょう！⚡📸",

    uploadSectionTitle: "1. 人物写真をアップロード 📸",
    facePreserveBadge: "🛡️ 100% 本人の顔立ちを完全保存（1:1 原本完全固定）",
    facePreserveDesc: "自撮りから12人の大家族まで、目・鼻・口・笑顔・メガネを100%忠実に保ちながら合成します。",
    selectTravelCategoryTitle: "2. 観光スポット背景を選択",
    selectStudioCategoryTitle: "3. スタジオ＆コンセプト撮影を選択",
    tabExtreme: "エクストリーム絶景",
    tabTravel: "世界の観光地",
    tabCustomTravel: "カスタムスポット",
    tabBusiness: "ビジネススーツ",
    tabIdPhoto: "証明写真・パスポート",
    tabConcept: "コンセプト・Fun",
    tabCustomStudio: "カスタム",

    destSectionTitle: "⚡ 100%安全なエクストリーム＆世界の名所",
    destSectionSub: "ノルウェーのトロルトゥンガからバリ島、パリまで自宅から10秒で完成。",
    btnSelectThisBg: "この背景を選択",

    valueBadge: "SAFE & STUNNING",
    valueTitleLine1: "危険な撮影はもう不要！",
    valueTitleLine2: "100%安全に作る自分だけの名所グラビア",
    valueSub: "危険な崖や立ち入り禁止区域のリスクなく、AI技術であなたの顔の特徴を忠実に再現しながら、世界最高の名所の光と背景を美しく合成します。",
    valSafeTitle: "100% 安全・安心",
    valSafeDesc: "危険な場所に行かずに安全に作成",
    valFreeTitle: "旅費ゼロ円",
    valFreeDesc: "高額な航空券なしで自宅から10秒完成",
    valFaceTitle: "顔の特徴を忠実に再現",
    valFaceDesc: "本人の自然な顔立ちを100%キープ",

    howBadge: "HOW IT WORKS",
    howTitle: "たったの3ステップで10秒完成",
    howSub: "自撮り写真をアップロードするだけで、高画質なグラビア写真が完成します。",
    step1Title: "写真アップロード",
    step1Desc: "顔がはっきり写った自撮り写真を1枚アップロードします。",
    step2Title: "スポット＆スタイル選択",
    step2Desc: "絶景スポット、世界の観光地、スーツなどからお好みのスタイルを選択。",
    step3Title: "10秒で完成＆保存",
    step3Desc: "AIがあなたの特徴を保ったまま超高画質写真を出力します。",

    pricingBadge: "PRICING PLANS",
    pricingTitle: "明朗な買い切りチャージプラン",
    pricingSub: "月額の自動引き落としなし。必要な分だけチャージして永久にご利用いただけます（有効期限なし）。",
    planStarterTitle: "Starter パス (20枚)",
    planStarterBadge: "⚡ 20枚チャージ",
    planStarterDesc: "2〜3箇所の名所写真を気軽に試せるお得な体験パス（有効期限なし）",
    planStarterF1: "高画質 AI写真 20枚生成",
    planStarterF2: "30+ 世界の名所＆デュアル合成対応",
    planStarterF3: "クレジット有効期限なし（永久所持）",
    planProTitle: "Pro パス (60枚)",
    planProBadge: "🔥 一番人気 (60枚)",
    planProDesc: "価格は2倍で枚数は3倍！家族や友人と様々な名所写真を完成（30%OFF）",
    planProF1: "2K超高画質 AI写真 60枚生成",
    planProF2: "1回無料のAIマジック修正付き（0円）",
    planProF3: "証明写真8分割印刷シート付き",
    planUltimateTitle: "Ultimate VIP パス (150枚)",
    planUltimateBadge: "👑 VIP (150枚)",
    planUltimateDesc: "1枚あたり最安値！クリエイター・団体向け大容量パッケージ（42%OFF）",
    planUltimateF1: "2K最高峰 AI写真 150枚生成",
    planUltimateF2: "最優先 高速レンダリング＆透かし完全除去",
    planUltimateF3: "商用利用可能＆オリジナル永久保存",
    btnSelectPlan: "このプランを選択",

    dropzoneTitle: "クリックしてアップロード、またはファイルをドラッグ",
    dropzoneSub: "顔が鮮明に写った正面の写真ほど、最も完成度の高いグラビアが仕上がります（最大10MB）",
    dropzoneChange: "写真を変更",
    dropzoneRemove: "削除",
    bgSelectTitle: "🎨 スタジオ単色背景色の選択",
    bgWhite: "ホワイト",
    bgBlue: "ライトブルー",
    bgGray: "ライトグレー",
    customPromptPlaceholder: "ご希望の背景や雰囲気を自由に入力してください（例：アルプス山頂でヘリコプターに乗って撮影）",
    customBgUploadLabel: "手持ちの背景画像を直接アップロード",
    tabDualUpload: "⛰️ 危険スポット・現場写真に合成 (写真2枚)",
    tabPresetLandmark: "🌴 人気スポットテンプレート (写真1枚)",
    dualUploadTitle: "100%安全AI合成：お部屋で撮影＋危険スポット背景",
    dualPersonPhotoLabel: "1. あなたの人物・自撮り写真（お部屋で安全に撮影）",
    dualPersonPhotoSub: "顔のパーツや表情を100%忠実に保持して合成します。",
    dualBgPhotoLabel: "2. 危険な絶壁・現場の背景写真（立ち入り禁止区域・名所など）",
    dualBgPhotoSub: "立ち入るのが危険な崖や絶景スポットの写真を設定してください。",
    dualBlendBadge: "🛡️ 100%安全 AIリアル合成エンジン稼働",
    dualBlendDesc: "危険な崖っぷちに立つことなく、AIが自然な太陽光と影でまるでその場にいるように合成します。",
    quickKeywordsTitle: "✨ ワンクリック補正キーワード",
    chipSoloText: "他の人を消して、一人だけ映るようにして",
    chipResemblanceText: "私の元の顔にもっと似せて修正して",
    chipSunsetText: "背景を温かい夕焼けの光に変更して",
    btnGenerate: "AI写真を作成する ➔",
    btnGenerating: "AI写真を生成中... ⏳",
    deviceMobile: "📱 スマホ接続",
    deviceDesktop: "💻 PC接続",
    detectedLang: "🇯🇵 日本 (日本語) 検出",
    remainingCredits: "残りクレジット",
    freeTrialBadge: "無料トライアル可能",

    authTitleLogin: "TripShot ログイン",
    authTitleSignUp: "1秒で無料登録",
    authSyncNotice: "ログインすると購入済みクレジットがスマホとPCで同期されます。",
    authGoogleBtn: "Googleアカウントでログイン",
    authOrEmail: "またはメールアドレス",
    authNameLabel: "お名前 / ニックネーム",
    authNamePlaceholder: "例：山田 太郎",
    authEmailLabel: "メールアドレス",
    authEmailPlaceholder: "example@domain.com",
    authPassLabel: "パスワード",
    authPassPlaceholder: "6文字以上",
    authMarketingConsent: "新着スポットやおトクなクーポン情報を受け取る（任意）",
    authBtnLogin: "メールでログイン",
    authBtnSignUp: "無料で登録完了",
    authSwitchToSignUp: "アカウントをお持ちでないですか？1秒で登録",
    authSwitchToLogin: "すでにアカウントをお持ちですか？ログイン",

    couponBadge: "🎟️ BETA TEST COUPON",
    couponTitle: "無料クーポン登録",
    couponSub: "クーポンコードを入力すると、無料クレジットが即時チャージされます。",
    couponCodeLabel: "COUPON CODE",
    couponPlaceholder: "クーポンコードを入力（例：TRIP30）",
    couponBtnApply: "クーポンを適用 ✨",
    couponSuccess: "🎉 クーポンが適用されました！無料クレジットが付与されました。",
    couponErrorEmpty: "クーポンコードを入力してください。",
    couponErrorInvalid: "無効または期限切れのクーポンコードです。",

    payTitle: "安心・安全なお支払い",
    paySub: "PayPalおよび主要クレジットカードで安全に決済いただけます。",
    paySecureNotice: "🔒 256bit暗号化による安全な決済",
    payCreditsNotice: "決済完了後、即座にクレジットが反映されます。",

    loadingTravel1: "高画質自撮り写真をスキャン中... 📸",
    loadingTravel2: "選んだ名所の背景と光をマッチング中 🌅",
    loadingTravel3: "リアルな自然光と影を合成中 ✨",
    loadingTravel4: "あなたの顔の特徴を100%保全中 👤",
    loadingTravel5: "超高画質な旅行写真が完成間近！ 🎨",
    loadingStudio1: "プレミアムAIスタジオをセットアップ中... 📸",
    loadingStudio2: "プロ仕様のライティングを調整中 ✨",
    loadingStudio3: "スタジオ背景と衣装をフィット中 💼",
    loadingStudio4: "あなたの顔の特徴を100%保全中 👤",
    loadingStudio5: "高品位なポートレートが完成間近！ 🎨",
  },

  zh: {
    title: "TripShot.world",
    navDestinations: "热门景点",
    navWhy: "为什么选择TripShot?",
    navHowItWorks: "使用方法",
    navPricing: "价格方案",
    navCoupon: "优惠券",
    navLogin: "登录",
    navLogout: "退出登录",
    ctaMakeMyPhoto: "立即生成AI大片 ✨",
    ctaMakeMyPhotoFree: "✈️ 立即生成AI写真（免费2次）",

    badgeExtreme: "⚡ 100% 零风险极限名胜",
    badgeGlobal: "🌐 全球 AI 工作室",
    badgeSafe: "🛡️ 100% 安全合成",
    heroHeadlineLine1: "从惊险刺激的悬崖绝景到浪漫环球旅拍，",
    heroHeadlineLine2: "10秒生成高品质AI人生大片",
    heroSub: "无需冒着危险前往悬崖或禁区，在室内即可100%安全生成超清环球旅行与商务写真！⚡📸",

    uploadSectionTitle: "1. 上传人物照片 📸",
    facePreserveBadge: "🛡️ 100% 真实面容锁定模式（1:1 完美保留真实五官）",
    facePreserveDesc: "100%完整保留原图五官、眼睛、鼻梁、笑容与眼镜，告别AI虚假换脸与畸变。",
    selectTravelCategoryTitle: "2. 选择旅行名胜背景",
    selectStudioCategoryTitle: "3. 选择商务与创意写真",
    tabExtreme: "极限惊险",
    tabTravel: "环球旅拍",
    tabCustomTravel: "自定义景点",
    tabBusiness: "商务正装",
    tabIdPhoto: "证件照·护照",
    tabConcept: "创意写真",
    tabCustomStudio: "自定义",

    destSectionTitle: "⚡ 100%安全零风险 极限与世界名胜",
    destSectionSub: "从挪威恶魔之舌、谢拉格伯顿石到巴厘岛与巴黎，足不出户10秒搞定。",
    btnSelectThisBg: "选择此背景",

    valueBadge: "SAFE & STUNNING",
    valueTitleLine1: "告别危险拍摄！",
    valueTitleLine2: "100%安全定制专属于您的绝景大片",
    valueSub: "无需承担悬崖攀登或禁区违规风险。AI技术完整保留您的面部特征，精准融合全球顶级景致与自然光影。",
    valSafeTitle: "100% 安全零风险",
    valSafeDesc: "无需前往危险区域，安全安心生成",
    valFreeTitle: "0元旅行预算",
    valFreeDesc: "省去高昂机票，10秒居家合成",
    valFaceTitle: "保留真实面部特征",
    valFaceDesc: "100%忠实还原您的个人面容与神态",

    howBadge: "HOW IT WORKS",
    howTitle: "三步快速生成AI大片",
    howSub: "仅需一张自拍，10秒内生成媲美专业摄影的顶级写真。",
    step1Title: "上传自拍照",
    step1Desc: "上传一张面部清晰的正面自拍或全身照。",
    step2Title: "选择景点与风格",
    step2Desc: "挑选极限悬崖、环球名胜或商务正装等模板。",
    step3Title: "10秒生成并保存",
    step3Desc: "AI智能合成高分辨率真实质感大片并可立即下载。",

    pricingBadge: "PRICING PLANS",
    pricingTitle: "透明按次充值方案",
    pricingSub: "无月度自动续费订阅。按需充值，点数永久有效（无有效期限制）。",
    planStarterTitle: "Starter 入门卡 (20张)",
    planStarterBadge: "⚡ 20点充值",
    planStarterDesc: "轻松体验2~3处全球名胜与写真大片（点数永不过期）",
    planStarterF1: "生成 20张 高清AI写真",
    planStarterF2: "支持 30+ 全球名胜与双图合成",
    planStarterF3: "点数永不过期（永久保存）",
    planProTitle: "Pro 专业卡 (60张)",
    planProBadge: "🔥 最受欢迎 (60张)",
    planProDesc: "价格仅翻倍，张数直接3倍！与亲友一起畅游多处绝景（省30%）",
    planProF1: "生成 60张 2K超清AI写真",
    planProF2: "免费赠送 1次 AI魔法微调修图（0元）",
    planProF3: "赠送 证件照8分版冲印排版",
    planUltimateTitle: "Ultimate VIP卡 (150张)",
    planUltimateBadge: "👑 VIP (150张)",
    planUltimateDesc: "单张成本最低！创作者、团队聚会及全景点大包（省42%）",
    planUltimateF1: "生成 150张 2K顶级画质AI大片",
    planUltimateF2: "顶级GPU优先超速渲染 + 永久无水印",
    planUltimateF3: "支持商业用途与原图无限制珍藏",
    btnSelectPlan: "选择此方案",

    dropzoneTitle: "点击上传或直接拖拽图片到此处",
    dropzoneSub: "面部清晰的正面人物照片能呈现出最完美逼真的大片效果（最大10MB）",
    dropzoneChange: "更换照片",
    dropzoneRemove: "移除",
    bgSelectTitle: "🎨 选择影棚纯色背景",
    bgWhite: "纯白",
    bgBlue: "浅蓝",
    bgGray: "浅灰",
    customPromptPlaceholder: "请输入您想要的自定义背景或风格（例如：阿尔卑斯山顶直升机前的合影）",
    customBgUploadLabel: "直接上传您的自定义背景图片",
    tabDualUpload: "⛰️ 合成至危险景点/现场实拍 (2张照片)",
    tabPresetLandmark: "🌴 推荐名胜模板 (1张照片)",
    dualUploadTitle: "100%安全AI合成：居家舒适人像 + 危险实景背景",
    dualPersonPhotoLabel: "1. 我的自拍/人像照片 (在家安全拍摄)",
    dualPersonPhotoSub: "100%完整保留您的真实五官细节与自然表情。",
    dualBgPhotoLabel: "2. 危险悬崖/禁区实景背景 (悬崖、管控区、壮丽风光等)",
    dualBgPhotoSub: "上传亲自前往有危险或难以踏足的绝景现场照片。",
    dualBlendBadge: "🛡️ 100%零风险 AI超实景融合引擎",
    dualBlendDesc: "无需冒险站在悬崖边缘，AI将根据自然光线与接触阴影完美将您置身于绝美现场。",
    quickKeywordsTitle: "✨ 一键快捷微调标签",
    chipSoloText: "移除其他人，只保留我单人",
    chipResemblanceText: "修改得更像我原图自拍的面部特征",
    chipSunsetText: "将背景光线调整为温暖的夕阳晚霞",
    btnGenerate: "生成AI写真 ➔",
    btnGenerating: "正在生成AI大片... ⏳",
    deviceMobile: "📱 移动端连接",
    deviceDesktop: "💻 电脑PC端连接",
    detectedLang: "🇨🇳 中国 (简体中文) 已识别",
    remainingCredits: "剩余生成点数",
    freeTrialBadge: "支持免费体验",

    authTitleLogin: "TripShot 登录",
    authTitleSignUp: "1秒快速注册",
    authSyncNotice: "登录后，您的点数将在手机与电脑之间自动无缝同步。",
    authGoogleBtn: "通过 Google 账号登录",
    authOrEmail: "或通过邮箱登录",
    authNameLabel: "姓名 / 昵称",
    authNamePlaceholder: "例如：李明",
    authEmailLabel: "电子邮箱",
    authEmailPlaceholder: "example@domain.com",
    authPassLabel: "登录密码",
    authPassPlaceholder: "6位以上密码",
    authMarketingConsent: "接收新景点上线及专属折扣优惠（可选）",
    authBtnLogin: "邮箱登录",
    authBtnSignUp: "完成免费注册",
    authSwitchToSignUp: "还没有账号？1秒免费注册",
    authSwitchToLogin: "已有账号？点击登录",

    couponBadge: "🎟️ BETA TEST COUPON",
    couponTitle: "兑换免费点数优惠券",
    couponSub: "输入您的优惠码，即可立即充值免费生成点数。",
    couponCodeLabel: "COUPON CODE",
    couponPlaceholder: "输入优惠券代码（如 TRIP30）",
    couponBtnApply: "立即兑换 ✨",
    couponSuccess: "🎉 兑换成功！免费点数已充值至您的账户。",
    couponErrorEmpty: "请输入优惠码。",
    couponErrorInvalid: "优惠码无效或已过期。",

    payTitle: "安全便捷结账",
    paySub: "支持 PayPal 及国际主流信用卡安全付款。",
    paySecureNotice: "🔒 256位银行级加密安全保障",
    payCreditsNotice: "支付完成后点数将即刻充值到账。",

    loadingTravel1: "正在高清扫描自拍人像... 📸",
    loadingTravel2: "正在匹配选定名胜背景的视角与光线 🌅",
    loadingTravel3: "正在融合自然光影与环境氛围 ✨",
    loadingTravel4: "正在100%保留您的真实五官特征 👤",
    loadingTravel5: "超清环球旅拍大片即将完成！ 🎨",
    loadingStudio1: "正在布置高级AI人像摄影棚... 📸",
    loadingStudio2: "正在调整专业影棚灯光与色调 ✨",
    loadingStudio3: "正在匹配定制背景与高级西装服饰 💼",
    loadingStudio4: "正在100%保留您的真实五官特征 👤",
    loadingStudio5: "高品质专业商务大片即将完成！ 🎨",
  },

  id: {
    title: "TripShot.world",
    navDestinations: "Destinasi Populer",
    navWhy: "Mengapa TripShot?",
    navHowItWorks: "Cara Kerja",
    navPricing: "Harga & Paket",
    navCoupon: "Kupon",
    navLogin: "Masuk",
    navLogout: "Keluar",
    ctaMakeMyPhoto: "Buat Foto AI ✨",
    ctaMakeMyPhotoFree: "✈️ Buat Foto AI Saya (Gratis 2x)",

    badgeExtreme: "⚡ 100% Zero-Risk Ekstrem",
    badgeGlobal: "🌐 Studio AI Global",
    badgeSafe: "🛡️ 100% Sintetis Aman",
    heroHeadlineLine1: "Dari spot ekstrem yang memicu adrenalin hingga wisata dunia,",
    heroHeadlineLine2: "Foto AI Spektakuler dalam 10 Detik",
    heroSub: "Tidak perlu mengambil risiko di tebing berbahaya. Buat foto perjalanan & pasfoto profesional 100% aman dari rumah! ⚡📸",

    uploadSectionTitle: "1. Unggah Foto Wajah / Diri 📸",
    facePreserveBadge: "🛡️ Mode Kunci Wajah 100% Asli (Kunci Presisi 1:1 Sesuai Foto Asli)",
    facePreserveDesc: "Mempertahankan 100% mata, hidung, senyum, kacamata, dan ekspresi asli setiap individu tanpa distorsi AI.",
    selectTravelCategoryTitle: "2. Pilih Destinasi Wisata",
    selectStudioCategoryTitle: "3. Pilih Studio & Foto Konsep",
    tabExtreme: "Sensasi Ekstrem",
    tabTravel: "Wisata Dunia",
    tabCustomTravel: "Spot Kustom",
    tabBusiness: "Jas Bisnis",
    tabIdPhoto: "Pasfoto / Visa",
    tabConcept: "Konsep Unik",
    tabCustomStudio: "Kustom",

    destSectionTitle: "⚡ 100% Aman Spot Ekstrem & Ikonik Dunia",
    destSectionSub: "Dari Trolltunga & Kjeragbolten Norwegia hingga Bali dan Paris, buat dalam 10 detik dari rumah.",
    btnSelectThisBg: "Pilih Latar Ini",

    valueBadge: "SAFE & STUNNING",
    valueTitleLine1: "Hindari pemotretan berbahaya!",
    valueTitleLine2: "Buat Foto Wisata Spektakuler 100% Aman",
    valueSub: "Tanpa risiko tebing curam atau zona terlarang. Teknologi AI kami mempertahankan 100% fitur wajah asli Anda dengan pencahayaan matahari emas alami di lokasi dunia.",
    valSafeTitle: "100% Aman & Tanpa Risiko",
    valSafeDesc: "Buat foto ekstrem tanpa perlu ke tempat berbahaya",
    valFreeTitle: "Hemat Biaya Wisata",
    valFreeDesc: "Tanpa tiket pesawat mahal, selesai dalam 10 detik di rumah",
    valFaceTitle: "Preservasi Wajah Asli",
    valFaceDesc: "Menjaga 100% detail dan proporsi wajah asli Anda",

    howBadge: "HOW IT WORKS",
    howTitle: "3 Langkah Mudah Menuju Foto Impian",
    howSub: "Dari satu foto selfie hingga foto mahakarya beresolusi tinggi dalam 10 detik.",
    step1Title: "Unggah Foto",
    step1Desc: "Unggah 1 foto selfie atau foto seluruh badan yang jelas.",
    step2Title: "Pilih Lokasi & Gaya",
    step2Desc: "Pilih tebing ekstrem, wisata dunia, atau jas profesional.",
    step3Title: "Hasil AI 10 Detik",
    step3Desc: "AI langsung menghasilkan foto berkualitas tinggi yang sangat mirip.",

    pricingBadge: "PRICING PLANS",
    pricingTitle: "Paket Isi Ulang Sekali Bayar",
    pricingSub: "Tanpa langganan bulanan tersembunyi. Isi ulang sesuai kebutuhan, kredit berlaku selamanya tanpa kedaluwarsa.",
    planStarterTitle: "Starter Pass (20 Foto)",
    planStarterBadge: "⚡ 20 Kredit",
    planStarterDesc: "Paket hemat untuk mencoba 2~3 foto wisata populer (Tanpa Kedaluwarsa)",
    planStarterF1: "20x Komposit Foto AI HD",
    planStarterF2: "30+ Destinasi Global & Komposit Ganda",
    planStarterF3: "Kredit Berlaku Selamanya (Tanpa Batas Waktu)",
    planProTitle: "Pro Pass (60 Foto)",
    planProBadge: "🔥 PALING POPULER (60 Foto)",
    planProDesc: "Harga 2x lipat, dapat foto 3x lipat! Sempurna untuk foto bersama keluarga/teman (Hemat 30%)",
    planProF1: "60x Komposit Foto AI Resolusi 2K",
    planProF2: "Termasuk 1x Gratis Edit Ajaib AI ($0)",
    planProF3: "Termasuk Lembar Cetak 8 Pasfoto",
    planUltimateTitle: "Ultimate VIP Pass (150 Foto)",
    planUltimateBadge: "👑 VIP (150 Foto)",
    planUltimateDesc: "Harga per foto termurah! Untuk kreator konten dan rombongan (Hemat 42%)",
    planUltimateF1: "150x Pembuatan Foto AI 2K Masterpiece",
    planUltimateF2: "Antrean GPU Prioritas + Tanpa Watermark",
    planUltimateF3: "Penggunaan Komersial & Unduhan Asli Selamanya",
    btnSelectPlan: "Pilih Paket Ini",

    dropzoneTitle: "Klik untuk unggah atau seret & lepas foto",
    dropzoneSub: "Foto wajah tampak depan yang jelas akan menghasilkan foto paling sempurna (Maks 10MB)",
    dropzoneChange: "Ganti Foto",
    dropzoneRemove: "Hapus",
    bgSelectTitle: "🎨 Pilih Warna Latar Studio",
    bgWhite: "Putih Plain",
    bgBlue: "Biru Muda",
    bgGray: "Abu-abu Muda",
    customPromptPlaceholder: "Tuliskan latar belakang kustom Anda (contoh: Di atas helikopter Pegunungan Alpen)",
    customBgUploadLabel: "Unggah gambar latar belakang kustom Anda",
    tabDualUpload: "⛰️ Komposit Foto Ekstrem / Tempat Berbahaya (2 Foto)",
    tabPresetLandmark: "🌴 Template Destinasi Populer (1 Foto)",
    dualUploadTitle: "Komposit AI 100% Aman: Foto Santai di Rumah + Tebing Ekstrem",
    dualPersonPhotoLabel: "1. Foto Diri / Selfie Anda (Diambil dengan nyaman di rumah)",
    dualPersonPhotoSub: "Menjaga 100% kemiripan wajah, mata, dan ekspresi asli Anda.",
    dualBgPhotoLabel: "2. Foto Tebing Ekstrem / Lokasi Berbahaya (Jurang, zona terlarang, dll.)",
    dualBgPhotoSub: "Unggah foto tebing berbahaya atau pemandangan spektakuler.",
    dualBlendBadge: "🛡️ Mesin Komposit AI 100% Aman & Tanpa Risiko",
    dualBlendDesc: "Tanpa perlu berdiri di tepi tebing berbahaya, AI menyelaraskan pencahayaan matahari dan bayangan secara sempurna.",
    quickKeywordsTitle: "✨ Kata Kunci Cepat 1-Klik",
    chipSoloText: "Hapus orang lain, tampilkan hanya saya sendiri",
    chipResemblanceText: "Buat lebih mirip dengan wajah foto asli saya",
    chipSunsetText: "Ubah latar belakang menjadi nuansa matahari terbenam yang hangat",
    btnGenerate: "Hasilkan Foto AI ➔",
    btnGenerating: "Sedang Membuat Foto AI... ⏳",
    deviceMobile: "📱 Perangkat Seluler",
    deviceDesktop: "💻 Komputer / Laptop",
    detectedLang: "🇮🇩 Indonesia (Bahasa) Terdeteksi",
    remainingCredits: "Sisa Kredit",
    freeTrialBadge: "Uji Coba Gratis",

    authTitleLogin: "Masuk TripShot",
    authTitleSignUp: "Daftar Cepat 1 Detik",
    authSyncNotice: "Masuk untuk menyinkronkan saldo kredit Anda di HP dan PC secara otomatis.",
    authGoogleBtn: "Lanjutkan dengan Google",
    authOrEmail: "atau dengan email",
    authNameLabel: "Nama / Panggilan",
    authNamePlaceholder: "contoh: Budi Santoso",
    authEmailLabel: "Alamat Email",
    authEmailPlaceholder: "example@domain.com",
    authPassLabel: "Kata Sandi",
    authPassPlaceholder: "Minimal 6 karakter",
    authMarketingConsent: "Dapatkan notifikasi spot baru & kupon promo (Opsional)",
    authBtnLogin: "Masuk dengan Email",
    authBtnSignUp: "Selesaikan Pendaftaran Gratis",
    authSwitchToSignUp: "Belum punya akun? Daftar gratis 1 detik",
    authSwitchToLogin: "Sudah punya akun? Masuk",

    couponBadge: "🎟️ BETA TEST COUPON",
    couponTitle: "Klaim Kupon Kredit Gratis",
    couponSub: "Masukkan kode promo Anda untuk mendapatkan kredit pembuatan gratis langsung.",
    couponCodeLabel: "COUPON CODE",
    couponPlaceholder: "Masukkan kode kupon (contoh: TRIP30)",
    couponBtnApply: "Gunakan Kupon ✨",
    couponSuccess: "🎉 Kupon berhasil digunakan! Kredit gratis telah ditambahkan.",
    couponErrorEmpty: "Silakan masukkan kode kupon.",
    couponErrorInvalid: "Kode kupon tidak valid atau sudah kedaluwarsa.",

    payTitle: "Pembayaran Aman & Pilih Paket",
    paySub: "Pembayaran cepat dan aman dengan PayPal dan Kartu Kredit.",
    paySecureNotice: "🔒 Enkripsi 256-bit aman dan terpercaya.",
    payCreditsNotice: "Kredit akan langsung masuk ke akun Anda setelah pembayaran.",

    loadingTravel1: "Memindai foto selfie beresolusi tinggi... 📸",
    loadingTravel2: "Mencocokkan pencahayaan & sudut pemandangan 🌅",
    loadingTravel3: "Menggabungkan cahaya & bayangan realistis ✨",
    loadingTravel4: "Menjaga 100% kemiripan wajah asli Anda 👤",
    loadingTravel5: "Foto perjalanan spektakuler hampir selesai! 🎨",
    loadingStudio1: "Menyiapkan studio foto AI premium... 📸",
    loadingStudio2: "Menyesuaikan pencahayaan profesional ✨",
    loadingStudio3: "Menyelaraskan latar belakang studio & busana jas 💼",
    loadingStudio4: "Menjaga 100% kemiripan wajah asli Anda 👤",
    loadingStudio5: "Foto studio profesional hampir siap! 🎨",
  },
};

/**
 * Automatically detects user device and language from the browser environment.
 * If the user's browser is set to Korean, it uses 'ko'.
 * If Japanese, 'ja'. If Chinese, 'zh'. If Indonesian, 'id'.
 * For all other global users (English, French, German, Spanish, etc.), it defaults to 'en' (100% English).
 */
export function detectUserDeviceAndLang(): { lang: Language; isMobile: boolean } {
  if (typeof window === "undefined") {
    return { lang: "en", isMobile: false };
  }

  const userAgent = navigator.userAgent || "";
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  // Check URL query parameters (e.g. ?lang=en, ?locale=en, ?hl=en)
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = (urlParams.get("lang") || urlParams.get("locale") || urlParams.get("hl") || "").toLowerCase();
  if (paramLang.startsWith("en")) return { lang: "en", isMobile };
  if (paramLang.startsWith("ja")) return { lang: "ja", isMobile };
  if (paramLang.startsWith("zh")) return { lang: "zh", isMobile };
  if (paramLang.startsWith("id")) return { lang: "id", isMobile };
  if (paramLang.startsWith("ko")) return { lang: "ko", isMobile };

  const rawLangs = [
    ...(navigator.languages || []),
    navigator.language,
    (navigator as any).userLanguage,
    (navigator as any).browserLanguage,
  ]
    .filter(Boolean)
    .map((l) => String(l).toLowerCase());

  const primaryLang = rawLangs[0] || "";

  let lang: Language = "en"; // Default for all global users is 100% natural English

  if (primaryLang.startsWith("ko")) {
    lang = "ko";
  } else if (primaryLang.startsWith("ja")) {
    lang = "ja";
  } else if (primaryLang.startsWith("zh")) {
    lang = "zh";
  } else if (primaryLang.startsWith("id")) {
    lang = "id";
  } else {
    // English or any other international languages
    lang = "en";
  }

  return { lang, isMobile };
}

/**
 * Translations for individual Style spots and categories so that
 * all 20+ landmark cards show 100% localized titles and descriptions.
 */
export const STYLE_TRANSLATIONS: Record<
  string,
  Record<Language, { label: string; description: string }>
> = {
  // Extreme
  trolltunga: {
    ko: { label: "노르웨이 트롤퉁가", description: "700m 까마득한 절벽 끝에 앉은 아찔한 샷" },
    en: { label: "Norway Trolltunga", description: "Daring shot sitting on the 700m cliff abyss" },
    ja: { label: "ノルウェー トロルトゥンガ", description: "700mの断崖絶壁に座るスリル満点ショット" },
    zh: { label: "挪威 恶魔之舌", description: "坐在700米悬崖边缘的惊险绝景" },
    id: { label: "Trolltunga Norwegia", description: "Pose dramatis di ujung tebing setinggi 700 meter" },
  },
  devils_pool: {
    ko: { label: "잠비아 데빌스 풀", description: "빅토리아 폭포 108m 낭떠러지 바로 앞 샷" },
    en: { label: "Zambia Devil's Pool", description: "Directly perched on Victoria Falls 108m plunge" },
    ja: { label: "ザンビア デビルズプール", description: "ビクトリアの滝108mの絶壁際でのショット" },
    zh: { label: "赞比亚 魔鬼池", description: "维多利亚瀑布108米悬崖边缘的震撼大片" },
    id: { label: "Devil's Pool Zambia", description: "Berdiam di bibir air terjun Victoria setinggi 108m" },
  },
  kjeragbolten: {
    ko: { label: "노르웨이 셰라그볼텐", description: "1,000m 공중에 낀 바위 위 아찔한 포즈" },
    en: { label: "Norway Kjeragbolten", description: "Perched atop the boulder wedged 1,000m in air" },
    ja: { label: "ノルウェー シェーラグボルテン", description: "1,000mの空中に挟まれた巨石上のポーズ" },
    zh: { label: "挪威 谢拉格伯顿石", description: "站在悬空千米夹缝巨石上的奇迹一刻" },
    id: { label: "Kjeragbolten Norwegia", description: "Berdiri di atas batu terapung di ketinggian 1.000m" },
  },
  huashan_plank: {
    ko: { label: "중국 화산 장한로", description: "깎아지른 절벽 좁은 나무 판자 길 건너기" },
    en: { label: "China Huashan Plank Walk", description: "Walking on the narrow wooden cliffside planks" },
    ja: { label: "中国 華山 長空桟道", description: "切り立つ断崖の細い木の板の道を歩くスリル" },
    zh: { label: "中国 华山长空栈道", description: "行走在万丈悬崖木栈道上的极限大片" },
    id: { label: "Huashan Plank Walk China", description: "Melintasi papan kayu sempit di tepi tebing curam" },
  },
  pedra_telegrafo: {
    ko: { label: "브라질 페드라 두 테드가포", description: "절벽에 매달려 있는 유명 착시 아찔 샷" },
    en: { label: "Brazil Pedra do Telégrafo", description: "Famous illusion hanging from the cliff peak" },
    ja: { label: "ブラジル ペドラ・ド・テレグラフォ", description: "崖からぶら下がる有名な目の錯覚ショット" },
    zh: { label: "巴西 电报石", description: "悬空悬崖错觉下的经典网红极限大片" },
    id: { label: "Pedra do Telégrafo Brasil", description: "Ilusi menggantung di ujung tebing dengan pemandangan laut" },
  },
  death_road: {
    ko: { label: "볼리비아 융가스 데스로드", description: "낭떠러지 산악자전거 도로 끝자락 포즈" },
    en: { label: "Bolivia Yungas Death Road", description: "Cliff-edge pose along the misty mountain pass" },
    ja: { label: "ボリビア デスロード", description: "霧深い断崖絶壁のマウンテンバイクロード" },
    zh: { label: "玻利维亚 永加斯死神之路", description: "站在险峻悬崖道路边缘的探险大片" },
    id: { label: "Death Road Bolivia", description: "Pose di tepi jalur tebing berkabut yang menantang" },
  },
  yasur_volcano: {
    ko: { label: "바누아투 야수르 활화산", description: "붉은 용암과 연기가 분출하는 활화산 입구" },
    en: { label: "Vanuatu Mt. Yasur Volcano", description: "Glowing red lava and smoke at active crater" },
    ja: { label: "バヌアツ ヤスール活火山", description: "赤い溶岩と煙が噴き出す活火山口" },
    zh: { label: "瓦努阿图 亚苏尔活火山", description: "火红岩浆与烟雾喷发的活火山口绝景" },
    id: { label: "Gunung Berapi Yasur Vanuatu", description: "Lava merah menyala dan kepulan asap kawah aktif" },
  },
  trift_bridge: {
    ko: { label: "스위스 트리프트 현수교", description: "알프스 산맥 100m 골짜기 위 아찔 현수교" },
    en: { label: "Swiss Trift Suspension Bridge", description: "100m high suspension bridge above Alps valley" },
    ja: { label: "スイス トリフト吊り橋", description: "アルプス山脈100mの谷に架かるスリル吊り橋" },
    zh: { label: "瑞士 特里夫特吊桥", description: "悬挂在阿尔卑斯山脉百米深谷之上的吊桥" },
    id: { label: "Jembatan Gantung Trift Swiss", description: "Jembatan gantung setinggi 100m di atas lembah Alpen" },
  },
  rooftopping: {
    ko: { label: "마천루 루프탑", description: "초고층 빌딩 난간 아찔 야경 화보" },
    en: { label: "Skyscraper Rooftopping", description: "Edge-of-the-roof shot with sparkling city skyline" },
    ja: { label: "摩天楼 ルーフトップ", description: "超高層ビルの屋上から見下ろすきらめく夜景" },
    zh: { label: "摩天大楼 天台极限", description: "站在摩天大楼边缘俯瞰璀璨都市夜景" },
    id: { label: "Rooftop Pencakar Langit", description: "Foto di tepi gedung pencakar langit dengan pemandangan kota" },
  },
  jacobs_well: {
    ko: { label: "미국 자콥스 웰", description: "깊은 수중 동굴 수영장 구멍 다이빙 샷" },
    en: { label: "USA Jacob's Well", description: "Deep submerged artesian spring abyss plunge" },
    ja: { label: "米 ヤコブの井戸", description: "神秘的な水中洞窟ダイビングショット" },
    zh: { label: "美国 雅各井", description: "俯瞰深不见底的天然水下洞穴跳水绝景" },
    id: { label: "Jacob's Well Amerika", description: "Menyelam di atas lubang mata air alami yang dalam" },
  },
  devils_tears: {
    ko: { label: "누사 렘봉안 데빌스 티어스", description: "거대 파도가 몰아치는 절벽 낭떠러지 샷" },
    en: { label: "Bali Devil's Tears", description: "Dramatic ocean spray crash over rugged cliffs" },
    ja: { label: "バリ デビルズティアーズ", description: "巨大な波が打ち寄せる断崖絶壁ショット" },
    zh: { label: "巴厘岛 恶魔的眼泪", description: "巨浪拍击黑礁石悬崖的壮观水雾大片" },
    id: { label: "Devil's Tears Lembongan", description: "Hempasan ombak dahsyat di tebing karang Nusa Lembongan" },
  },
  bromo: {
    ko: { label: "동자바 브로모 화산", description: "유황 연기가 분출하는 활화산 능선 샷" },
    en: { label: "East Java Mt. Bromo", description: "Active crater caldera ridge with rising sulfur mist" },
    ja: { label: "ブロモ山 カルデラ", description: "白い煙が立ち上る活火山の稜線ショット" },
    zh: { label: "爪哇 布罗莫火山", description: "站在冒着白烟的活火山火山口脊线绝景" },
    id: { label: "Gunung Bromo Jawa Timur", description: "Pemandangan kawah aktif berselimut kabut belerang eksotis" },
  },
  ijen: {
    ko: { label: "동자바 이젠 화산 블루파이어", description: "신비로운 푸른 유황 불꽃과 산성 호수 샷" },
    en: { label: "East Java Ijen Crater", description: "Mystic blue fire flames & turquoise acid lake" },
    ja: { label: "イジェン火山 ブルーファイア", description: "青い炎とエメラルドグリーンの酸性湖" },
    zh: { label: "宜珍火山 蓝火秘境", description: "暗夜中神秘幽蓝硫磺烈焰与绿松石酸性湖" },
    id: { label: "Kawah Ijen Blue Fire", description: "Api biru magis dan danau kawah asam berwarna toska" },
  },
  tumpak_sewu: {
    ko: { label: "동자바 툼팍세우 폭포", description: "120m 거대 폭포 병풍 협곡 장관 샷" },
    en: { label: "Tumpak Sewu Waterfall", description: "120m thousand-waterfall tiered canyon panorama" },
    ja: { label: "トゥンパクセウ滝", description: "120mの巨大なカーテン状の千の滝" },
    zh: { label: "赛武千层瀑布", description: "120米高万马奔腾千层水帘峡谷大片" },
    id: { label: "Air Terjun Tumpak Sewu", description: "Tirai air terjun raksasa 120 meter di lembah megah" },
  },
  jomblang: {
    ko: { label: "족자카르타 좀블랑 동굴", description: "60m 싱크홀 수직 동굴 천상의 빛 샷" },
    en: { label: "Jomblang Cave Light", description: "Heavenly light beam descending into 60m vertical sinkhole" },
    ja: { label: "ゾンブラン洞窟 天使の光", description: "60mの縦穴洞窟に差し込む天上の光線" },
    zh: { label: "中爪哇 宗布朗天坑", description: "60米地下溶洞天坑洒下的天国神圣光束" },
    id: { label: "Gua Jomblang Yogyakarta", description: "Sorotan cahaya surga megah menembus gua vertikal 60m" },
  },
  timang: {
    ko: { label: "족자카르타 티망 비치 곤돌라", description: "거센 파도 위 목재 로프 곤돌라 아찔 샷" },
    en: { label: "Timang Beach Gondola", description: "Ocean cable gondola crossing roaring ocean waves" },
    ja: { label: "ティマンビーチ ゴンドラ", description: "荒波の上を渡る手動木製ゴンドラスリル" },
    zh: { label: "日惹 提芒海滩木缆车", description: "悬空穿梭于怒涛狂浪之上的惊险木质缆车" },
    id: { label: "Pantai Timang Gondola", description: "Gondola kayu tradisional meluncur di atas deburan ombak samudra" },
  },
  rinjani: {
    ko: { label: "롬복 린자니 화산 능선", description: "2,700m 분화구 칼데라 호수 칼날 능선" },
    en: { label: "Lombok Mt. Rinjani", description: "Knife-edge crater ridge over Segara Anak caldera lake" },
    ja: { label: "リンジャニ山 カルデラ湖", description: "標高2,700mのカルデラ湖を望む稜線" },
    zh: { label: "龙目岛 林贾尼火山", description: "海拔2700米火山刀锋山脊俯瞰火口圣湖" },
    id: { label: "Gunung Rinjani Lombok", description: "Punggung bukit tajam menghadap danau kawah Segara Anak" },
  },
  sipiso_piso: {
    ko: { label: "북수마트라 시피소피소 폭포", description: "토바 호수 근처 120m 수직 절벽 폭포 샷" },
    en: { label: "Sipiso-Piso Waterfall", description: "120m plunge waterfall overlooking volcanic Lake Toba" },
    ja: { label: "シピソピソの滝", description: "トバ湖近くの120m垂直落下の巨大滝" },
    zh: { label: "多巴湖 西比索比索瀑布", description: "多巴湖畔120米直泻而下的飞天悬崖瀑布" },
    id: { label: "Air Terjun Sipiso-Piso", description: "Air terjun vertikal setinggi 120 meter di tepi Danau Toba" },
  },
  wanagiri: {
    ko: { label: "발리 와나기리 히든힐스", description: "호수 절벽 허공 위의 나무 둥지 포토존" },
    en: { label: "Bali Wanagiri Hidden Hills", description: "Cliff-edge bird nest viewpoint over Buyan Lake" },
    ja: { label: "ワナギリ ヒドゥンヒルズ", description: "湖を見下ろす鳥の巣フォトスポット" },
    zh: { label: "巴厘岛 瓦纳吉里鸟巢", description: "悬浮在双子湖绝壁之上的巨型编织鸟巢" },
    id: { label: "Wanagiri Hidden Hills Bali", description: "Spot foto sarang burung ikonik di atas Danau Buyan" },
  },

  // Studio & ID photo styles
  corporate: {
    ko: { label: "비즈니스 정장", description: "신뢰감을 주는 프리미엄 네이비 수트 화보" },
    en: { label: "Corporate Business Suit", description: "Professional executive suit portrait" },
    ja: { label: "ビジネススーツ", description: "信頼感を与えるエグゼクティブスーツ写真" },
    zh: { label: "商务正装写真", description: "专业干练的职场精英商务肖像大片" },
    id: { label: "Jas Bisnis Eksekutif", description: "Potret profesional jas bisnis berkualitas tinggi" },
  },
  business_suit: {
    ko: { label: "비즈니스 수트", description: "링크드인 & 사원증용 단정한 클래식 정장" },
    en: { label: "Executive Suit Profile", description: "Tailored suit headshot for LinkedIn & CV" },
    ja: { label: "エグゼクティブスーツ", description: "LinkedInや履歴書に最適な洗練されたスーツ" },
    zh: { label: "高管西装头像", description: "适合领英、简历与职场工牌的典雅西装照" },
    id: { label: "Profil Jas Formal", description: "Foto profil jas elegan untuk LinkedIn & CV" },
  },
  business: {
    ko: { label: "프로페셔널 프로필", description: "CEO & 전문가를 위한 현대적인 수트 룩" },
    en: { label: "Professional Profile", description: "Modern editorial profile for founders & leaders" },
    ja: { label: "プロフェッショナル", description: "リーダーのためのモダンなエディトリアル写真" },
    zh: { label: "专业商务领袖", description: "现代高管与专业人士的高定商务形象照" },
    id: { label: "Profil Profesional", description: "Gaya modern jas bisnis untuk profesional & founder" },
  },
  studio: {
    ko: { label: "모던 스튜디오", description: "부드러운 조명의 프리미엄 인물 프로필" },
    en: { label: "Modern Studio Portrait", description: "Soft lighting luxury studio headshot" },
    ja: { label: "スタジオポートレート", description: "柔らかいライティングの高級スタジオ写真" },
    zh: { label: "摩登影棚肖像", description: "柔和高级光影质感的棚拍人像写真" },
    id: { label: "Potret Studio Modern", description: "Pencahayaan studio lembut untuk foto profil elegan" },
  },
  id_photo: {
    ko: { label: "표준 증명사진", description: "단정하고 깔끔한 규격 증명/신분증 화보" },
    en: { label: "Standard ID Photo", description: "Clean standardized headshot for official cards" },
    ja: { label: "標準証明写真", description: "清潔感のある公式身分証・履歴書写真" },
    zh: { label: "标准证件照", description: "规范端庄的官方证件与通用规格照" },
    id: { label: "Pasfoto Standar", description: "Pasfoto rapi dan formal sesuai standar resmi" },
  },
  passport: {
    ko: { label: "여권 규격 사진", description: "화사하면서도 단정한 글로벌 여권/비자 규격" },
    en: { label: "Passport & Visa Photo", description: "Official compliant passport & travel visa photo" },
    ja: { label: "パスポート・ビザ写真", description: "国際規格に準拠したパスポート写真" },
    zh: { label: "护照与签证照", description: "符合国际出入境规范的高清护照签证照" },
    id: { label: "Foto Paspor & Visa", description: "Sesuai standar resmi paspor dan visa internasional" },
  },
  student: {
    ko: { label: "학생증 / 단정 프로필", description: "풋풋하고 자연스러운 화이트 셔츠 룩" },
    en: { label: "Student & Campus Profile", description: "Natural neat casual look for campus IDs" },
    ja: { label: "学生証・キャンパス", description: "爽やかで自然なホワイトシャツスタイル" },
    zh: { label: "学生证与校园肖像", description: "清爽自然的白衬衫校园青春写真" },
    id: { label: "Foto Kartu Pelajar", description: "Tampilan rapi dan segar untuk kartu mahasiswa / pelajar" },
  },
  astronaut: {
    ko: { label: "우주비행사 스튜디오", description: "은하수 우주복을 입은 SF 컨셉 화보" },
    en: { label: "Astronaut in Cosmos", description: "Sci-Fi spacesuit editorial with nebula galaxy" },
    ja: { label: "宇宙飛行士コンセプト", description: "銀河を背景にした本格宇宙服ショット" },
    zh: { label: "星际宇航员写真", description: "身着高科技宇航服漫游浩瀚星河大片" },
    id: { label: "Kosmonot Luar Angkasa", description: "Konsep pakaian astronot fiksi ilmiah berlatar galaksi" },
  },
  van_gogh: {
    ko: { label: "반 고흐 유화 화보", description: "별이 빛나는 밤 스타일의 명작 초상화" },
    en: { label: "Van Gogh Oil Painting", description: "Masterpiece oil portrait in Starry Night style" },
    ja: { label: "ゴッホ油絵風ポートレート", description: "星月夜のような美しい油絵アート写真" },
    zh: { label: "梵高星空油画风", description: "经典星月夜笔触的艺术名画肖像大片" },
    id: { label: "Lukisan Minyak Van Gogh", description: "Potret artistik bergaya lukisan Starry Night" },
  },
  yearbook: {
    ko: { label: "90s 미국 이어북", description: "레트로 빈티지 감성의 졸업앨범 포토" },
    en: { label: "90s Retro Yearbook", description: "Vintage nostalgic high-school yearbook photo" },
    ja: { label: "90s アメリカンイヤーブック", description: "レトロな卒業アルバム風ビンテージ写真" },
    zh: { label: "90年代美式复古年鉴", description: "复古怀旧美式高中毕业纪念册写真" },
    id: { label: "Yearbook Amerika 90-an", description: "Foto album kelulusan vintage bernuansa nostalgia 90-an" },
  },
  sherlock: {
    ko: { label: "셜록 홈즈 탐정 룩", description: "베이커가 런던 무드의 클래식 코트 화보" },
    en: { label: "Sherlock Detective", description: "Classic British vintage coat in foggy London" },
    ja: { label: "シャーロック・ホームズ", description: "霧のロンドンを思わせる英国紳士探偵ルック" },
    zh: { label: "夏洛克英伦侦探", description: "雾都伦敦贝克街风情的经典英伦大衣写真" },
    id: { label: "Detektif Sherlock", description: "Gaya mantel klasik detektif Inggris di London" },
  },
  idol: {
    ko: { label: "K-POP 아이돌", description: "무대 조명과 반짝이는 글리터 무드 화보" },
    en: { label: "K-POP Idol Stage", description: "Vibrant stage lighting and glowing idol aura" },
    ja: { label: "K-POP アイドル", description: "華やかなステージライトと輝くアイドルグラビア" },
    zh: { label: "K-POP 偶像舞台", description: "璀璨舞台光效与闪耀爱豆气场的画报大片" },
    id: { label: "Idola Panggung K-POP", description: "Tata cahaya panggung spektakuler bergaya bintang K-POP" },
  },
  kdrama: {
    ko: { label: "드라마 주인공", description: "감성적인 가을 햇살 아래 영화 같은 스틸컷" },
    en: { label: "Drama Lead Hero", description: "Cinematic film still with warm sentimental lighting" },
    ja: { label: "ドラマ主人公", description: "映画のワンシーンのようなシネマティック写真" },
    zh: { label: "韩剧主角画报", description: "秋日暖阳下的唯美电影剧照质感写真" },
    id: { label: "Pemeran Utama Drama", description: "Potret sinematik film dengan nuansa hangat penuh emosi" },
  },
  magazine: {
    ko: { label: "패션 매거진 커버", description: "하이패션 브랜드 런웨이 모델 감성" },
    en: { label: "Vogue Magazine Cover", description: "High-fashion luxury editorial model cover" },
    ja: { label: "ファッション誌カバー", description: "ハイブランドのランウェイモデルのようなグラビア" },
    zh: { label: "时尚杂志封面", description: "顶级奢侈品大牌高级时装封面大片" },
    id: { label: "Sampul Majalah Fashion", description: "Gaya sampul majalah mode mewah kelas atas" },
  },
  noir: {
    ko: { label: "시네마틱 흑백 느와르", description: "깊은 음영과 드라마틱한 분위기의 명작" },
    en: { label: "Cinematic Film Noir", description: "Dramatic contrast black & white classic portrait" },
    ja: { label: "モノクロ フィルムノワール", description: "深いコントラストの重厚なモノクロ写真" },
    zh: { label: "黑白电影胶片风", description: "强烈光影对比与复古胶片颗粒感的黑白肖像" },
    id: { label: "Sinematik Film Noir", description: "Kontras dramatis foto hitam putih klasik artistik" },
  },
  cartoon: {
    ko: { label: "3D 디즈니 애니메이션", description: "픽사 애니메이션 주인공 스타일의 귀여운 3D 캐릭터" },
    en: { label: "3D Pixar Animation", description: "Cute 3D animated character portrait with Pixar styling" },
    ja: { label: "3D アニメキャラクター", description: "ピクサー映画の主人公のような可愛い3Dキャラ写真" },
    zh: { label: "3D 皮克斯动画风", description: "迪士尼皮克斯动画主角般的精致3D动漫人像" },
    id: { label: "Animasi 3D Pixar", description: "Potret karakter animasi 3D lucu bergaya film Pixar" },
  },
  kelingking: {
    ko: { label: "발리 클링킹 비치", description: "티라노사우루스 절벽과 에메랄드 바다" },
    en: { label: "Bali Kelingking Beach", description: "T-Rex cliff viewpoint over emerald ocean waves" },
    ja: { label: "バリ島 クリンキンビーチ", description: "T-Rex型の断崖絶壁とエメラルドの海" },
    zh: { label: "巴厘岛 精灵坠崖海滩", description: "站在恐龙形巨崖上眺望蓝绿色海浪" },
    id: { label: "Pantai Kelingking Bali", description: "Tebing bentuk T-Rex dengan pemandangan laut toska" },
  },
  bali_swing: {
    ko: { label: "발리 발리스윙", description: "울창한 열대 정글 위를 가르는 로맨틱 스윙" },
    en: { label: "Bali Jungle Swing", description: "Romantic swing soaring over lush tropical rainforest" },
    ja: { label: "バリ島 ジャングルスイング", description: "熱帯雨林の上を舞うロマンチックスイング" },
    zh: { label: "巴厘岛 丛林秋千", description: "高空飞越郁郁葱葱的热带雨林秋千大片" },
    id: { label: "Bali Jungle Swing", description: "Ayunan romantis melayang di atas hutan tropis yang hijau" },
  },
  borobudur: {
    ko: { label: "족자카르타 보로부두르", description: "신비로운 불교 사원과 안개 낀 일출" },
    en: { label: "Yogyakarta Borobudur", description: "Mystic ancient temple during golden mist sunrise" },
    ja: { label: "ボロブドゥール寺院", description: "神秘的な仏教遺跡と朝霧のサンライズ" },
    zh: { label: "日惹 婆罗浮屠", description: "金色晨雾中古老神圣佛塔的庄严日出" },
    id: { label: "Borobudur Yogyakarta", description: "Candi megah bersejarah di tengah kabut matahari terbit" },
  },
  paris: {
    ko: { label: "파리 에펠탑", description: "에펠탑이 한눈에 보이는 센강변 로맨틱 화보" },
    en: { label: "Paris Eiffel Tower", description: "Romantic portrait overlooking Eiffel Tower & Seine River" },
    ja: { label: "パリ エッフェル塔", description: "セーヌ川とエッフェル塔を望むロマンチックなポートレート" },
    zh: { label: "巴黎 埃菲尔铁塔", description: "塞纳河畔俯瞰埃菲尔铁塔的浪漫大片" },
    id: { label: "Menara Eiffel Paris", description: "Potret romantis dengan latar Menara Eiffel dan Sungai Seine" },
  },
  santorini: {
    ko: { label: "산토리니 이아 마을", description: "푸른 돔 지붕과 눈부신 에게해 노을" },
    en: { label: "Santorini Oia Village", description: "Blue dome churches with Aegean Sea sunset glow" },
    ja: { label: "サントリーニ イア村", description: "青いドーム屋根とエーゲ海の美しい夕焼け" },
    zh: { label: "圣托里尼 伊亚小镇", description: "蓝顶白墙教堂与爱琴海壮丽夕阳" },
    id: { label: "Santorini Oia Yunani", description: "Kubah biru dan pemandangan matahari terbenam Laut Aegea" },
  },
};

/** Helper to generate clean title case from style ID (e.g. 'machu_picchu' -> 'Machu Picchu') */
function formatStyleIdToEnglishTitle(styleId: string): string {
  return styleId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/** Helper to retrieve translated style label and description with 100% Zero-Korean Fallback Guarantee */
export function getTranslatedStyleInfo(
  styleId: string,
  defaultLabel: string,
  defaultDesc: string,
  lang: Language
): { label: string; description: string } {
  const trans = STYLE_TRANSLATIONS[styleId];
  if (trans && trans[lang]) {
    return trans[lang];
  }
  if (trans && trans.en) {
    return trans.en;
  }

  // If Korean language user, use default label and description
  if (lang === "ko") {
    return { label: defaultLabel, description: defaultDesc };
  }

  // For international users (en, ja, zh, id), ensure NO Korean text ever leaks
  const hasKoreanChars = /[\u3131-\uD79D]/.test(defaultLabel);
  const safeLabel = hasKoreanChars ? formatStyleIdToEnglishTitle(styleId) : defaultLabel;
  const safeDesc = hasKoreanChars
    ? "Stunning photo composite with realistic lighting and seamless scene integration."
    : defaultDesc;

  return { label: safeLabel, description: safeDesc };
}

/**
 * Standard React Hook for all present and future components.
 * Automatically synchronizes with user device & language.
 */
import { useEffect, useState } from "react";

export function useI18n() {
  const [state, setState] = useState<{ lang: Language; isMobile: boolean }>({
    lang: "en",
    isMobile: false,
  });

  useEffect(() => {
    setState(detectUserDeviceAndLang());
  }, []);

  const t = TRANSLATIONS[state.lang] || TRANSLATIONS.en;

  const getStyle = (styleId: string, defaultLabel: string, defaultDesc: string) => {
    return getTranslatedStyleInfo(styleId, defaultLabel, defaultDesc, state.lang);
  };

  return {
    lang: state.lang,
    isMobile: state.isMobile,
    t,
    getStyle,
  };
}
