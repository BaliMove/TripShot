import { Language, TRANSLATIONS, STYLE_TRANSLATIONS } from "./i18n";

/**
 * Invisible Background Translation Dictionary.
 * Maps Korean words, phrases, and UI elements to all 5 supported languages.
 */
export const PHRASE_DICTIONARY: Record<string, Record<Language, string>> = {
  // Navigation & Common Actions
  "로그인": { ko: "로그인", en: "Sign In", ja: "ログイン", zh: "登录", id: "Masuk" },
  "로그아웃": { ko: "로그아웃", en: "Sign Out", ja: "ログアウト", zh: "退出登录", id: "Keluar" },
  "회원가입": { ko: "회원가입", en: "Sign Up", ja: "新規登録", zh: "注册", id: "Daftar" },
  "내 계정": { ko: "내 계정", en: "My Account", ja: "マイアカウント", zh: "我的账户", id: "Akun Saya" },
  "홈": { ko: "홈", en: "Home", ja: "ホーム", zh: "首页", id: "Beranda" },
  "명소": { ko: "명소", en: "Destinations", ja: "人気スポット", zh: "名胜景点", id: "Destinasi" },
  "명소 둘러보기": { ko: "명소 둘러보기", en: "Explore Destinations", ja: "スポット一覧", zh: "探索景点", id: "Jelajahi Destinasi" },
  "왜 트립샷인가?": { ko: "왜 트립샷인가?", en: "Why TripShot?", ja: "TripShotとは？", zh: "为什么选择TripShot？", id: "Mengapa TripShot?" },
  "이용 방법": { ko: "이용 방법", en: "How It Works", ja: "ご利用手順", zh: "使用指南", id: "Cara Penggunaan" },
  "요금제": { ko: "요금제", en: "Pricing Plans", ja: "料金プラン", zh: "价格方案", id: "Paket Harga" },
  "쿠폰 등록": { ko: "쿠폰 등록", en: "Redeem Coupon", ja: "クーポン登録", zh: "兑换优惠券", id: "Klaim Kupon" },
  "쿠폰": { ko: "쿠폰", en: "Coupon", ja: "クーポン", zh: "优惠券", id: "Kupon" },
  "플랜": { ko: "플랜", en: "Plan", ja: "プラン", zh: "方案", id: "Paket" },
  "변경": { ko: "변경", en: "Change", ja: "変更", zh: "更改", id: "Ubah" },
  "저장": { ko: "저장", en: "Save", ja: "保存", zh: "保存", id: "Simpan" },
  "삭제": { ko: "삭제", en: "Delete", ja: "削除", zh: "删除", id: "Hapus" },
  "닫기": { ko: "닫기", en: "Close", ja: "閉じる", zh: "关闭", id: "Tutup" },
  "취소": { ko: "취소", en: "Cancel", ja: "キャンセル", zh: "取消", id: "Batal" },
  "확인": { ko: "확인", en: "Confirm", ja: "確認", zh: "确认", id: "Konfirmasi" },
  "복사": { ko: "복사", en: "Copy", ja: "コピー", zh: "复制", id: "Salin" },
  "공유": { ko: "공유", en: "Share", ja: "共有", zh: "分享", id: "Bagikan" },
  "공유하기": { ko: "공유하기", en: "Share Now", ja: "共有する", zh: "立即分享", id: "Bagikan Sekarang" },
  "다운로드": { ko: "다운로드", en: "Download", ja: "ダウンロード", zh: "下载", id: "Unduh" },
  "고화질 다운로드": { ko: "고화질 다운로드", en: "HD Download", ja: "高画質ダウンロード", zh: "高清下载", id: "Unduh Kualitas Tinggi" },
  "전체화면": { ko: "전체화면", en: "Full Screen", ja: "全画面", zh: "全屏", id: "Layar Penuh" },
  "다시 생성": { ko: "다시 생성", en: "Regenerate", ja: "再生成", zh: "重新生成", id: "Buat Ulang" },
  "새로고침": { ko: "새로고침", en: "Refresh", ja: "更新", zh: "刷新", id: "Segarkan" },
  "시작하기": { ko: "시작하기", en: "Get Started", ja: "始める", zh: "立即开始", id: "Mulai" },
  "무료 체험": { ko: "무료 체험", en: "Free Trial", ja: "無料体験", zh: "免费试用", id: "Uji Coba Gratis" },
  "무료": { ko: "무료", en: "Free", ja: "無料", zh: "免费", id: "Gratis" },
  "인기": { ko: "인기", en: "Popular", ja: "人気", zh: "热门", id: "Populer" },
  "추천": { ko: "추천", en: "Recommended", ja: "おすすめ", zh: "推荐", id: "Rekomendasi" },
  "신규": { ko: "신규", en: "New", ja: "新着", zh: "新品", id: "Baru" },

  // Generation & Upload
  "생성하기": { ko: "생성하기", en: "Generate Now", ja: "生成する", zh: "立即生成", id: "Hasilkan Sekarang" },
  "AI 화보 생성": { ko: "AI 화보 생성", en: "Generate AI Photo", ja: "AI写真生成", zh: "生成AI写真", id: "Buat Foto AI" },
  "AI 화보 3초 만에 생성하기": { ko: "AI 화보 3초 만에 생성하기", en: "Generate AI Photo in 10s", ja: "10秒でAI写真を生成", zh: "10秒生成AI大片", id: "Hasilkan Foto AI dalam 10 Detik" },
  "내 화보 만들기": { ko: "내 화보 만들기", en: "Create My AI Shot", ja: "写真を作成する", zh: "制作我的写真", id: "Buat Foto Saya" },
  "내 인생샷 만들기": { ko: "내 인생샷 만들기", en: "Create My Dream Shot", ja: "最高の写真を作成", zh: "制作精彩大片", id: "Buat Foto Impian" },
  "사진 업로드": { ko: "사진 업로드", en: "Upload Photo", ja: "写真をアップロード", zh: "上传照片", id: "Unggah Foto" },
  "얼굴 셀카/인물 사진 업로드": { ko: "얼굴 셀카/인물 사진 업로드", en: "Click to upload or drag & drop photo", ja: "自撮り・顔写真をアップロード", zh: "点击上传自拍人像照片", id: "Klik untuk unggah foto selfie" },
  "이목구비가 또렷한 상반신 사진 권장 (최대 10MB)": { ko: "이목구비가 또렷한 상반신 사진 권장 (최대 10MB)", en: "Supports solo selfies, couples, and group photos (Max 10MB)", ja: "上半身の鮮明な写真を推奨（最大10MB）", zh: "建议使用五官清晰的半身照片（最大10MB）", id: "Mendukung selfie, pasangan, dan foto grup (Maks 10MB)" },
  "얼굴 사진 올리기": { ko: "얼굴 사진 올리기", en: "Upload Face Selfie", ja: "顔写真をアップロード", zh: "上传人脸照片", id: "Unggah Foto Wajah" },
  "사진 변경": { ko: "사진 변경", en: "Change Photo", ja: "写真を変更", zh: "更换照片", id: "Ganti Foto" },
  "다른 사진으로 변경": { ko: "다른 사진으로 변경", en: "Change to Another Photo", ja: "別の写真に変更", zh: "更换其他照片", id: "Ganti dengan Foto Lain" },
  "새 사진으로 업로드 시작": { ko: "새 사진으로 업로드 시작", en: "Upload a New Photo", ja: "新しい写真をアップロード", zh: "上传新照片", id: "Unggah Foto Baru" },
  "같은 사진으로 다른 스타일 만들기": { ko: "같은 사진으로 다른 스타일 만들기", en: "Try Another Style with Same Photo", ja: "同じ写真で別のスタイルを作成", zh: "用同一张照片尝试其他风格", id: "Coba Gaya Lain dengan Foto Sama" },
  "명소 템플릿 선택": { ko: "명소 템플릿 선택", en: "Select Landmark Style", ja: "名所テンプレート選択", zh: "选择名胜模板", id: "Pilih Templat Destinasi" },
  "내 배경 사진 올리기": { ko: "내 배경 사진 올리기", en: "Upload Custom Backdrop", ja: "背景写真をアップロード", zh: "上传自定义背景", id: "Unggah Latar Belakang Kustom" },
  "무작위 명소 고르기": { ko: "무작위 명소 고르기", en: "Pick Random Spot", ja: "ランダム選択", zh: "随机挑选景点", id: "Pilih Destinasi Acak" },
  "마법보정": { ko: "마법보정", en: "AI Magic", ja: "AI補正", zh: "魔法优化", id: "Magis AI" },

  // Categories
  "익스트림 스릴": { ko: "익스트림 스릴", en: "Extreme Thrill", ja: "エクストリーム", zh: "极限刺激", id: "Sensasi Ekstrem" },
  "세계 여행": { ko: "세계 여행", en: "Global Travel", ja: "世界旅行", zh: "环球旅行", id: "Wisata Dunia" },
  "비즈니스 수트": { ko: "비즈니스 수트", en: "Business Suit", ja: "ビジネススーツ", zh: "商务西装", id: "Jas Bisnis" },
  "증명/여권": { ko: "증명/여권", en: "ID / Passport", ja: "証明写真・パスポート", zh: "证件与护照", id: "Pasfoto & Paspor" },
  "이색 컨셉": { ko: "이색 컨셉", en: "Fun Concept", ja: "ユニークコンセプト", zh: "趣味特色概念", id: "Konsep Unik" },
  "자유 입력": { ko: "자유 입력", en: "Custom Prompt", ja: "カスタムプロンプト", zh: "自定义描述", id: "Perintah Kustom" },
  "스튜디오 단색 배경색 선택": { ko: "스튜디오 단색 배경색 선택", en: "Select Studio Backdrop Color", ja: "スタジオ背景色選択", zh: "选择影棚纯色背景", id: "Pilih Warna Latar Studio" },
  "화이트": { ko: "화이트", en: "Solid White", ja: "ホワイト", zh: "纯白", id: "Putih Polos" },
  "라이트 블루": { ko: "라이트 블루", en: "Light Blue", ja: "ライトブルー", zh: "浅蓝", id: "Biru Muda" },
  "그레이": { ko: "그레이", en: "Light Gray", ja: "グレー", zh: "浅灰", id: "Abu-abu Muda" },

  // Devices & Status
  "모바일": { ko: "모바일", en: "Mobile", ja: "モバイル", zh: "手机端", id: "Seluler" },
  "컴퓨터": { ko: "컴퓨터", en: "Desktop", ja: "パソコン", zh: "电脑端", id: "Komputer" },
  "로그인 시 모든 디바이스 동기화": { ko: "로그인 시 모든 디바이스 동기화", en: "Sync credits across devices on sign in", ja: "ログインですべての端末と同期", zh: "登录后多端实时同步点数", id: "Sinkronkan kredit di semua perangkat saat masuk" },
  "잔여 2회": { ko: "잔여 2회", en: "2 Free Trials", ja: "残り2回", zh: "剩余2次", id: "Sisa 2 Kali" },
  "잔여 10회": { ko: "잔여 10회", en: "10 Credits", ja: "残り10回", zh: "剩余10次", id: "Sisa 10 Kali" },
  "잔여 30회": { ko: "잔여 30회", en: "30 Credits", ja: "残り30回", zh: "剩余30次", id: "Sisa 30 Kali" },
  "잔여 100회": { ko: "잔여 100회", en: "100 Credits", ja: "残り100回", zh: "剩余100次", id: "Sisa 100 Kali" },
};

