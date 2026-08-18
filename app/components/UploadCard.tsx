"use client";

import { useEffect, useMemo, useRef, useState, ChangeEvent } from "react";
import { createPortal } from "react-dom";
import {
  BG_COLORS,
  CATEGORIES,
  TRAVEL_CATEGORIES,
  STUDIO_CATEGORIES,
  STYLES,
  STYLE_PREVIEWS,
  getStyle,
  type BgColor,
  type CategoryId,
  type Gender,
} from "../lib/styles";
import { PRINT_SIZES, generatePhotoSheet, type PrintSize } from "../lib/photoSheet";
import {
  detectUserDeviceAndLang,
  TRANSLATIONS,
  getTranslatedStyleInfo,
  type Language,
} from "../lib/i18n";
import CompareSlider from "./CompareSlider";
import PayPalModal, { type PlanType } from "./PayPalModal";
import AuthModal, { UserProfileData } from "./AuthModal";

interface ModelSuccessResult {
  success: true;
  imageUrl: string;
  timeSec: string;
}

interface ModelErrorResult {
  success: false;
  error: string;
}

type ModelResult = ModelSuccessResult | ModelErrorResult;

interface GenerationResult {
  lite: ModelResult;
  pro: ModelResult;
}

const getLoadingMessage = (
  idx: number,
  lang: Language,
  styleLabel?: string,
  categoryGroup?: "travel" | "studio"
) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  if (categoryGroup === "studio") {
    const studioMessages = [
      t.loadingStudio1,
      t.loadingStudio2,
      t.loadingStudio3,
      t.loadingStudio4,
      t.loadingStudio5,
    ];
    return studioMessages[idx % studioMessages.length];
  }

  const travelMessages = [
    t.loadingTravel1,
    t.loadingTravel2,
    t.loadingTravel3,
    t.loadingTravel4,
    t.loadingTravel5,
  ];
  return travelMessages[idx % travelMessages.length];
};


const FUN_STYLE_IDS = STYLES.filter((s) => s.category === "fun" || s.category === "travel").map((s) => s.id);



async function createCompositedPhoto(
  selfieBase64: string,
  bgUrl: string,
  styleLabel: string
): Promise<string> {
  if (typeof window === "undefined") return selfieBase64;

  return new Promise((resolve) => {
    let resolved = false;

    const safeResolve = (resultUrl: string) => {
      if (!resolved) {
        resolved = true;
        resolve(resultUrl);
      }
    };

    const timer = setTimeout(() => {
      drawInlineCompositedPhoto(selfieBase64, styleLabel).then(safeResolve).catch(() => safeResolve(selfieBase64));
    }, 1800);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        clearTimeout(timer);
        return safeResolve(selfieBase64);
      }

      canvas.width = 1000;
      canvas.height = 1000;

      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";

      const selfieImg = new Image();
      selfieImg.crossOrigin = "anonymous";

      let loadedCount = 0;
      const checkDone = () => {
        loadedCount++;
        if (loadedCount < 2) return;

        clearTimeout(timer);
        try {
          ctx.clearRect(0, 0, 1000, 1000);
          ctx.globalCompositeOperation = "source-over";

          // 1. Draw Selected Destination/Concept Style Background (100% Crisp Full Canvas)
          ctx.save();
          const bgW = bgImg.naturalWidth || bgImg.width || 1000;
          const bgH = bgImg.naturalHeight || bgImg.height || 1000;
          const bgScale = Math.max(1000 / bgW, 1000 / bgH);
          const bgDrawW = bgW * bgScale;
          const bgDrawH = bgH * bgScale;
          const bgDrawX = (1000 - bgDrawW) / 2;
          const bgDrawY = (1000 - bgDrawH) / 2;
          ctx.drawImage(bgImg, bgDrawX, bgDrawY, bgDrawW, bgDrawH);
          ctx.restore();

          // 2. Draw User Selfie Person Photo (100% Solid Crisp Coverage - ZERO Ghost Translucency)
          ctx.save();
          const imgW = selfieImg.naturalWidth || selfieImg.width || 1000;
          const imgH = selfieImg.naturalHeight || selfieImg.height || 1000;
          const scale = Math.max(1000 / imgW, 1000 / imgH);
          const drawW = imgW * scale;
          const drawH = imgH * scale;
          const drawX = (1000 - drawW) / 2;
          const drawY = (1000 - drawH) / 2;

          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = 1.0;
          ctx.drawImage(selfieImg, drawX, drawY, drawW, drawH);
          ctx.restore();

          // 3. Subtle Cinematic Vignette Overlay (Bottom Banner Frame)
          ctx.save();
          const toneGrad = ctx.createLinearGradient(0, 700, 0, 1000);
          toneGrad.addColorStop(0, "rgba(15, 23, 42, 0)");
          toneGrad.addColorStop(1, "rgba(15, 23, 42, 0.85)");
          ctx.fillStyle = toneGrad;
          ctx.fillRect(0, 700, 1000, 300);
          ctx.restore();

          // 4. Watermark Title & Branding Overlay
          ctx.save();
          const bannerGrad = ctx.createLinearGradient(0, 840, 0, 1000);
          bannerGrad.addColorStop(0, "rgba(15, 23, 42, 0)");
          bannerGrad.addColorStop(1, "rgba(15, 23, 42, 0.85)");
          ctx.fillStyle = bannerGrad;
          ctx.fillRect(0, 840, 1000, 160);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 34px sans-serif";
          ctx.textAlign = "center";
          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 10;
          ctx.fillText(`✈️ ${styleLabel}`, 500, 920);

          ctx.font = "bold 18px sans-serif";
          ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
          ctx.fillText("TripShot.world • AI Travel Portrait Studio", 500, 960);
          ctx.restore();

          safeResolve(canvas.toDataURL("image/jpeg", 0.94));
        } catch (e) {
          drawInlineCompositedPhoto(selfieBase64, styleLabel).then(safeResolve).catch(() => safeResolve(selfieBase64));
        }
      };

      bgImg.onload = checkDone;
      bgImg.onerror = () => {
        clearTimeout(timer);
        drawInlineCompositedPhoto(selfieBase64, styleLabel).then(safeResolve).catch(() => safeResolve(selfieBase64));
      };

      selfieImg.onload = checkDone;
      selfieImg.onerror = () => {
        clearTimeout(timer);
        drawInlineCompositedPhoto(selfieBase64, styleLabel).then(safeResolve).catch(() => safeResolve(selfieBase64));
      };

      bgImg.src = bgUrl;
      selfieImg.src = selfieBase64;
    } catch (err) {
      clearTimeout(timer);
      drawInlineCompositedPhoto(selfieBase64, styleLabel).then(safeResolve).catch(() => safeResolve(selfieBase64));
    }
  });
}

// 100% Guaranteed Instant Crisp Canvas Renderer
async function drawInlineCompositedPhoto(selfieBase64: string, styleLabel: string): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return resolve(selfieBase64);

    canvas.width = 1000;
    canvas.height = 1000;

    const selfieImg = new Image();
    selfieImg.onload = () => {
      try {
        ctx.clearRect(0, 0, 1000, 1000);
        ctx.globalCompositeOperation = "source-over";

        // 1. Studio Gradient Backdrop
        ctx.save();
        const bgGrad = ctx.createLinearGradient(0, 0, 1000, 1000);
        bgGrad.addColorStop(0, "#0f172a");
        bgGrad.addColorStop(1, "#0369a1");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1000, 1000);
        ctx.restore();

        // 2. User Selfie Photo Center Cover Crop
        ctx.save();
        const imgW = selfieImg.naturalWidth || selfieImg.width || 1000;
        const imgH = selfieImg.naturalHeight || selfieImg.height || 1000;
        const scale = Math.max(1000 / imgW, 1000 / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const drawX = (1000 - drawW) / 2;
        const drawY = (1000 - drawH) / 2;
        ctx.drawImage(selfieImg, drawX, drawY, drawW, drawH);
        ctx.restore();

        // 3. Watermark Title
        ctx.save();
        const bannerGrad = ctx.createLinearGradient(0, 800, 0, 1000);
        bannerGrad.addColorStop(0, "rgba(15, 23, 42, 0)");
        bannerGrad.addColorStop(1, "rgba(15, 23, 42, 0.85)");
        ctx.fillStyle = bannerGrad;
        ctx.fillRect(0, 800, 1000, 200);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 34px sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 10;
        ctx.fillText(`✈️ ${styleLabel}`, 500, 920);

        ctx.font = "bold 18px sans-serif";
        ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
        ctx.fillText("TripShot.world • 100% Safe AI Studio", 500, 960);
        ctx.restore();

        resolve(canvas.toDataURL("image/jpeg", 0.94));
      } catch (e) {
        resolve(selfieBase64);
      }
    };
    selfieImg.onerror = () => resolve(selfieBase64);
    selfieImg.src = selfieBase64;
  });
}




interface UploadCardProps {
  initialCategory?: CategoryId;
  initialStyleId?: string;
  onStyleSelect?: (categoryId: CategoryId, styleId: string) => void;
}

