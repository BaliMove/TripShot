"use client";

import { useEffect, useMemo, useRef, useState, ChangeEvent } from "react";
import {
  BG_COLORS,
  CATEGORIES,
  TRAVEL_CATEGORIES,
  STUDIO_CATEGORIES,
  STYLES,
  getStyle,
  type BgColor,
  type CategoryId,
  type Gender,
} from "../lib/styles";
import { PRINT_SIZES, generatePhotoSheet, type PrintSize } from "../lib/photoSheet";
import { detectUserDeviceAndLang, TRANSLATIONS, type Language } from "../lib/i18n";
import CompareSlider from "./CompareSlider";

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
  styleLabel?: string,
  categoryGroup?: "travel" | "studio"
) => {
  const label = styleLabel ?? "화보";

  if (categoryGroup === "studio") {
    const studioMessages = [
      "프리미엄 AI 인물 스튜디오 세팅 중... 📸",
      `${label} 맞춤 전문 조명과 톤을 조정하고 있어요 ✨`,
      `${label} 실내 스튜디오 배경과 의상을 정교하게 튜닝 중 💼`,
      "이목구비와 얼굴 고유 특징을 100% 보존하는 중 👤",
      "고품격 프로페셔널 화보 완성 직전! 🎨",
    ];
    return studioMessages[idx % studioMessages.length];
  }

  const travelMessages = [
    "비행기 타고 날아가는 중... ✈️",
    `${label} 현지 로케이션 스팟을 찾는 중이에요 📸`,
    `${label} 햇살과 5성급 풍경을 담고 있어요 🌅`,
    "인물 사진의 고유한 결을 100% 유지하는 중 ✨",
    "인스타그램 최고의 인생샷 완성 직전! 🎨",
  ];
  return travelMessages[idx % travelMessages.length];
};