/**
 * Automatically translates a single Korean string or sentence to target language.
 */
export function autoTranslateText(text: string, lang: Language): string {
  if (!text || typeof text !== "string" || lang === "ko") return text;

  const trimmed = text.trim();
  if (!trimmed) return text;

  // 1. Direct match from phrase dictionary
  if (PHRASE_DICTIONARY[trimmed] && PHRASE_DICTIONARY[trimmed][lang]) {
    return text.replace(trimmed, PHRASE_DICTIONARY[trimmed][lang]);
  }

  // 2. Direct match from style translations
  for (const styleId in STYLE_TRANSLATIONS) {
    const entry = STYLE_TRANSLATIONS[styleId];
    if (entry.ko.label === trimmed && entry[lang]) {
      return text.replace(trimmed, entry[lang].label);
    }
    if (entry.ko.description === trimmed && entry[lang]) {
      return text.replace(trimmed, entry[lang].description);
    }
  }

  // 3. Match from main TRANSLATIONS dictionary
  const koDict = TRANSLATIONS.ko as any;
  const targetDict = TRANSLATIONS[lang] as any;
  for (const key in koDict) {
    if (koDict[key] === trimmed && targetDict && targetDict[key]) {
      return text.replace(trimmed, targetDict[key]);
    }
  }

  // 4. Word-by-word intelligent replacement for remaining Korean phrases
  let translated = text;
  for (const [kr, trans] of Object.entries(PHRASE_DICTIONARY)) {
    if (translated.includes(kr) && trans[lang]) {
      translated = translated.split(kr).join(trans[lang]);
    }
  }

  return translated;
}