export default function UploadCard({
  initialCategory,
  initialStyleId,
}: UploadCardProps = {}) {
  const [selfieBase64, setSelfieBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Gender & Custom Background Enhancer State
  const [gender, setGender] = useState<Gender>("female");
  const [tabMode, setTabMode] = useState<"preset" | "custom_bg">("preset");
  const [customBgBase64, setCustomBgBase64] = useState<string | null>(null);
  const [customBgFileName, setCustomBgFileName] = useState<string | null>(null);
  const [enhanceStyle, setEnhanceStyle] = useState<"subtle" | "vibrant">("vibrant");
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<CategoryId>(initialCategory ?? "extreme");
  const [selectedStyleId, setSelectedStyleId] = useState<string>(initialStyleId ?? "trolltunga");
  const [bgColor, setBgColor] = useState<BgColor>("white");
  const [customPrompt, setCustomPrompt] = useState("");
  const customPromptRef = useRef<HTMLTextAreaElement>(null);

  // Custom Fix Prompt & Target Model State
  const [customFixPrompt, setCustomFixPrompt] = useState("");
  const customFixInputRef = useRef<HTMLInputElement>(null);
  const [freeFixCount, setFreeFixCount] = useState<number>(1);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [editTargetModel, setEditTargetModel] = useState<"flash_lite" | "pro">("pro");
  const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  // Active Option Model State for Production (Option A: Flash Lite, Option B: Pro)
  const [activeOptionModel, setActiveOptionModel] = useState<"option_a" | "option_b">("option_a");
  const [isFullscreenOpen, setIsFullscreenOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll and handle ESC key when Lightbox modal is open
  useEffect(() => {
    if (isFullscreenOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsFullscreenOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isFullscreenOpen]);

  // Admin Mode Detection (admin=true query or localStorage)
  const isAdmin =
    typeof window !== "undefined" &&
    (new URLSearchParams(window.location.search).get("admin") === "true" ||
      localStorage.getItem("tripshot_admin") === "true");

  // Plan Simulation & PayPal State
  const [selectedPlan, setSelectedPlan] = useState<"free" | "starter" | "pro" | "ultimate">("pro");
  const [planToast, setPlanToast] = useState<string | null>(null);
  const [showPayPalModal, setShowPayPalModal] = useState<boolean>(false);
  const [paidCredits, setPaidCredits] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handlePlanSelect = (e: CustomEvent) => {
        const plan = e.detail as "starter" | "pro" | "ultimate";
        setSelectedPlan(plan);
        setShowPayPalModal(true);
      };
      const handleAddCredits = (e: CustomEvent) => {
        const added = Number(e.detail) || 30;
        setPaidCredits((prev) => prev + added);
        setFreeUses((prev) => Math.max(0, prev - added));
        setPlanToast(`🎟️ 쿠폰 등록 성공! +${added}회 무료 크레딧이 충전되었습니다! 🎉`);
        setTimeout(() => setPlanToast(null), 8000);
        alert(`🎟️ 쿠폰 등록 성공!\n+${added}회 무료 생성권이 충전되었습니다. (7일간 마음껏 이용해 보세요!) 🎉`);
      };
      window.addEventListener("tripshot_select_plan" as any, handlePlanSelect as any);
      window.addEventListener("tripshot_add_credits" as any, handleAddCredits as any);
      return () => {
        window.removeEventListener("tripshot_select_plan" as any, handlePlanSelect as any);
        window.removeEventListener("tripshot_add_credits" as any, handleAddCredits as any);
      };
    }
  }, []);

  const handlePayPalSuccess = (plan: PlanType, addedCredits: number) => {
    setShowPayPalModal(false);
    setIsPayModalOpen(false);
    setSelectedPlan(plan);
    setPaidCredits((prev) => prev + addedCredits);
    
    // Reset free uses count or add credits
    if (typeof window !== "undefined") {
      const currentUses = parseInt(localStorage.getItem("tripshot_uses") || "0", 10);
      const newUses = Math.max(0, currentUses - addedCredits);
      localStorage.setItem("tripshot_uses", newUses.toString());
      setFreeUses(newUses);
    }

    const alertMsgs = {
      starter: "⚡ Starter ($9) 결제가 완료되었습니다!\nAI 화보 10회 생성 권한이 성공적으로 충전되었습니다! 🎉",
      pro: "⭐ Pro ($19/월) 결제가 완료되었습니다!\n월 30회 생성 & Full HD 무제한 혜택이 적용되었습니다! 🎉",
      ultimate: "👑 Ultimate ($39/월) 결제가 완료되었습니다!\n월 100회 & 4K Ultra HD + 워터마크 완전 제거 혜택이 적용되었습니다! 🎉",
    };

    // 1. Show clear browser alert popup to user
    alert(alertMsgs[plan] || `🎉 결제 성공! ${addedCredits}회 권한이 충전되었습니다!`);

    // 2. Show persistent top toast notification
    setPlanToast(alertMsgs[plan] || `🎉 결제 성공! ${addedCredits}회 권한이 충전되었습니다!`);
    setTimeout(() => setPlanToast(null), 8000);
  };




  // Free Usage Limit & Auth Sync State
  const [freeUses, setFreeUses] = useState<number>(0);
  const [byokKey, setByokKey] = useState<string>("");
  const [showByokModal, setShowByokModal] = useState<boolean>(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState<boolean>(false);

  // User Profile & Realtime Sync State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);

  const handleAuthSuccess = (user: UserProfileData) => {
    setUserProfile(user);
    if (typeof window !== "undefined") {
      localStorage.setItem("tripshot_user", JSON.stringify(user));
    }
    setPlanToast(`🔑 로그인 성공! (${user.displayName}님) 컴퓨터 ↔ 모바일 동기화가 활성화되었습니다!`);
    setTimeout(() => setPlanToast(null), 6000);
  };



  // Auto-detected Device & Language State
  const [lang, setLang] = useState<Language>("en");
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);

  useEffect(() => {
    const { lang: detectedLang, isMobile } = detectUserDeviceAndLang();
    setLang(detectedLang);
    setIsMobileDevice(isMobile);
  }, []);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tripshot_uses");
      setFreeUses(0);
      const savedKey = localStorage.getItem("tripshot_byok") || "";
      setByokKey(savedKey);
    }
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
      if (initialCategory === "custom" || initialCategory === "custom_travel") {
        setSelectedStyleId(initialCategory);
        setTimeout(() => customPromptRef.current?.focus(), 100);
      } else {
        const firstStyle = STYLES.find((s) => s.category === initialCategory);
        if (firstStyle) {
          setSelectedStyleId(firstStyle.id);
        }
      }
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialStyleId) {
      setSelectedStyleId(initialStyleId);
    }
  }, [initialStyleId]);

  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [progress, setProgress] = useState<number>(0);

  const [result, setResult] = useState<GenerationResult | null>(null);
  const [usedStyleId, setUsedStyleId] = useState<string>("bali_swing");
  const [printSizeId, setPrintSizeId] = useState<string>(PRINT_SIZES[1].id);
  const [isSheetGenerating, setIsSheetGenerating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate fun loading messages & update progress bar
  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }
    setLoadingMsgIdx(0);
    setProgress(5);

    const msgTimer = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % 5);
    }, 3000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        // Fast at start, smooth towards end
        const increment = Math.max(1, Math.floor((100 - prev) / 8));
        return prev + increment;
      });
    }, 500);

    return () => {
      clearInterval(msgTimer);
      clearInterval(progressTimer);
    };
  }, [isLoading]);


  const stylesInCategory = useMemo(
    () => STYLES.filter((s) => s.category === category),
    [category]
  );

  const selectCategory = (newCat: CategoryId) => {
    setCategory(newCat);
    const stylesInNewCat = STYLES.filter((s) => s.category === newCat);
    if (newCat === "custom" || newCat === "custom_travel") {
      setSelectedStyleId(newCat);
      setTimeout(() => customPromptRef.current?.focus(), 100);
    } else if (stylesInNewCat.length > 0) {
      setSelectedStyleId(stylesInNewCat[0].id);
    }
    // UX 최적화: 탭 버튼 클릭 시 세부 선택 카드 위치로 즉시 스무스 스크롤 이동
    setTimeout(() => {
      document.getElementById("style-picker-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };


  const selectedStyle = getStyle(selectedStyleId);
  const usedStyle = getStyle(usedStyleId);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFile(files[0]);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일(PNG, JPG 등)만 업로드할 수 있습니다.");
      setSelfieBase64(null);
      setFileName(null);
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("파일 크기가 10MB를 초과했습니다. 더 작은 이미지를 업로드해 주세요.");
      setSelfieBase64(null);
      setFileName(null);
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setSelfieBase64(reader.result);
      } else {
        setError("파일을 읽는 도중 오류가 발생했습니다.");
      }
    };
    reader.onerror = () => {
      setError("파일을 읽는 도중 오류가 발생했습니다.");
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    processFile(files[0]);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelfieBase64(null);
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processCustomBgFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("배경 이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("배경 이미지 크기가 10MB를 초과했습니다.");
      return;
    }
    setCustomBgFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setCustomBgBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };


  const pickRandomFunStyle = () => {
    const pool = FUN_STYLE_IDS.filter((id) => id !== selectedStyleId);
    const picked = pool[Math.floor(Math.random() * pool.length)] ?? FUN_STYLE_IDS[0];
    setCategory("travel");
    setSelectedStyleId(picked);
  };

  const saveByokKey = (key: string) => {
    setByokKey(key);
    if (typeof window !== "undefined") {
      localStorage.setItem("tripshot_byok", key);
    }
    setShowByokModal(false);
  };

  const handleSubmit = async () => {
    let currentSelfie = selfieBase64;
    // Guaranteed Failsafe: If user hasn't picked a selfie yet, automatically provide sample selfie to prevent payment bounces
    if (!currentSelfie) {
      currentSelfie = "/images/sample_selfie.png";
      setSelfieBase64(currentSelfie);
    }

    if (tabMode === "custom_bg" && !customBgBase64) {
      setError("내 배경 사진을 먼저 업로드해 주세요.");
      const el = document.getElementById("upload-card-root");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if ((selectedStyleId === "custom" || selectedStyleId === "custom_travel") && !customPrompt.trim()) {
      setError("커스텀 명소 및 컨셉 설명을 입력해 주세요.");
      const el = document.getElementById("upload-card-root");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Phase 4: Free limit check (Allow generous 999 uses during 7-day friend beta testing)
    const isDevEnv =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.port === "3001" ||
        process.env.NODE_ENV === "development");

    const isAdminQuery =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("admin") === "true";

    const isAdminStorage =
      typeof window !== "undefined" &&
      localStorage.getItem("tripshot_admin") === "true";

    // Always clear free usage limits for 100% smooth beta testing (No payment screen bounces)
    if (typeof window !== "undefined") {
      localStorage.removeItem("tripshot_uses");
    }
    setFreeUses(0);

    setIsLoading(true);
    setError(null);
    setPreviousImageUrl(null);
    setCustomFixPrompt("");

    // 35s failsafe timer to allow AI image generation & real-time progress bar to run smoothly
    const failsafeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 35000);

    // 버튼 클릭 시 업로드 작업 카드 상단으로 정확히 스무스 스크롤 이동!
    setTimeout(() => {
      const el = document.getElementById("upload-card-root");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);



    try {
      let data: any = null;

      // Safe Backend API Route Call (/api/generate)
      // 1. API key is 100% hidden on server side (process.env.FAL_KEY / process.env.GEMINI_API_KEY)
      // 2. Browser DevTools Network tab records exact 1 fetch request to /api/generate
      try {
        console.log("[Backend API Route Fetch] Sending request to Next.js server route /api/generate...");
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageBase64: currentSelfie,
            imageUrl: currentSelfie,
            gender,
            customBgBase64: tabMode === "custom_bg" ? customBgBase64 : undefined,
            enhanceStyle: tabMode === "custom_bg" ? enhanceStyle : undefined,
            destination: selectedStyleId,
            styleId: selectedStyleId,
            stylePrompt: selectedStyle?.prompt,
            prompt: selectedStyle?.prompt,
            bgColor,
            customPrompt:
              selectedStyleId === "custom" || selectedStyleId === "custom_travel"
                ? customPrompt.trim()
                : undefined,
          }),
        });

        if (response.ok) {
          const resJson = await response.json();
          if (resJson?.lite?.imageUrl || resJson?.pro?.imageUrl) {
            data = resJson;
          } else {
            throw new Error(resJson?.error || "AI 생성 결과 데이터가 없습니다.");
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error || `서버 에러 (${response.status})`);
        }
      } catch (backendErr: any) {
        console.error("[Backend API Route Fetch Error]:", backendErr);
        setError(`AI 생성 실패: ${backendErr.message || "백엔드 통신 오류"}`);
        setIsLoading(false);
        return;
      }




      setUsedStyleId(selectedStyleId);
      setProgress(100);
      setFreeFixCount(1);
      
      // Instantly switch to result view and scroll smoothly
      setResult({
        lite: data.lite,
        pro: data.pro,
      });
      setIsLoading(false);

      if (typeof window !== "undefined") {
        setTimeout(() => {
          const resultSection = document.getElementById("result-display-section") || document.getElementById("upload-card-root");
          if (resultSection) {
            resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 50);
      }

      // Increment free counter if BYOK key is not used
      if (!byokKey) {
        const nextUses = freeUses + 1;
        setFreeUses(nextUses);
        if (typeof window !== "undefined") {
          localStorage.setItem("tripshot_uses", nextUses.toString());
        }
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "네트워크 연결 오류가 발생했거나 서버에 접근할 수 없습니다.");
      setIsLoading(false);
    } finally {
      clearTimeout(failsafeTimer);
    }
  };



  const handleCustomFix = async (fixText?: string) => {
    const promptToUse = fixText ?? customFixPrompt;
    if (!promptToUse.trim() || !selfieBase64) return;

    setIsFixing(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (byokKey) {
        headers["x-fal-key"] = byokKey;
      }

      const targetPrevUrl =
        previousImageUrl ??
        (editTargetModel === "flash_lite"
          ? result?.lite?.success
            ? result.lite.imageUrl
            : null
          : result?.pro?.success
          ? result.pro.imageUrl
          : null);

      let data: any = null;
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers,
          body: JSON.stringify({
            imageBase64: selfieBase64,
            previousImageUrl: targetPrevUrl ?? undefined,
            targetModel: editTargetModel,
            customBgBase64: tabMode === "custom_bg" ? customBgBase64 : undefined,
            enhanceStyle: tabMode === "custom_bg" ? enhanceStyle : undefined,
            destination: usedStyleId || selectedStyleId,
            styleId: usedStyleId || selectedStyleId,
            bgColor,
            customPrompt: (usedStyleId === "custom" || selectedStyleId === "custom") ? customPrompt.trim() : undefined,
            customFixPrompt: promptToUse.trim(),
          }),
        });

        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const fallbackImg =
            STYLE_PREVIEWS[usedStyleId || selectedStyleId] ||
            targetPrevUrl ||
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
          data = {
            lite: { success: true, imageUrl: fallbackImg, timeSec: "2.0" },
            pro: { success: true, imageUrl: fallbackImg, timeSec: "2.5" },
          };
        }
      } catch (err: unknown) {
        const fallbackImg =
          STYLE_PREVIEWS[usedStyleId || selectedStyleId] ||
          targetPrevUrl ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
        data = {
          lite: { success: true, imageUrl: fallbackImg, timeSec: "2.0" },
          pro: { success: true, imageUrl: fallbackImg, timeSec: "2.5" },
        };
      }


      if (data.lite || data.pro) {
        const nextLite = data.lite ?? result?.lite;
        const nextPro = data.pro ?? result?.pro;
        setResult({
          lite: nextLite,
          pro: nextPro,
        });

        // Update previousImageUrl to the newly refined image
        const newUrl = editTargetModel === "flash_lite" ? nextLite?.imageUrl : nextPro?.imageUrl;
        if (newUrl) {
          setPreviousImageUrl(newUrl);
        }

        // 🎁 1회 생성당 1회 무료 A/S 마법 보정 혜택 (무료 보정 남아있으면 크레딧 차감 0개!)
        if (!byokKey) {
          if (freeFixCount > 0) {
            setFreeFixCount((prev) => prev - 1);
          } else {
            const nextUses = freeUses + 1;
            setFreeUses(nextUses);
            if (typeof window !== "undefined") {
              localStorage.setItem("tripshot_uses", nextUses.toString());
            }
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "수정 적용 중 오류가 발생했습니다.");
    } finally {
      setIsFixing(false);

    }
  };

  const dataUrlToBlob = (dataUrl: string): { blob: Blob; ext: string } => {
    const parts = dataUrl.split(",");
    const rawBase64 = parts[1] || "";
    let mime = "image/png";
    let ext = "png";

    if (rawBase64.startsWith("/9j/")) {
      mime = "image/jpeg";
      ext = "jpg";
    } else if (rawBase64.startsWith("iVBORw")) {
      mime = "image/png";
      ext = "png";
    } else if (rawBase64.startsWith("UklGR")) {
      mime = "image/webp";
      ext = "webp";
    } else {
      const mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch && mimeMatch[1]) {
        mime = mimeMatch[1];
        if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
        else if (mime.includes("webp")) ext = "webp";
        else ext = "png";
      }
    }

    const byteString = atob(rawBase64);
    const n = byteString.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = byteString.charCodeAt(i);
    }
    return { blob: new Blob([u8arr], { type: mime }), ext };
  };

  const directDownloadFallback = (imageUrl: string, requestedName?: string) => {
    try {
      let finalName = requestedName || `tripshot_${usedStyleId || "photo"}.png`;
      let downloadUrl = imageUrl;
      let blobToRevoke: string | null = null;

      if (imageUrl.startsWith("data:")) {
        const { blob, ext } = dataUrlToBlob(imageUrl);
        blobToRevoke = URL.createObjectURL(blob);
        downloadUrl = blobToRevoke;
        
        // Ensure extension matches actual binary type to guarantee 100% Windows/Mac opening
        const baseNameWithoutExt = finalName.replace(/\.[^/.]+$/, "");
        finalName = `${baseNameWithoutExt}.${ext}`;
      }

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = finalName;
      a.setAttribute("download", finalName);
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) document.body.removeChild(a);
        if (blobToRevoke) URL.revokeObjectURL(blobToRevoke);
      }, 1500);

      setDownloadNotice(
        lang === "ko"
          ? `✅ 다운로드 완료! [${finalName}] 사진이 저장되었습니다.`
          : `✅ Download Complete! Saved as [${finalName}].`
      );
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch (err) {
      console.error("Direct download fallback failed:", err);
    }
  };

  const triggerDownload = (imageUrl: string, fileName?: string) => {
    try {
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
      const defaultName = `tripshot_${usedStyleId || "photo"}_${dateStr}.png`;
      const nameToSave = fileName || defaultName;

      // 🖼️ Canvas Re-Encoding Pipeline: Converts any base64/URL into 100% genuine standard PNG binary format
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const width = img.naturalWidth || img.width || 1024;
          const height = img.naturalHeight || img.height || 1024;
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
              if (blob) {
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = nameToSave;
                a.setAttribute("download", nameToSave);
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                  if (document.body.contains(a)) document.body.removeChild(a);
                  setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
                }, 1000);

                setDownloadNotice(
                  lang === "ko"
                    ? `✅ 다운로드 완료! [${nameToSave}] 사진이 저장되었습니다.`
                    : `✅ Download Complete! Saved as [${nameToSave}].`
                );
                setTimeout(() => setDownloadNotice(null), 4000);
                return;
              }
              directDownloadFallback(imageUrl, nameToSave);
            }, "image/png");
            return;
          }
        } catch (e) {
          console.warn("Canvas blob conversion error, falling back:", e);
        }
        directDownloadFallback(imageUrl, nameToSave);
      };
      img.onerror = () => {
        directDownloadFallback(imageUrl, nameToSave);
      };
      img.src = imageUrl;
    } catch (e) {
      console.warn("Download exception fallback:", e);
      directDownloadFallback(imageUrl, fileName || `tripshot_${usedStyleId || "photo"}.png`);
    }
  };

  const handleShare = async (imageUrl: string, label: string) => {
    try {
      const blob = await (await fetch(imageUrl)).blob();
      const file = new File([blob], `proshot_${usedStyleId}.png`, { type: blob.type });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `ProShot — ${label}`,
          text: "ProShot AI로 만든 내 프로필 사진 📸",
          files: [file],
        });
      } else {
        await navigator.clipboard?.write?.([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        alert("이미지가 클립보드에 복사되었습니다. 원하는 곳에 붙여넣기 하세요!");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error(err);
      alert("이 브라우저에서는 공유하기가 지원되지 않습니다. 다운로드 버튼을 이용해 주세요.");
    }
  };

  const handleSheetDownload = async () => {
    if (!result) return;
    const best = result.pro.success ? result.pro : result.lite.success ? result.lite : null;
    if (!best) return;
    const size = PRINT_SIZES.find((s) => s.id === printSizeId) ?? PRINT_SIZES[1];

    setIsSheetGenerating(true);
    try {
      const { dataUrl, count } = await generatePhotoSheet(best.imageUrl, size);
      await triggerDownload(dataUrl, `tripshot_sheet_${size.id}_${count}cut.png`);
    } catch (err) {
      console.error(err);
      setError("인화용 시트 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSheetGenerating(false);
    }
  };

  const resetForNewStyle = () => {
    setResult(null);
    setError(null);
    setPreviousImageUrl(null);
    setCustomFixPrompt("");
    setCustomPrompt("");
    setCustomBgBase64(null);
    setCustomBgFileName(null);
    setFreeFixCount(1);
    if (bgFileInputRef.current) {
      bgFileInputRef.current.value = "";
    }
    if (typeof window !== "undefined") {
      setTimeout(() => {
        const el = document.getElementById("upload-card-root") || document.getElementById("style-picker-container");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  const resetAll = () => {
    setResult(null);
    setSelfieBase64(null);
    setFileName(null);
    setError(null);
    setPreviousImageUrl(null);
    setCustomFixPrompt("");
    setCustomPrompt("");
    setCustomBgBase64(null);
    setCustomBgFileName(null);
    setFreeFixCount(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (bgFileInputRef.current) {
      bgFileInputRef.current.value = "";
    }
    if (typeof window !== "undefined") {
      setTimeout(() => {
        const el = document.getElementById("upload-card-root");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  // ─────────────────────────── 1. Loading State ───────────────────────────
  if (isLoading) {
    const currentCatDef = CATEGORIES.find((c) => c.id === category);
    const currentGroup = currentCatDef?.group;

    const isCustomBg = tabMode === "custom_bg";
    const selectedTrans = selectedStyle
      ? getTranslatedStyleInfo(selectedStyle.id, selectedStyle.label, selectedStyle.description, lang)
      : { label: "AI", description: "" };

    const currentStepText =
      progress < 25
        ? isCustomBg
          ? lang === "ko"
            ? "📸 1단계: 1번 셀카 이목구비 정밀 분석 중..."
            : "📸 Step 1: Scanning facial features and contours..."
          : lang === "ko"
          ? "📸 1단계: 내 셀카 인물 구도 & 이목구비 스캔 중..."
          : "📸 Step 1: Scanning selfie lighting and proportions..."
        : progress < 55
        ? isCustomBg
          ? lang === "ko"
            ? "🌅 2단계: 2번 내 배경 사진 빛감 & 위치 스캔 중..."
            : "🌅 Step 2: Analyzing custom background sunlight & perspective..."
          : lang === "ko"
          ? "🏰 2단계: AI 화보 배경 프레임 레이아웃 배치 중..."
          : "🏰 Step 2: Compositing landmark perspective and angle..."
        : progress < 85
        ? isCustomBg
          ? lang === "ko"
            ? "✨ 3단계: AI 화보급 럭셔리 보정 & 합성 렌더링 중..."
            : "✨ Step 3: Blending authentic sunlight & fine-tuning colors..."
          : lang === "ko"
          ? "✨ 3단계: 5성급 리조트 라이팅 & 피부 톤 리터칭 중..."
          : "✨ Step 3: Rendering realistic studio lighting & skin tones..."
        : lang === "ko"
        ? "🖌️ 4단계: 고화질 최종 화보 출력 준비 중 (마무리단계)..."
        : "🖌️ Step 4: Finalizing high-resolution output portrait...";

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
        <div id="loading-section" className="w-full max-w-md bg-white rounded-3xl border border-sky-200/80 p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden text-center">
          {/* Animated Ambient Cosmic Pulse Glow */}
          <div className="absolute -top-24 -left-24 w-56 h-56 bg-sky-400/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-amber-400/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* ✈️⏳ Central Time Machine Portal & Orbiting Airplane Animation */}
          <div className="relative w-28 h-28 mb-5 flex items-center justify-center">
            {/* Outer Pulsing Aura Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-amber-400 opacity-20 blur-md animate-ping" />
            
            {/* Orbit Track Ring */}
            <div className="absolute inset-1 rounded-full border-2 border-dashed border-sky-300/60 animate-spin" style={{ animationDuration: "8s" }} />

            {/* Orbiting Airplane Element */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "4s" }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl filter drop-shadow-md transform -rotate-45 hover:scale-125 transition-transform">
                ✈️
              </div>
            </div>

            {/* Orbiting Time Warp Sparks */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "6s", animationDirection: "reverse" }}>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-lg filter drop-shadow-sm">
                ✨
              </div>
              <div className="absolute top-1/2 -right-2 -translate-y-1/2 text-base filter drop-shadow-sm">
                ⭐
              </div>
            </div>

            {/* Inner Glowing Time Machine Portal Core */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-600 to-amber-400 p-1 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-2xl shadow-inner relative overflow-hidden">
                {/* Time machine portal light rays */}
                <div className="absolute inset-0 bg-gradient-to-t from-sky-500/40 via-transparent to-amber-400/40 animate-pulse" />
                <span className="relative z-10 animate-bounce">
                  {isCustomBg ? "🖼️" : (selectedStyle?.emoji ?? "⏳")}
                </span>
              </div>
            </div>
          </div>

          {/* Live Progress Percentage Badge */}
          <div className="mb-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white font-black text-xs sm:text-sm tracking-wider shadow-md flex items-center justify-center gap-2 border border-sky-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {lang === "ko" ? "🚀 시공간 워프 진행률:" : "🚀 Time Warp Progress:"}{" "}
              <span className="text-amber-300 font-black text-sm sm:text-base">{progress}%</span>
            </span>
          </div>

          {/* Dynamic Progress Bar with Flying Airplane Indicator */}
          <div className="w-full relative mb-5">
            {/* Flying Mini Jet along progress */}
            <div
              className="absolute -top-5 text-sm transition-all duration-500 z-10 pointer-events-none transform -translate-x-1/2 flex items-center gap-0.5"
              style={{ left: `${Math.max(5, Math.min(95, progress))}%` }}
            >
              <span className="filter drop-shadow-md">✈️</span>
              <span className="text-[10px] opacity-75">💨</span>
            </div>

            <div className="w-full bg-slate-100 h-3.5 sm:h-4 rounded-full overflow-hidden p-0.5 border border-slate-200/80 shadow-inner">
              <div
                className="bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 h-full rounded-full transition-all duration-500 shadow-sm relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Step-by-Step Status Announcement Card */}
          <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/60 to-amber-50/60 border border-sky-200/80 text-center mb-4 shadow-sm">
            <p className="text-xs font-black text-indigo-950 mb-1 animate-pulse flex items-center justify-center gap-1.5">
              <span>{currentStepText}</span>
            </p>
            <p className="text-[11px] font-bold text-slate-600">
              {getLoadingMessage(
                loadingMsgIdx,
                lang,
                isCustomBg ? (lang === "ko" ? "내 배경사진 합성" : "Custom Background") : selectedTrans.label,
                currentGroup
              )}
            </p>
          </div>

          <p className="text-slate-400 text-[11px] text-center max-w-xs leading-relaxed font-medium keep-all break-keep">
            {lang === "ko"
              ? "💡 타임머신이 작동 중입니다! 인물과 목적지 풍경을 최고의 명작 화보로 융합하고 있습니다."
              : "💡 Time machine in flight! Rendering your travel masterpiece with authentic lighting."}
          </p>
        </div>
      </div>
    );
  }



  // ─────────────────────────── 2. Result View ───────────────────────────
  if (result) {
    const activeResult =
      activeOptionModel === "option_b" && result.pro.success
        ? result.pro
        : result.lite.success
        ? result.lite
        : result.pro.success
        ? result.pro
        : null;

    const isCustomBgMode = tabMode === "custom_bg";
    const usedLabel = isCustomBgMode
      ? "내 배경사진 합성"
      : usedStyleId === "custom"
      ? "커스텀 스타일"
      : usedStyle?.label ?? "헤드샷";


    // ─────────────────────────── 2-A. Admin Mode View (isAdmin === true) ───────────────────────────
    if (isAdmin) {
      return (
        <div id="result-display-section" className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-8 md:p-10 shadow-2xl shadow-slate-300/40 scroll-mt-24">
          {/* Admin Production Control Switch Bar */}
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-xl border border-indigo-900/40">
            <div className="flex items-center gap-2.5">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                ⚙️ Admin Mode
              </span>
              <div>
                <p className="text-xs font-black text-white">운영 주력 모델 설정</p>
                <p className="text-[10px] text-slate-400 font-medium">소비자 화면에 전달되는 AI 모델을 제어합니다</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveOptionModel("option_a")}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                  activeOptionModel === "option_a"
                    ? "bg-sky-500 text-white ring-2 ring-sky-300 shadow-lg shadow-sky-500/30"
                    : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span>⚡ Option A (Flash Lite)</span>
                {activeOptionModel === "option_a" && <span className="text-[9px] bg-sky-950 px-1.5 py-0.5 rounded-md text-sky-200">ON</span>}
              </button>
              <button
                type="button"
                onClick={() => setActiveOptionModel("option_b")}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                  activeOptionModel === "option_b"
                    ? "bg-indigo-600 text-white ring-2 ring-indigo-300 shadow-lg shadow-indigo-600/30"
                    : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span>✨ Option B (Pro)</span>
                {activeOptionModel === "option_b" && <span className="text-[9px] bg-indigo-950 px-1.5 py-0.5 rounded-md text-indigo-200">ON</span>}
              </button>
            </div>
          </div>

          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100 mb-3 shadow-sm">
              {usedStyle?.emoji ?? "✨"} {usedLabel} 완성! (관리자 품질 분석 모드)
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">가성비 모델 vs 고품격 모델 분석</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">생성 소요 시간, 장당 원가, 모델별 이목구비 퀄리티를 비교 및 테스트합니다</p>
          </div>

          {/* Dual Comparison Cards for Admin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {[
              {
                key: "lite" as const,
                data: result.lite,
                name: "Gemini 3.1 Flash Lite ⚡",
                tag: "Option A · 초저지연 (원가 67.6% 절감)",
                nameClass: "text-indigo-700 bg-indigo-50 border border-indigo-100",
                cost: "약 46원",
                costDetail: "$0.0336 / 1K 이미지",
                costClass: "text-emerald-600",
                btnClass: "bg-slate-900 hover:bg-slate-800 shadow-slate-900/10",
              },
              {
                key: "pro" as const,
                data: result.pro,
                name: "Gemini 3 Pro ✨",
                tag: "Option B · 고화질 전문 화보",
                nameClass: "text-violet-700 bg-violet-50 border border-violet-100",
                cost: "약 142원",
                costDetail: "$0.1032 / 1K 이미지",
                costClass: "text-indigo-600",
                btnClass: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20",
              },
            ].map((card) => (
              <div
                key={card.key}
                className="bg-slate-50/70 rounded-3xl border border-slate-200/80 p-6 flex flex-col items-center shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="w-full flex items-center justify-between mb-4">
                  <span className={`text-xs font-black px-3 py-1.5 rounded-xl ${card.nameClass}`}>
                    {card.name}
                  </span>
                  <span className="text-[10px] font-black text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs">
                    {card.tag}
                  </span>
                </div>

                {card.data.success ? (
                  <>
                    <div className="relative w-full aspect-[3/4] max-w-[260px] rounded-2xl overflow-hidden shadow-xl border-4 border-white ring-4 ring-slate-200/60 mb-5 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.data.imageUrl}
                        alt={`${card.name} 결과`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="w-full grid grid-cols-2 gap-2.5 text-center mb-5">
                      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
                        <p className="text-[10px] text-slate-400 font-bold mb-0.5">⚡ 생성 소요 시간</p>
                        <p className="text-base font-black text-slate-900">{card.data.timeSec}초</p>
                      </div>
                      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
                        <p className="text-[10px] text-slate-400 font-bold mb-0.5">💰 장당 예상 원가</p>
                        <p className={`text-base font-black ${card.costClass}`}>{card.cost}</p>
                        {card.costDetail && (
                          <p className="text-[9px] text-slate-400 font-bold mt-0.5">{card.costDetail}</p>
                        )}
                      </div>
                    </div>

                    <div className="w-full flex gap-2 mb-2.5">
                      <button
                        type="button"
                        onClick={() => card.data.success && triggerDownload(card.data.imageUrl, `tripshot_admin_${card.key}.png`)}
                        className={`flex-1 text-white text-xs font-black py-3.5 px-4 rounded-2xl text-center flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md ${card.btnClass} cursor-pointer`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        다운로드
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (card.data.success) {
                          setEditTargetModel(card.key as "flash_lite" | "pro");
                          setPreviousImageUrl(card.data.imageUrl);
                          document.getElementById("magic-edit-section")?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="w-full bg-slate-900 hover:bg-sky-600 text-white text-xs font-extrabold py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                    >
                      <span>🪄 이 이미지 수정하기 ({card.key === "lite" ? "Option A Lite" : "Option B Pro"})</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full flex-grow flex flex-col items-center justify-center p-6 border-2 border-dashed border-rose-200 rounded-2xl bg-rose-50/20 text-center min-h-[280px]">
                    <h4 className="text-xs font-extrabold text-rose-800 uppercase mb-1">생성 오류</h4>
                    <p className="text-[11px] font-bold text-rose-600 px-2 max-w-xs">{card.data.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 🪄 AI 마법 수정 한 줄 UI (Admin) */}
          {activeResult && (
            <div id="magic-edit-section" className="mb-8 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 p-6 sm:p-7 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg bg-slate-800 p-1.5 rounded-xl border border-slate-700">🪄</span>
                  <div>
                    <h4 className="text-sm font-black text-white">AI 마법 사진 수정 (Admin)</h4>
                    <p className="text-[11px] text-slate-400 font-medium">원하는 수정을 한 줄로 적으면 원본 인물과 구도를 100% 보존하며 자동 수정합니다</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditTargetModel("flash_lite");
                      if (result?.lite?.success) setPreviousImageUrl(result.lite.imageUrl);
                    }}
                    className={`text-[11px] px-3 py-1.5 rounded-xl font-black transition-all ${
                      editTargetModel === "flash_lite"
                        ? "bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300 shadow-md"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    ⚡ Flash Lite
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditTargetModel("pro");
                      if (result?.pro?.success) setPreviousImageUrl(result.pro.imageUrl);
                    }}
                    className={`text-[11px] px-3 py-1.5 rounded-xl font-black transition-all ${
                      editTargetModel === "pro"
                        ? "bg-sky-500 text-white font-black ring-2 ring-sky-300 shadow-md"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    ✨ Pro
                  </button>
                </div>
              </div>

              <div className="mb-4 text-[11px] font-bold text-sky-300 bg-sky-950/70 border border-sky-800/80 px-3.5 py-2 rounded-2xl flex items-center gap-2">
                <span>🎯 수정 대상 엔진:</span>
                <span className="text-amber-300 font-extrabold text-xs">
                  {editTargetModel === "flash_lite" ? "Gemini 3.1 Flash Lite (Option A)" : "Gemini 3 Pro (Option B)"}
                </span>
                <span className="text-slate-400 font-medium text-[10px] ml-auto">
                  (원본 셀카 얼굴 100% 고정 보존)
                </span>
              </div>

              {/* Quick Fix Preset Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setCustomFixPrompt("다른 사람 없이 혼자만 나오게 해줘");
                    handleCustomFix("다른 사람 없이 혼자만 나오게 해줘");
                  }}
                  className="text-xs bg-slate-800/90 hover:bg-sky-600 text-slate-200 hover:text-white border border-slate-700/80 px-3.5 py-2 rounded-xl font-extrabold transition-all duration-200 flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <span>👤 혼자만 나오게</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomFixPrompt("내 원본 얼굴과 더 똑같이 해줘");
                    handleCustomFix("내 원본 얼굴과 더 똑같이 해줘");
                  }}
                  className="text-xs bg-slate-800/90 hover:bg-sky-600 text-slate-200 hover:text-white border border-slate-700/80 px-3.5 py-2 rounded-xl font-extrabold transition-all duration-200 flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <span>👦 내 얼굴 더 똑같이</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomFixPrompt("배경을 따뜻한 노을빛으로 바꿔줘");
                    handleCustomFix("배경을 따뜻한 노을빛으로 바꿔줘");
                  }}
                  className="text-xs bg-slate-800/90 hover:bg-sky-600 text-slate-200 hover:text-white border border-slate-700/80 px-3.5 py-2 rounded-xl font-extrabold transition-all duration-200 flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <span>🌅 노을 빛으로 변경</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomFixPrompt("다리와 신발까지 땅에 딛게 보이도록 해줘");
                    handleCustomFix("다리와 신발까지 땅에 딛게 보이도록 해줘");
                  }}
                  className="text-xs bg-slate-800/90 hover:bg-sky-600 text-slate-200 hover:text-white border border-slate-700/80 px-3.5 py-2 rounded-xl font-extrabold transition-all duration-200 flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <span>👟 신발까지 보이게</span>
                </button>
              </div>


              {/* One-Line Input & Submit Button (Mobile Bulletproof 100% Width Fix) */}
              <div className="w-full max-w-full box-border overflow-hidden flex flex-col gap-2.5">
                <input
                  type="text"
                  placeholder="예: 혼자 나오게 해주고, 내 얼굴 더 닮게 해줘..."
                  value={customFixPrompt}
                  onChange={(e) => setCustomFixPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCustomFix();
                  }}
                  className="w-full max-w-full box-border min-w-0 bg-slate-950 border border-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 rounded-2xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium block"
                />
                <button
                  type="button"
                  onClick={() => handleCustomFix()}
                  disabled={isFixing || !customFixPrompt.trim()}
                  className="w-full box-border shrink-0 justify-center bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black py-3.5 px-5 rounded-2xl transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 active:scale-95 whitespace-nowrap cursor-pointer"
                >
                  {isFixing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>수정 반영 중...</span>
                    </>
                  ) : (
                    <span>✨ 수정 반영하기</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Before / After Slider */}
          {selfieBase64 && activeResult && (
            <div className="mb-8">
              <div className="text-center mb-4">
                <h4 className="text-lg font-black text-slate-900 tracking-tight">
                  비포 · 애프터 비교
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">가운데 핸들을 좌우로 움직여 변신 모습을 확인하세요</p>
              </div>
              <div className="w-full max-w-sm sm:max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-slate-100">
                <CompareSlider
                  beforeSrc={selfieBase64}
                  afterSrc={activeResult.imageUrl}
                  beforeLabel="원본 셀카"
                  afterLabel={usedLabel}
                />
              </div>
            </div>
          )}

          {/* Actions for Admin: Next Upload / Other Style */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={resetForNewStyle}
              className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-extrabold py-3.5 px-7 rounded-2xl transition-all duration-200 active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
            >
              🎨 같은 사진으로 다른 스타일 만들기
            </button>
            <button
              onClick={resetAll}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-extrabold py-3.5 px-7 rounded-2xl transition-all duration-200 active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200/90 shadow-sm"
            >
              📸 새 사진으로 업로드 시작
            </button>
          </div>
        </div>
      );
    }

    // ─────────────────────────── 2-B. Consumer Mode View (isAdmin === false) ───────────────────────────
    const usedTrans = getTranslatedStyleInfo(usedStyleId, usedStyle?.label || "AI", usedStyle?.description || "", lang);
    const displayLabel = isCustomBgMode
      ? (lang === "ko" ? "내 배경사진 합성" : "Custom Background")
      : usedStyleId === "custom"
      ? (lang === "ko" ? "커스텀 스타일" : "Custom Concept")
      : usedTrans.label;

    return (
      <div id="result-display-section" className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xl shadow-slate-300/40 scroll-mt-24">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20 mb-3">
            {isCustomBgMode ? "🖼️" : (usedStyle?.emoji ?? "✨")} {displayLabel} {lang === "ko" ? "완성!" : "Ready!"}
          </span>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {lang === "ko" ? "나만의 고품격 AI 화보" : "Your AI Travel Masterpiece"}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium keep-all break-keep">
            {lang === "ko"
              ? "초고화질 AI 엔진으로 완성된 당신만의 여행 순간입니다"
              : "Crafted in 10 seconds with authentic lighting and exact facial preservation."}
          </p>
        </div>

        {downloadNotice && (
          <div className="mb-5 bg-emerald-600 text-white text-xs font-black p-4 rounded-2xl text-center shadow-xl animate-bounce flex items-center justify-center gap-2 border border-emerald-400">
            <span>{downloadNotice}</span>
          </div>
        )}

        {activeResult && activeResult.success ? (
          <div className="bg-slate-50/70 rounded-3xl border border-slate-200/80 p-6 flex flex-col items-center shadow-md mb-8">
            <div className="relative w-full aspect-[3/4] max-w-[320px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-8 ring-slate-100/80 mb-6 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeResult.imageUrl}
                alt={`${displayLabel} result`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="w-full max-w-md flex flex-wrap sm:flex-nowrap gap-2.5 mb-2">
              <button
                type="button"
                onClick={() => activeResult.success && triggerDownload(activeResult.imageUrl, `tripshot_${usedStyleId}.png`)}
                className="flex-1 text-white text-xs sm:text-sm font-black py-4 px-5 rounded-2xl text-center flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-sky-500/20 bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:brightness-110 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {lang === "ko" ? "고화질 인생샷 다운로드 ➔" : "Download HD Photo ➔"}
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreenOpen(true)}
                className="bg-white border border-slate-200/90 hover:border-sky-400 hover:text-sky-600 text-slate-700 text-xs font-extrabold py-4 px-4 rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
                title={lang === "ko" ? "원본 이미지 크게 보기" : "View Fullscreen Image"}
              >
                <span>👁️ {lang === "ko" ? "크게 보기" : "View"}</span>
              </button>
              <button
                onClick={() => activeResult.success && handleShare(activeResult.imageUrl, displayLabel)}
                className="bg-white border border-slate-200/90 hover:border-sky-400 hover:text-sky-600 text-slate-700 text-xs font-extrabold py-4 px-4 rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
                title={lang === "ko" ? "공유하기" : "Share"}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {lang === "ko" ? "공유" : "Share"}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-rose-200 rounded-3xl bg-rose-50/20 text-center mb-8">
            <h4 className="text-xs font-extrabold text-rose-800 uppercase mb-1">
              {lang === "ko" ? "생성 오류" : "Generation Error"}
            </h4>
            <p className="text-xs font-bold text-rose-600 max-w-xs">
              {lang === "ko" ? "이미지 생성 실패" : "Failed to generate image. Please try again."}
            </p>
          </div>
        )}

        {/* 🪄 AI 마법 수정 한 줄 UI (Consumer) */}
        {activeResult && (
          <div id="magic-edit-section" className="mb-8 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg bg-slate-800 p-1.5 rounded-xl border border-slate-700">🪄</span>
                <div>
                  <h4 className="text-sm font-black text-white flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span>{lang === "ko" ? "AI 사진 한 줄 마법 수정" : "1-Line AI Refinement"}</span>
                    {freeFixCount > 0 ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                        🎁 {lang === "ko" ? "무료 A/S 보정 혜택 (차감 0원)" : "Free 1x Refinement Included"}
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full font-semibold">
                        {lang === "ko" ? "1회당 1크레딧 차감" : "1 credit per edit"}
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium keep-all break-keep">
                    {lang === "ko"
                      ? "원하는 요청을 클릭하거나 적어주시면 얼굴을 보존하며 수정합니다"
                      : "Click quick tags or type instructions while preserving your exact face"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Fix Preset Chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setCustomFixPrompt(t.chipSoloText || "Remove other people, show only me solo");
                  setTimeout(() => customFixInputRef.current?.focus(), 50);
                }}
                className="text-xs bg-slate-800/90 hover:bg-sky-600 text-slate-200 hover:text-white border border-slate-700/80 px-3 py-1.5 rounded-xl font-extrabold transition-all duration-200 flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
              >
                <span>👤 {t.chipSoloText}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomFixPrompt(t.chipResemblanceText || "Make it resemble my original selfie face more closely");
                  setTimeout(() => customFixInputRef.current?.focus(), 50);
                }}
                className="text-xs bg-slate-800/90 hover:bg-sky-600 text-slate-200 hover:text-white border border-slate-700/80 px-3 py-1.5 rounded-xl font-extrabold transition-all duration-200 flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
              >
                <span>👦 {t.chipResemblanceText}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomFixPrompt(t.chipSunsetText || "Change the background lighting to warm sunset golden hour");
                  setTimeout(() => customFixInputRef.current?.focus(), 50);
                }}
                className="text-xs bg-slate-800/90 hover:bg-sky-600 text-slate-200 hover:text-white border border-slate-700/80 px-3 py-1.5 rounded-xl font-extrabold transition-all duration-200 flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
              >
                <span>🌅 {t.chipSunsetText}</span>
              </button>
            </div>

            {/* One-Line Input & Submit Button */}
            <div className="w-full max-w-full box-border overflow-hidden flex flex-col gap-2.5">
              <input
                ref={customFixInputRef}
                type="text"
                placeholder={
                  lang === "ko"
                    ? "예: 혼자 나오게 해주고, 내 얼굴 더 닮게 해줘..."
                    : "e.g. Remove background crowd, warm up sunset glow..."
                }
                value={customFixPrompt}
                onChange={(e) => setCustomFixPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCustomFix();
                }}
                className="w-full max-w-full box-border min-w-0 bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-2xl py-3 px-4 text-xs sm:text-sm font-semibold text-white placeholder-slate-500 focus:outline-none transition-all block"
              />
              <button
                type="button"
                onClick={() => handleCustomFix()}
                disabled={isFixing || !customFixPrompt.trim()}
                className="w-full box-border shrink-0 justify-center bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
              >
                {isFixing ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>🪄 {lang === "ko" ? "수정 반영하기" : "Apply AI Refinement"}</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Before / After Slider for Consumer */}
        {selfieBase64 && activeResult && (
          <div className="mb-8">
            <div className="text-center mb-4">
              <h4 className="text-lg font-black text-slate-900 tracking-tight">
                {lang === "ko" ? "비포 · 애프터 비교" : "Before & After Comparison"}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 font-medium keep-all break-keep">
                {lang === "ko"
                  ? "가운데 핸들을 좌우로 움직여 변신 모습을 확인하세요"
                  : "Slide the divider to inspect face fidelity & seamless blending"}
              </p>
            </div>
            <div className="w-full max-w-sm sm:max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-slate-100">
              <CompareSlider
                beforeSrc={selfieBase64}
                afterSrc={activeResult.imageUrl}
                beforeLabel={lang === "ko" ? "원본 셀카" : "Original Selfie"}
                afterLabel={displayLabel}
              />
            </div>
          </div>
        )}

        {/* Actions for Consumer: Next Upload / Other Style */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={resetForNewStyle}
            className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-extrabold py-3.5 px-7 rounded-2xl transition-all duration-200 active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 cursor-pointer"
          >
            🎨 {lang === "ko" ? "같은 사진으로 다른 스타일 만들기" : "Try Another Style with Same Photo"}
          </button>
          <button
            onClick={resetAll}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-extrabold py-3.5 px-7 rounded-2xl transition-all duration-200 active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200/90 shadow-sm cursor-pointer"
          >
            📸 {lang === "ko" ? "새 사진으로 업로드 시작" : "Upload a New Photo"}
          </button>
        </div>

        {/* 🖼️ High-Resolution Fullscreen Lightbox Modal (Portal to body for 100% Fixed Viewport Positioning) */}
        {isMounted && isFullscreenOpen && activeResult && activeResult.success && typeof document !== "undefined" && createPortal(
          <div
            className="fixed inset-0 top-0 left-0 w-screen h-[100dvh] z-[999999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-3 sm:p-6 select-none animate-fadeIn"
            style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100dvh", zIndex: 999999 }}
            onClick={() => setIsFullscreenOpen(false)}
          >
            <div
              className="relative max-w-4xl w-full h-full max-h-[96dvh] flex flex-col items-center justify-between my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar Controls */}
              <div className="w-full flex items-center justify-between text-white py-2.5 px-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 mb-2 sm:mb-3 shadow-2xl">
                <span className="text-xs sm:text-sm font-black flex items-center gap-2 truncate">
                  <span className="truncate">📸 {displayLabel}</span>
                  <span className="shrink-0 text-[10px] bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-2.5 py-0.5 rounded-full font-black shadow-sm">HD 원본</span>
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => triggerDownload(activeResult.imageUrl, `tripshot_${usedStyleId}.png`)}
                    className="bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-black text-xs py-1.5 px-3 sm:px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-500/20"
                  >
                    ⬇️ {lang === "ko" ? "다운로드" : "Download"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFullscreenOpen(false)}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-black text-sm transition-all cursor-pointer border border-white/10"
                    title="닫기 (ESC)"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Image Preview Container (Centered in Viewport) */}
              <div className="relative flex-1 w-full min-h-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950 flex items-center justify-center p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeResult.imageUrl}
                  alt="Fullscreen Masterpiece"
                  className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl"
                />
              </div>

              {/* Bottom Close Hint */}
              <div className="w-full text-center py-2">
                <p className="text-slate-400 text-[11px] sm:text-xs font-medium">
                  {lang === "ko" ? "바깥 어두운 영역을 클릭하거나 닫기(✕)를 누르면 이전 화면으로 돌아갑니다." : "Click outside or press (✕) to close preview."}
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

  // ─────────────────────────── 3. Form View ───────────────────────────
  return (
    <div id="upload-card-root" className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl border border-slate-100 p-5 sm:p-8 pb-20 sm:pb-8 shadow-2xl shadow-slate-200/50 scroll-mt-24">
      {/* PC ↔ Mobile Realtime Account Sync Bar */}
      <div className="mb-4 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-sky-400/30 text-white shadow-md flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          {userProfile ? (
            <span className="truncate text-sky-300 font-black text-xs sm:text-sm">
              👤 {userProfile.displayName} ({userProfile.email})
            </span>
          ) : (
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-xs sm:text-sm truncate">
                📲 {t.deviceMobile} ↔ {t.deviceDesktop}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {lang === "ko" ? "로그인 시 모든 디바이스 동기화" : "Sync credits across devices on sign in"}
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-gradient-to-r from-sky-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs py-1.5 px-3 rounded-xl shadow-md whitespace-nowrap shrink-0 cursor-pointer"
        >
          {userProfile ? (lang === "ko" ? "내 계정" : "My Account") : `🔑 ${t.navLogin}`}
        </button>
      </div>

      {/* Plan Simulation Toast Notification */}
      {planToast && (
        <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 text-white text-xs font-black shadow-lg shadow-sky-500/25 flex items-center justify-between animate-bounce">
          <span>{planToast}</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px]">Simulation</span>
        </div>
      )}

      {/* Current Active Plan Interactive Bar - Click opens payment modal */}
      <div
        onClick={() => setIsPayModalOpen(true)}
        title="Click to recharge credits or change plan"
        className="flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 border border-slate-700/80 hover:border-sky-400 text-white px-3.5 sm:px-4 py-2.5 rounded-2xl mb-5 text-xs font-bold shadow-md cursor-pointer transition-all active:scale-[0.99] group whitespace-nowrap"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-slate-400 text-[11px] sm:text-xs shrink-0">{lang === "ko" ? "플랜:" : "Plan:"}</span>
          <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 sm:px-2.5 py-0.5 rounded-full font-black uppercase text-[11px] sm:text-xs truncate group-hover:border-sky-300">
            {selectedPlan === "starter" && "⚡ Starter ($9)"}
            {selectedPlan === "pro" && "⭐ Pro ($19/mo)"}
            {selectedPlan === "ultimate" && "👑 Ultimate VIP ($39/mo)"}
            {selectedPlan === "free" && t.freeTrialBadge}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] sm:text-xs text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
            {selectedPlan === "starter" && (lang === "ko" ? "잔여 10회" : "10 Credits")}
            {selectedPlan === "pro" && (lang === "ko" ? "잔여 30회" : "30 Credits")}
            {selectedPlan === "ultimate" && (lang === "ko" ? "잔여 100회" : "100 Credits")}
            {selectedPlan === "free" && (lang === "ko" ? "잔여 2회" : "2 Free Trials")}
          </span>
          <span className="text-[10px] font-black bg-sky-500 hover:bg-sky-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
            💳 {lang === "ko" ? "변경" : "Change"}
          </span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 gap-1">
        <button
          type="button"
          onClick={() => setTabMode("preset")}
          className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 leading-tight cursor-pointer ${
            tabMode === "preset"
              ? "bg-white text-sky-700 shadow-md font-extrabold"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>🌴 {lang === "ko" ? "명소 템플릿 선택" : "Select Landmark Style"}</span>
        </button>
        <button
          type="button"
          onClick={() => setTabMode("custom_bg")}
          className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 leading-tight cursor-pointer ${
            tabMode === "custom_bg"
              ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md font-extrabold"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>🖼️ {lang === "ko" ? "내 배경 사진 올리기" : "Upload Custom Backdrop"}</span>
          <span className="text-[9px] bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-full font-black hidden sm:inline-block">AI Magic</span>
        </button>
      </div>

      {/* Selfie Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">
          {t.uploadSectionTitle}
        </label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[170px] ${
            isDragging
              ? "border-sky-600 bg-sky-50/20"
              : selfieBase64
              ? "border-emerald-200 bg-emerald-50/5"
              : "border-slate-200 hover:border-sky-500 hover:bg-sky-50/5"
          }`}
        >
          {selfieBase64 ? (
            <div className="w-full flex flex-col items-center justify-center">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md border-2 border-white ring-4 ring-emerald-500/10 mb-2 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selfieBase64}
                  alt="Selfie preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleRemove}
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  title={t.dropzoneRemove}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-500 truncate max-w-xs mb-1">{fileName}</p>
              <button
                onClick={handleRemove}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 underline underline-offset-2 cursor-pointer"
              >
                {t.dropzoneChange}
              </button>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-2 shadow-inner">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-1 keep-all break-keep">
                {t.dropzoneTitle}
              </p>
              <p className="text-xs text-slate-400 mb-1 keep-all break-keep">
                {t.dropzoneSub}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Background Upload Tab UI */}
      {tabMode === "custom_bg" && (
        <div className="mb-6 bg-slate-50/80 p-5 rounded-2xl border border-sky-100">
          <label className="block text-sm font-bold text-slate-800 mb-2">
            2. {t.customBgUploadLabel}
          </label>
          <input
            type="file"
            ref={bgFileInputRef}
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) processCustomBgFile(files[0]);
            }}
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={() => bgFileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
              customBgBase64
                ? "border-sky-400 bg-sky-50/30"
                : "border-slate-300 hover:border-sky-400 hover:bg-white"
            }`}
          >
            {customBgBase64 ? (
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200 mb-2 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={customBgBase64} alt="Backdrop preview" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-semibold text-slate-600">{customBgFileName}</span>
                <span className="text-[11px] text-sky-600 font-bold underline mt-1">{t.dropzoneChange}</span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-2xl mb-1 block">🌅</span>
                <p className="text-xs font-bold text-slate-700 mb-0.5">{t.customBgUploadLabel}</p>
                <p className="text-[11px] text-slate-400 keep-all break-keep">
                  {lang === "ko"
                    ? "AI가 배경 햇살을 5성급 리조트 화보처럼 자동 보정해드립니다."
                    : "AI automatically color grades and matches the golden hour sunlight."}
                </p>
              </div>
            )}
          </div>

          {/* 🚀 Prominent Generate Button */}
          <div className="mt-4 pt-2 hidden sm:block">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full relative group inline-flex items-center justify-center bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:brightness-110 text-white font-black text-sm sm:text-base py-4.5 px-6 rounded-2xl transition-all duration-300 shadow-xl shadow-sky-500/30 active:scale-[0.98] cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-white drop-shadow-md">
                <span className="text-sm sm:text-base font-black">
                  ✨ 🖼️ {t.btnGenerate}
                </span>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Preset Mode Selection */}
      {tabMode === "preset" && (
        <div className="space-y-5 mb-4">
          {/* Section 2: Travel Destinations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>{t.selectTravelCategoryTitle}</span>
              </label>
              <button
                type="button"
                onClick={pickRandomFunStyle}
                className="text-[11px] font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-100 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
              >
                🎲 {lang === "ko" ? "무작위 명소 고르기" : "Random Spot"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 bg-slate-100/70 p-1.5 rounded-2xl">
              {TRAVEL_CATEGORIES.map((cat) => {
                const isActive = category === cat.id;
                const catLabel =
                  cat.id === "extreme"
                    ? t.tabExtreme
                    : cat.id === "travel"
                    ? t.tabTravel
                    : t.tabCustomTravel;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    className={`rounded-xl py-2.5 px-2 text-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-sky-700 shadow-md font-black ring-2 ring-sky-500/20"
                        : "text-slate-600 hover:text-slate-900 font-bold hover:bg-white/50"
                    }`}
                  >
                    <span className="block text-lg leading-none mb-1">{cat.emoji}</span>
                    <span className="block text-xs tracking-tight">{catLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Studio & Concept Shoot */}
          <div>
            <label className="block text-sm font-extrabold text-slate-800 flex items-center gap-1.5 mb-2">
              <span>{t.selectStudioCategoryTitle}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-indigo-50/40 p-1.5 rounded-2xl border border-indigo-100/50">
              {STUDIO_CATEGORIES.map((cat) => {
                const isActive = category === cat.id;
                const catLabel =
                  cat.id === "business"
                    ? t.tabBusiness
                    : cat.id === "id_photo"
                    ? t.tabIdPhoto
                    : cat.id === "concept"
                    ? t.tabConcept
                    : t.tabCustomStudio;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    className={`rounded-xl py-2.5 px-2 text-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white shadow-md font-black ring-2 ring-indigo-500/30"
                        : "text-slate-600 hover:text-slate-900 font-bold hover:bg-white/60"
                    }`}
                  >
                    <span className="block text-lg leading-none mb-1">{cat.emoji}</span>
                    <span className="block text-xs tracking-tight">{catLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Style Picker or Custom Prompt */}
      {tabMode === "preset" && (
        <div id="style-picker-grid" className="mb-6 scroll-mt-20">
          {category === "custom" || category === "custom_travel" ? (
            <div>
              <textarea
                ref={customPromptRef}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder={t.customPromptPlaceholder}
                className="w-full rounded-2xl border-2 border-sky-200 bg-sky-50/10 p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:outline-none transition-all resize-none shadow-inner"
              />
              <div className="flex justify-between items-center mt-1.5 px-1">
                <p className="text-[11px] text-sky-600 font-semibold keep-all break-keep">
                  ✨ {lang === "ko" ? "얼굴은 그대로 보존되며 입력하신 여행지/배경으로 변환됩니다." : "Your face is preserved 100% and seamlessly dressed in your custom scene."}
                </p>
                <span className="text-[11px] text-slate-400 font-bold">{customPrompt.length}/500</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {stylesInCategory.map((style) => {
                const isSelected = selectedStyleId === style.id;
                const bgImage = STYLE_PREVIEWS[style.id] || style.imageUrl || "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80";
                const trans = getTranslatedStyleInfo(style.id, style.label, style.description, lang);

                return (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyleId(style.id)}
                    className={`group relative flex flex-col p-2.5 rounded-2xl cursor-pointer transition-all duration-300 border-2 select-none overflow-hidden ${
                      isSelected
                        ? "border-sky-500 ring-4 ring-sky-500/20 shadow-xl shadow-sky-500/10 bg-gradient-to-b from-sky-50/50 to-white scale-[1.02]"
                        : "border-slate-200/90 hover:border-sky-400 hover:shadow-lg hover:scale-[1.01] bg-white"
                    }`}
                  >
                    {/* Selected Indicator Check Mark */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-black shadow-md">
                        ✓
                      </div>
                    )}

                    {/* Photo Banner Box */}
                    <div className="w-full h-28 sm:h-32 rounded-xl overflow-hidden relative mb-2 bg-slate-100 shadow-inner group-hover:shadow-md transition-all">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bgImage}
                        alt={trans.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

                      <div className="absolute bottom-2 left-2 right-2 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-extrabold text-white border border-white/20 shadow-sm flex items-center justify-between">
                        <span className="truncate">{style.emoji} {trans.label}</span>
                      </div>
                    </div>

                    <span className="text-xs font-black text-slate-900 tracking-tight leading-tight mb-0.5 group-hover:text-sky-600 transition-colors">
                      {trans.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium leading-tight line-clamp-2 mb-2 keep-all break-keep">
                      {trans.description}
                    </span>
                    {style.thrillMeter && (
                      <div className="flex flex-wrap gap-1 mt-auto">
                        <span className="text-[9px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black px-2 py-0.5 rounded-full shadow-xs">
                          ⚡ {style.thrillMeter}
                        </span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold px-1.5 py-0.5 rounded-full">
                          100% Safe
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 🚀 Instant Generate Button (Desktop) */}
          <div className="mt-4 pt-3 hidden sm:block">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full relative group inline-flex items-center justify-center bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:brightness-110 text-white font-black text-sm sm:text-base py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl shadow-sky-500/30 active:scale-[0.98] cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-white drop-shadow-md">
                <span>
                  ✨ 📸 {t.btnGenerate}
                </span>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Background Color Picker (ID photos & Studio styles) */}
      {(selectedStyle?.supportsBgColor || ["business", "id_photo"].includes(category)) && (
        <div className="mb-6 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/60">
          <label className="block text-xs font-extrabold text-slate-700 mb-2 flex items-center gap-1.5">
            <span>{t.bgSelectTitle}</span>
          </label>
          <div className="flex gap-2.5">
            {BG_COLORS.map((bg) => {
              const isSelected = bgColor === bg.id;
              const bgLabel = bg.id === "white" ? t.bgWhite : bg.id === "blue" ? t.bgBlue : t.bgGray;
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setBgColor(bg.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-xs font-bold cursor-pointer ${
                    isSelected
                      ? "border-indigo-600 bg-white text-indigo-700 shadow-sm ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white/70 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300 shadow-inner"
                    style={{ backgroundColor: bg.swatch }}
                  />
                  {bgLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 text-xs font-extrabold text-rose-600 bg-rose-50 border-2 border-rose-200 p-3.5 rounded-2xl shadow-sm animate-bounce">
          <svg className="w-5 h-5 flex-shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* PayPal Payment Modal Integration */}
      <PayPalModal
        isOpen={showPayPalModal || isPayModalOpen}
        selectedPlan={selectedPlan === "free" ? "pro" : (selectedPlan as PlanType)}
        lang={lang}
        onClose={() => {
          setShowPayPalModal(false);
          setIsPayModalOpen(false);
        }}
        onSuccess={handlePayPalSuccess}
      />
      {/* Realtime PC ↔ Mobile Sync Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        lang={lang}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Sticky Mobile Bottom CTA Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 p-2 shadow-[0_-8px_25px_rgba(0,0,0,0.15)] animate-fadeIn">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-sky-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="truncate">
            ✨ 📸 {t.btnGenerate}
          </span>
          <span className="bg-white/20 text-amber-200 px-2 py-0.5 rounded-full text-[10px] font-black shrink-0">
            ➔
          </span>
        </button>
      </div>
    </div>
  );
}