const FUN_STYLE_IDS = STYLES.filter((s) => s.category === "fun" || s.category === "travel").map((s) => s.id);

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
  const [editTargetModel, setEditTargetModel] = useState<"flash_lite" | "pro">("pro");
  const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  // Active Option Model State for Production (Option A: Flash Lite, Option B: Pro)
  const [activeOptionModel, setActiveOptionModel] = useState<"option_a" | "option_b">("option_a");

  // Admin Mode Detection (admin=true query or localStorage)
  const isAdmin =
    typeof window !== "undefined" &&
    (new URLSearchParams(window.location.search).get("admin") === "true" ||
      localStorage.getItem("tripshot_admin") === "true");

  // Plan Simulation State
  const [selectedPlan, setSelectedPlan] = useState<"free" | "starter" | "pro" | "ultimate">("pro");
  const [planToast, setPlanToast] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handlePlanSelect = (e: CustomEvent) => {
        const plan = e.detail as "starter" | "pro" | "ultimate";
        setSelectedPlan(plan);
        const planNames = {
          starter: "⚡ Starter ($9) 선택됨 — 10장 생성 권한이 즉시 충전되었습니다!",
          pro: "⭐ Pro ($19/월) 선택됨 — 월 30장 생성 & Full HD(2K) 무제한 스튜디오 혜택 적용!",
          ultimate: "👑 Ultimate ($29/월) 선택됨 — 월 100장 & 4K Ultra HD + 워터마크 100% 제거 적용!",
        };
        setPlanToast(planNames[plan]);
        setTimeout(() => setPlanToast(null), 5000);
      };
      window.addEventListener("tripshot_select_plan" as any, handlePlanSelect as any);
      return () => window.removeEventListener("tripshot_select_plan" as any, handlePlanSelect as any);
    }
  }, []);

  // Free Usage Limit & BYOK Modal State (Phase 4)
  const [freeUses, setFreeUses] = useState<number>(0);
  const [byokKey, setByokKey] = useState<string>("");
  const [showByokModal, setShowByokModal] = useState<boolean>(false);

  // Auto-detected Device & Language State
  const [lang, setLang] = useState<Language>("ko");
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);

  useEffect(() => {
    const { lang: detectedLang, isMobile } = detectUserDeviceAndLang();
    setLang(detectedLang);
    setIsMobileDevice(isMobile);
  }, []);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const uses = parseInt(localStorage.getItem("tripshot_uses") || "0", 10);
      setFreeUses(uses);
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
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [usedStyleId, setUsedStyleId] = useState<string>("bali_swing");
  const [printSizeId, setPrintSizeId] = useState<string>(PRINT_SIZES[1].id);
  const [isSheetGenerating, setIsSheetGenerating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate fun loading messages
  useEffect(() => {
    if (!isLoading) return;
    setLoadingMsgIdx(0);
    const timer = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % 5);
    }, 3500);
    return () => clearInterval(timer);
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
    if (!selfieBase64) {
      setError("1번 사진 업로드 상자에서 셀카/인물 사진을 먼저 선택/업로드해 주세요 📸");
      document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (tabMode === "custom_bg" && !customBgBase64) {
      setError("내 배경 사진을 먼저 업로드해 주세요.");
      return;
    }
    if ((selectedStyleId === "custom" || selectedStyleId === "custom_travel") && !customPrompt.trim()) {
      setError("커스텀 명소 및 컨셉 설명을 입력해 주세요.");
      return;
    }

    // Phase 4: Free limit check (Bypass if localhost, dev mode, admin=true query, or tripshot_admin=true in localStorage)
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

    const isBypassLimit = isDevEnv || isAdminQuery || isAdminStorage;

    if (freeUses >= 2 && !byokKey && !isBypassLimit) {
      setShowByokModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    // 버튼 클릭 시 100% 생성 진행 화면(Loading View)으로 즉시 스무스 스크롤 이동
    setTimeout(() => {
      const targetEl = document.getElementById("loading-section") || document.getElementById("upload-section");
      targetEl?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (byokKey) {
        headers["x-fal-key"] = byokKey;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({
          imageBase64: selfieBase64,
          gender,
          customBgBase64: tabMode === "custom_bg" ? customBgBase64 : undefined,
          enhanceStyle: tabMode === "custom_bg" ? enhanceStyle : undefined,
          destination: selectedStyleId,
          styleId: selectedStyleId,
          bgColor,
          customPrompt:
            selectedStyleId === "custom" || selectedStyleId === "custom_travel"
              ? customPrompt.trim()
              : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI 화보 생성 처리 중 오류가 발생했습니다.");
      }

      setUsedStyleId(selectedStyleId);
      setResult({
        lite: data.lite,
        pro: data.pro,
      });

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
    } finally {
      setIsLoading(false);
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

      const response = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({
          imageBase64: selfieBase64,
          previousImageUrl: targetPrevUrl ?? undefined,
          targetModel: editTargetModel,
          customBgBase64: tabMode === "custom_bg" ? customBgBase64 : undefined,
          enhanceStyle: tabMode === "custom_bg" ? enhanceStyle : undefined,
          destination: selectedStyleId,
          styleId: selectedStyleId,
          bgColor,
          customPrompt: selectedStyleId === "custom" ? customPrompt.trim() : undefined,
          customFixPrompt: promptToUse.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "수정 재처리에 실패했습니다.");
      }

      if (data.lite || data.pro) {
        setResult({
          lite: data.lite ?? result?.lite,
          pro: data.pro ?? result?.pro,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "수정 적용 중 오류가 발생했습니다.");
    } finally {
      setIsFixing(false);
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
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `proshot_sheet_${size.id}_${count}cut.png`;
      a.click();
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
    // keep the selfie — user just wants a different style
  };

  const resetAll = () => {
    setResult(null);
    setSelfieBase64(null);
    setFileName(null);
    setError(null);
    setCustomPrompt("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ─────────────────────────── 1. Loading State ───────────────────────────
  if (isLoading) {
    const currentCatDef = CATEGORIES.find((c) => c.id === category);
    const currentGroup = currentCatDef?.group;

    return (
      <div id="loading-section" className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl border border-slate-100 p-8 shadow-2xl shadow-slate-200/50 flex flex-col items-center justify-center min-h-[380px] scroll-mt-24">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">
            {selectedStyle?.emoji ?? "✨"}
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 transition-all">
          {getLoadingMessage(
            loadingMsgIdx,
            selectedStyleId === "custom" ? "커스텀 스타일" : selectedStyle?.label,
            currentGroup
          )}
        </h3>
        <p className="text-slate-400 text-xs text-center max-w-xs leading-relaxed">
          두 인공지능 모델(Flash Lite 및 Pro)이 동시에{" "}
          <span className="font-bold text-indigo-500">
            {selectedStyleId === "custom" ? "커스텀 스타일" : selectedStyle?.label}
          </span>{" "}
          사진을 생성하고 있습니다. 약 15~30초 가량 소요될 수 있어요.
        </p>
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

    const usedLabel = usedStyleId === "custom" ? "커스텀 스타일" : usedStyle?.label ?? "헤드샷";

    // ─────────────────────────── 2-A. Admin Mode View (isAdmin === true) ───────────────────────────
    if (isAdmin) {
      return (
        <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-8 md:p-10 shadow-2xl shadow-slate-300/40 scroll-mt-24">
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
                      <a
                        href={card.data.imageUrl}
                        download="tripshot-admin-download.png"
                        className={`flex-1 text-white text-xs font-black py-3.5 px-4 rounded-2xl text-center flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md ${card.btnClass}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        다운로드
                      </a>
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
              </div>

              {/* One-Line Input & Submit Button */}
              <div className="flex items-center gap-2.5">
                <input
                  type="text"
                  placeholder="예: 혼자 나오게 해주고, 내 얼굴 더 닮게 해줘..."
                  value={customFixPrompt}
                  onChange={(e) => setCustomFixPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCustomFix();
                  }}
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 rounded-2xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleCustomFix()}
                  disabled={isFixing || !customFixPrompt.trim()}
                  className="bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black py-3 px-5 rounded-2xl transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 active:scale-95 whitespace-nowrap"
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
              <div className="max-w-[320px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-slate-100">
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
    return (
      <div className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xl shadow-slate-300/40 scroll-mt-24">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20 mb-3">
            {usedStyle?.emoji ?? "✨"} {usedLabel} 완성!
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            나만의 고품격 AI 화보
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">초고화질 AI 엔진으로 완성된 당신만의 여행 순간입니다</p>
        </div>

        {activeResult && activeResult.success ? (
          <div className="bg-slate-50/70 rounded-3xl border border-slate-200/80 p-6 flex flex-col items-center shadow-md mb-8">
            <div className="relative w-full aspect-[3/4] max-w-[320px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-8 ring-slate-100/80 mb-6 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeResult.imageUrl}
                alt={`${usedLabel} 결과`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="w-full max-w-md flex gap-2.5 mb-2">
              <a
                href={activeResult.imageUrl}
                download="tripshot-photo.png"
                className="flex-1 text-white text-xs sm:text-sm font-black py-4 px-5 rounded-2xl text-center flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-sky-500/20 bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:brightness-110"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                고화질 인생샷 다운로드 ➔
              </a>
              <button
                onClick={() => activeResult.success && handleShare(activeResult.imageUrl, usedLabel)}
                className="bg-white border border-slate-200/90 hover:border-sky-400 hover:text-sky-600 text-slate-700 text-xs font-extrabold py-4 px-5 rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                title="공유하기"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                공유
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-rose-200 rounded-3xl bg-rose-50/20 text-center mb-8">
            <h4 className="text-xs font-extrabold text-rose-800 uppercase mb-1">생성 오류</h4>
            <p className="text-xs font-bold text-rose-600 max-w-xs">
              이미지 생성 실패
            </p>
          </div>
        )}

        {/* 🪄 AI 마법 수정 한 줄 UI (Consumer) */}
        {activeResult && (
          <div id="magic-edit-section" className="mb-8 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-lg bg-slate-800 p-1.5 rounded-xl border border-slate-700">🪄</span>
              <div>
                <h4 className="text-sm font-black text-white">AI 사진 한 줄 마법 수정</h4>
                <p className="text-[11px] text-slate-400 font-medium">원하는 요청을 클릭하거나 적어주시면 얼굴을 보존하며 수정합니다</p>
              </div>
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
            </div>

            {/* One-Line Input & Submit Button */}
            <div className="flex items-center gap-2.5">
              <input
                type="text"
                placeholder="예: 혼자 나오게 해주고, 내 얼굴 더 닮게 해줘..."
                value={customFixPrompt}
                onChange={(e) => setCustomFixPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCustomFix();
                }}
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 rounded-2xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => handleCustomFix()}
                disabled={isFixing || !customFixPrompt.trim()}
                className="bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black py-3 px-5 rounded-2xl transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 active:scale-95 whitespace-nowrap"
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

        {/* Before / After Slider for Consumer */}
        {selfieBase64 && activeResult && (
          <div className="mb-8">
            <div className="text-center mb-4">
              <h4 className="text-lg font-black text-slate-900 tracking-tight">
                비포 · 애프터 비교
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">가운데 핸들을 좌우로 움직여 변신 모습을 확인하세요</p>
            </div>
            <div className="max-w-[320px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-slate-100">
              <CompareSlider
                beforeSrc={selfieBase64}
                afterSrc={activeResult.imageUrl}
                beforeLabel="원본 셀카"
                afterLabel={usedLabel}
              />
            </div>
          </div>
        )}

        {/* Actions for Consumer: Next Upload / Other Style */}
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

  // ─────────────────────────── 3. Form View ───────────────────────────
  return (
    <div id="upload-section" className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xl shadow-slate-200/50 scroll-mt-24">
      {/* Plan Simulation Toast Notification */}
      {planToast && (
        <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 text-white text-xs font-black shadow-lg shadow-sky-500/25 flex items-center justify-between animate-bounce">
          <span>{planToast}</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px]">시뮬레이션</span>
        </div>
      )}

      {/* Current Active Plan Badge Bar */}
      <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-2xl mb-6 text-xs font-bold shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">현재 적용 플랜:</span>
          <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2.5 py-0.5 rounded-full font-black uppercase">
            {selectedPlan === "starter" && "⚡ Starter ($9)"}
            {selectedPlan === "pro" && "⭐ Pro ($19/월) - 추천"}
            {selectedPlan === "ultimate" && "👑 Ultimate VIP ($29/월)"}
            {selectedPlan === "free" && "무료 체험 (Free)"}
          </span>
        </div>
        <span className="text-[11px] text-emerald-400 font-bold">
          {selectedPlan === "starter" && "잔여 10회"}
          {selectedPlan === "pro" && "잔여 30회"}
          {selectedPlan === "ultimate" && "잔여 100회"}
          {selectedPlan === "free" && "잔여 2회"}
        </span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => setTabMode("preset")}
          className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            tabMode === "preset"
              ? "bg-white text-sky-700 shadow-md font-extrabold"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>🌴 추천 명소 선택</span>
        </button>
        <button
          type="button"
          onClick={() => setTabMode("custom_bg")}
          className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            tabMode === "custom_bg"
              ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md font-extrabold"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>📸 내 배경 사진 올리기 (마법 보정)</span>
          <span className="text-[9px] bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-full font-black">NEW</span>
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
                  alt="셀카 프리뷰"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleRemove}
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="사진 삭제"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-500 truncate max-w-xs mb-1">{fileName}</p>
              <button
                onClick={handleRemove}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 underline underline-offset-2"
              >
                다른 사진으로 변경
              </button>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-2 shadow-inner">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-1">
                얼굴 셀카/인물 사진 업로드
              </p>
              <p className="text-xs text-slate-400 mb-1">
                이목구비가 또렷한 상반신 사진 권장 (최대 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Background Upload Tab UI vs Preset Selection */}
      {tabMode === "custom_bg" ? (
        <div className="mb-6 bg-slate-50/80 p-5 rounded-2xl border border-sky-100">
          <label className="block text-sm font-bold text-slate-800 mb-2">
            2. 내가 찍어온 배경 사진 업로드 (어둡거나 날씨 나쁜 사진 가능!)
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
                  <img src={customBgBase64} alt="배경 사진 프리뷰" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-semibold text-slate-600">{customBgFileName}</span>
                <span className="text-[11px] text-sky-600 font-bold underline mt-1">배경 사진 변경하기</span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-2xl mb-1 block">🌅</span>
                <p className="text-xs font-bold text-slate-700 mb-0.5">내 여행지/장소 배경 사진 선택</p>
                <p className="text-[11px] text-slate-400">AI가 배경 햇살을 5성급 리조트 화보처럼 자동 보정해드립니다.</p>
              </div>
            )}
          </div>

          {/* Background Enhancement Intensity Switch */}
          <div className="mt-4 pt-4 border-t border-slate-200/60">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              ✨ AI 배경 보정 스타일 선택
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEnhanceStyle("vibrant")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  enhanceStyle === "vibrant"
                    ? "border-sky-600 bg-white text-sky-700 font-bold shadow-sm ring-2 ring-sky-500/20"
                    : "border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-extrabold mb-0.5">🌟 화보급 럭셔리 보정</div>
                <div className="text-[10px] text-slate-400">쨍하고 맑은 날씨 & 5성급 휴양지 빛감</div>
              </button>
              <button
                type="button"
                onClick={() => setEnhanceStyle("subtle")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  enhanceStyle === "subtle"
                    ? "border-sky-600 bg-white text-sky-700 font-bold shadow-sm ring-2 ring-sky-500/20"
                    : "border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-extrabold mb-0.5">🌿 자연스러운 리터칭</div>
                <div className="text-[10px] text-slate-400">원본 배경의 분위기를 살린 톤 정리</div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Preset Category & Destination Picker */
        <div className="space-y-5 mb-4">
          {/* Section 2: 여행 명소 배경 선택 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>2. 명소 배경 선택</span>
                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
                  여행 스팟
                </span>
              </label>
              <button
                onClick={pickRandomFunStyle}
                className="text-[11px] font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-100 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
              >
                🎲 무작위 명소 고르기
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 bg-slate-100/70 p-1.5 rounded-2xl">
              {TRAVEL_CATEGORIES.map((cat) => {
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    className={`rounded-xl py-2.5 px-2 text-center transition-all ${
                      isActive
                        ? "bg-white text-sky-700 shadow-md font-black ring-2 ring-sky-500/20"
                        : "text-slate-600 hover:text-slate-900 font-bold hover:bg-white/50"
                    }`}
                  >
                    <span className="block text-lg leading-none mb-1">{cat.emoji}</span>
                    <span className="block text-xs tracking-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: 스튜디오 & 컨셉 촬영 선택 */}
          <div>
            <label className="block text-sm font-extrabold text-slate-800 flex items-center gap-1.5 mb-2">
              <span>3. 스튜디오 & 컨셉 촬영 선택</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                프로필 · 증명 · 이색 · 커스텀
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-indigo-50/40 p-1.5 rounded-2xl border border-indigo-100/50">
              {STUDIO_CATEGORIES.map((cat) => {
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    className={`rounded-xl py-2.5 px-2 text-center transition-all ${
                      isActive
                        ? "bg-slate-900 text-white shadow-md font-black ring-2 ring-indigo-500/30"
                        : "text-slate-600 hover:text-slate-900 font-bold hover:bg-white/60"
                    }`}
                  >
                    <span className="block text-lg leading-none mb-1">{cat.emoji}</span>
                    <span className="block text-xs tracking-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Style Picker or Custom Prompt */}
      <div id="style-picker-grid" className="mb-6 scroll-mt-20">
        {category === "custom" || category === "custom_travel" ? (
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {(category === "custom_travel"
                ? [
                    "🚀 우주선 타고 날아가는 모습",
                    "🏜️ 이집트 피라미드 앞 석양",
                    "🏰 유럽 고성 정원의 왕족 화보",
                    "🛸 화성 탐사선 배경의 미래 사진",
                  ]
                : [
                    "🚀 우주비행사 슈트를 입고 은하수를 배경으로",
                    "🎨 반 고흐 유화 스타일의 클래식 초상화",
                    "🕵️‍♂️ 셜록 홈즈 감성의 빈티지 영국 탐정 룩",
                    "👑 고풍스러운 궁전 배경의 로열 왕족 초상화",
                  ]
              ).map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => setCustomPrompt(sample.replace(/^[^ ]+\s/, ""))}
                  className="text-[11px] font-semibold text-sky-700 bg-sky-50/80 hover:bg-sky-100 border border-sky-100/80 px-2.5 py-1 rounded-full transition-all active:scale-95"
                >
                  {sample}
                </button>
              ))}
            </div>
            <textarea
              ref={customPromptRef}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder={
                category === "custom_travel"
                  ? "원하시는 여행지나 배경을 자유롭게 입력해 주세요 (예: 알프스 산 정상에서 헬기 타고 찍은 사진)"
                  : "원하는 스타일과 컨셉을 자유롭게 글로 적어주세요 (예: 은하수를 배경으로 스페이스 슈트를 입고 촬영한 화보)"
              }
              className="w-full rounded-2xl border-2 border-sky-200 bg-sky-50/10 p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:outline-none transition-all resize-none shadow-inner"
            />
            <div className="flex justify-between items-center mt-1.5 px-1">
              <p className="text-[11px] text-sky-600 font-semibold">
                ✨ 얼굴은 90% 이상 그대로 유지되며, 입력하신 여행지/배경으로 변환됩니다.
              </p>
              <span className="text-[11px] text-slate-400 font-bold">{customPrompt.length}/500</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            {stylesInCategory.map((style) => {
              const isSelected = selectedStyleId === style.id;
              return (
                <div
                  key={style.id}
                  onClick={() => setSelectedStyleId(style.id)}
                  className={`flex flex-col items-center text-center p-3 rounded-2xl cursor-pointer transition-all duration-300 border-2 select-none ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/20 text-indigo-700 font-bold shadow-md shadow-indigo-500/5"
                      : "border-slate-100 bg-slate-50/30 text-slate-600 hover:border-slate-200 hover:bg-slate-50/80"
                  }`}
                >
                  <span className="text-2xl mb-1.5">{style.emoji}</span>
                  <span className="text-xs sm:text-[13px] font-bold tracking-tight mb-0.5 leading-tight">
                    {style.label}
                  </span>
                  <span
                    className={`text-[10px] font-medium leading-tight ${
                      isSelected ? "text-indigo-500/90" : "text-slate-400"
                    }`}
                  >
                    {style.description}
                  </span>
                  {style.thrillMeter && (
                    <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                      <span className="text-[9px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1.5 py-0.5 rounded-md font-black">
                        ⚡ {style.thrillMeter}
                      </span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-black">
                        🛡️ {style.dangerBadge ?? "100% Safe AI"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Background Color Picker (ID photos & Studio styles) */}
      {(selectedStyle?.supportsBgColor || ["business", "id_photo"].includes(category)) && (
        <div className="mb-6 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/60">
          <label className="block text-xs font-extrabold text-slate-700 mb-2 flex items-center gap-1.5">
            <span>🎨 스튜디오 단색 배경색 선택</span>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
              증명·여권·정장
            </span>
          </label>
          <div className="flex gap-2.5">
            {BG_COLORS.map((bg) => {
              const isSelected = bgColor === bg.id;
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setBgColor(bg.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-xs font-bold ${
                    isSelected
                      ? "border-indigo-600 bg-white text-indigo-700 shadow-sm ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white/70 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300 shadow-inner"
                    style={{ backgroundColor: bg.swatch }}
                  />
                  {bg.label}
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

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full relative group inline-flex items-center justify-center bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-base py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/40 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed overflow-hidden active:scale-[0.98] disabled:active:scale-100 cursor-pointer"
      >
        <span className="relative z-10 flex items-center gap-1.5">
          <span>
            ✨ {selectedStyle?.emoji ?? "📸"}{" "}
            {selectedStyleId === "custom" || selectedStyleId === "custom_travel"
              ? "커스텀"
              : selectedStyle?.label ?? "AI"}{" "}
            화보 생성하러 가기
          </span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </button>

      {/* Phase 4: BYOK Modal */}
      {showByokModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center relative">
            <div className="text-4xl mb-3">✈️</div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              무료 탑승권을 모두 사용하셨습니다
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              기본 무료 생성 2회를 모두 사용하셨습니다. 계속해서 나만의 여행 인생샷을 생성하려면 본인의 fal.ai API Key를 입력하거나 프리미엄 패스를 이용해 보세요.
            </p>

            {/* Option A: BYOK */}
            <div className="bg-slate-50 p-4 rounded-2xl mb-4 text-left border border-slate-200/80">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                🔑 개인 fal.ai API Key 입력 (BYOK)
              </label>
              <input
                type="password"
                placeholder="fal_key_..."
                value={byokKey}
                onChange={(e) => setByokKey(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500 mb-2 font-mono"
              />
              <button
                onClick={() => saveByokKey(byokKey)}
                disabled={!byokKey.trim()}
                className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
              >
                API Key 저장하고 생성 계속하기
              </button>
            </div>

            {/* Option B: Premium Pass Placeholder */}
            <button
              disabled
              className="w-full bg-slate-100 text-slate-400 font-bold text-xs py-3 rounded-2xl cursor-not-allowed mb-4 border border-slate-200"
            >
              💳 무제한 프리미엄 패스 (준비 중)
            </button>

            <button
              onClick={() => setShowByokModal(false)}
              className="w-full text-xs font-semibold text-slate-400 hover:text-slate-600 py-2"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

