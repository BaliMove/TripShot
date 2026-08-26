"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import UploadCard from "./components/UploadCard";
import CouponModal from "./components/CouponModal";
import AuthModal, { type UserProfileData } from "./components/AuthModal";
import { CATEGORIES, STYLES, STYLE_PREVIEWS, type CategoryId } from "./lib/styles";
import { detectUserDeviceAndLang, TRANSLATIONS, getTranslatedStyleInfo, type Language } from "./lib/i18n";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("extreme");
  const [selectedStyleId, setSelectedStyleId] = useState<string>("trolltunga");
  const [lang, setLang] = useState<Language>("en");
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const { lang: detectedLang } = detectUserDeviceAndLang();
    setLang(detectedLang);
    document.title =
      detectedLang === "ko"
        ? "TripShot — AI 익스트림 여행 & 글로벌 스튜디오 화보"
        : "TripShot — 100% Safe AI Extreme Travel & Global Studio Photos";

    // Read stored user profile if available
    const savedUser = localStorage.getItem("tripshot_user");
    if (savedUser) {
      try {
        setUserProfile(JSON.parse(savedUser));
      } catch {
        // ignore
      }
    }
  }, []);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const scrollToUpload = () => {
    const element = document.getElementById("upload-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const selectStyleAndScroll = (category: CategoryId, styleId?: string) => {
    setSelectedCategory(category);
    if (styleId) setSelectedStyleId(styleId);
    scrollToUpload();
  };

  const selectPlanAndScroll = (plan: "starter" | "pro" | "ultimate") => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("tripshot_select_plan", { detail: plan }));
    }
    scrollToUpload();
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-[10%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-sky-300/30 via-indigo-200/20 to-amber-200/20 blur-3xl opacity-80 animate-pulse" />
        <div className="absolute top-[25%] right-[5%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-orange-200/30 to-emerald-200/20 blur-3xl opacity-70" />
        <div className="absolute bottom-[10%] left-[15%] w-[750px] h-[750px] rounded-full bg-gradient-to-tr from-sky-200/40 via-purple-200/20 to-indigo-200/20 blur-3xl opacity-60" />
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/95 backdrop-blur-xl shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-2">
          <div
            className="flex items-center gap-1.5 cursor-pointer shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="font-extrabold text-lg sm:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 font-outfit hover:opacity-90 transition-opacity">
              TripShot.world
            </span>
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-sky-500 animate-ping hidden sm:inline-block" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-extrabold text-slate-600">
            <a
              href="#destinations"
              className="hover:text-sky-600 transition-colors py-1 hover:border-b-2 border-sky-500"
            >
              {t.navDestinations}
            </a>
            <a
              href="#value-prop"
              className="hover:text-sky-600 transition-colors py-1 hover:border-b-2 border-sky-500"
            >
              {t.navWhy}
            </a>
            <a
              href="#how-it-works"
              className="hover:text-sky-600 transition-colors py-1 hover:border-b-2 border-sky-500"
            >
              {t.navHowItWorks}
            </a>
            <a
              href="#pricing"
              className="hover:text-sky-600 transition-colors py-1 hover:border-b-2 border-sky-500"
            >
              {t.navPricing}
            </a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. Green Coupon Button */}
            <button
              type="button"
              onClick={() => setIsCouponOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-[11px] sm:text-xs font-black px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full transition-all shadow-xs flex items-center gap-1 whitespace-nowrap cursor-pointer border border-emerald-400/50"
              title={lang === "ko" ? "무료 쿠폰 등록" : "Redeem Coupon"}
            >
              <span>🎟️</span>
              <span>{lang === "ko" ? "쿠폰" : "Coupon"}</span>
            </button>

            {/* 2. Blue/Purple Gradient Login/Account Button */}
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:brightness-110 active:scale-95 text-white text-[11px] sm:text-xs font-black px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full transition-all shadow-xs flex items-center gap-1 whitespace-nowrap cursor-pointer"
              title={userProfile ? userProfile.displayName || "My Account" : (lang === "ko" ? "로그인 및 기기 동기화" : "Sign In")}
            >
              <span>👤</span>
              <span className="max-w-[70px] sm:max-w-[120px] truncate">
                {userProfile ? (userProfile.displayName || (lang === "ko" ? "내 계정" : "Account")) : (lang === "ko" ? "로그인" : "Sign In")}
              </span>
            </button>

            {/* 3. Dark Create Photo Button */}
            <button
              type="button"
              onClick={scrollToUpload}
              className="bg-slate-900 hover:bg-sky-600 active:scale-95 text-white text-[11px] sm:text-xs font-extrabold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all shadow-md flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>⚡</span>
              <span>{lang === "ko" ? "만들기" : "Create"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 px-6 max-w-7xl mx-auto text-center">
        {/* Global Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-100/90 text-amber-900 border border-amber-300 shadow-sm hover:scale-105 transition-transform cursor-default">
            {t.badgeExtreme}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-100/90 text-sky-800 border border-sky-300 shadow-sm hover:scale-105 transition-transform cursor-default">
            {t.badgeGlobal}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-300 shadow-sm hover:scale-105 transition-transform cursor-default">
            {t.badgeSafe}
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.28] sm:leading-[1.2] mb-5 max-w-4xl mx-auto keep-all px-2 break-keep">
          {t.heroHeadlineLine1}{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-sky-600 to-indigo-600 inline-block">
            {t.heroHeadlineLine2}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xs sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-medium mb-8 leading-relaxed keep-all px-4 break-keep">
          {t.heroSub}
        </p>

        {/* Category chips - Mobile Touch Horizontal Scroll & Desktop Centered Wrap */}
        <div className="w-full mb-8 sm:mb-10">
          <div className="flex sm:flex-wrap items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-2 px-2 -mx-4 sm:mx-0 touch-pan-x">
            {CATEGORIES.map((cat) => {
              const catLabel =
                cat.id === "extreme"
                  ? t.tabExtreme
                  : cat.id === "travel"
                  ? t.tabTravel
                  : cat.id === "custom_travel"
                  ? t.tabCustomTravel
                  : cat.id === "business"
                  ? t.tabBusiness
                  : cat.id === "id_photo"
                  ? t.tabIdPhoto
                  : cat.id === "concept"
                  ? t.tabConcept
                  : t.tabCustomStudio;

              return (
                <button
                  key={cat.id}
                  onClick={() => selectStyleAndScroll(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold border shadow-xs transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-transparent shadow-md shadow-sky-500/25 scale-105"
                      : "bg-white/95 hover:bg-sky-50 text-slate-700 hover:text-sky-600 border-slate-200/90 hover:border-sky-300"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{catLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary CTA button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToUpload}
            className="w-full sm:w-auto bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 hover:opacity-95 text-white font-extrabold text-sm sm:text-base px-8 py-3.5 sm:px-9 sm:py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-sky-600/30 hover:shadow-sky-600/45 active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            {t.ctaMakeMyPhotoFree}
          </button>
        </div>
      </section>

      {/* Main Upload Studio Section (Workstation-First: Zero-Scroll to Action) */}
      <section id="upload-section" className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <UploadCard initialCategory={selectedCategory} initialStyleId={selectedStyleId} />
      </section>

      {/* How It Works Section - Ultra-Compact Mobile 1-Line Flow */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between gap-1 sm:gap-3 text-center">
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-sky-100 text-sky-600 font-black text-[11px] sm:text-xs flex items-center justify-center">1</span>
              <span className="font-extrabold text-[11px] sm:text-sm text-slate-800 leading-tight">{t.step1Title}</span>
            </div>
            <span className="text-slate-300 font-bold text-xs sm:text-base">➔</span>
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-indigo-100 text-indigo-600 font-black text-[11px] sm:text-xs flex items-center justify-center">2</span>
              <span className="font-extrabold text-[11px] sm:text-sm text-slate-800 leading-tight">{t.step2Title}</span>
            </div>
            <span className="text-slate-300 font-bold text-xs sm:text-base">➔</span>
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-amber-100 text-amber-600 font-black text-[11px] sm:text-xs flex items-center justify-center">3</span>
              <span className="font-extrabold text-[11px] sm:text-sm text-slate-800 leading-tight">{t.step3Title}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destination Cards Grid */}
      <section id="destinations" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 keep-all break-keep">
            {t.destSectionTitle}
          </h2>
          <p className="text-slate-500 text-xs sm:text-base keep-all break-keep">
            {t.destSectionSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STYLES.filter((s) => s.category === "extreme" || s.category === "travel")
            .slice(0, 8)
            .map((style) => {
              let bgImage = style.imageUrl || STYLE_PREVIEWS[style.id] || STYLE_PREVIEWS.trolltunga;
              if (bgImage && !bgImage.includes("v=99.0")) {
                bgImage = bgImage.includes("?") ? `${bgImage}&v=99.0` : `${bgImage}?v=99.0`;
              }
              const trans = getTranslatedStyleInfo(style.id, style.label, style.description, lang);

              return (
                <div
                  key={style.id}
                  onClick={() =>
                    selectStyleAndScroll(
                      style.category === "extreme" ? "extreme" : "travel",
                      style.id
                    )
                  }
                  className="group bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-sky-400 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* High Quality Photo Banner */}
                    <div className="w-full h-40 sm:h-44 rounded-2xl overflow-hidden relative mb-3 sm:mb-3.5 shadow-sm bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bgImage}
                        alt={trans.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span>{style.emoji}</span>
                        <span>{trans.label}</span>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">
                      {trans.label}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed keep-all break-keep">
                      {trans.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
                    <span>{t.ctaMakeMyPhoto}</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Value Proposition / Safety Section */}
      <section id="value-prop" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl">
            <span className="inline-block text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-sky-400 mb-2 sm:mb-3">
              {t.valueBadge}
            </span>
            <h2 className="text-xl sm:text-4xl font-black mb-3 sm:mb-4 leading-snug text-white keep-all break-keep">
              {t.valueTitleLine1} <br className="hidden sm:inline" />
              {t.valueTitleLine2}
            </h2>
            <p className="text-slate-200 text-xs sm:text-base leading-relaxed mb-6 sm:mb-8 font-medium keep-all break-keep">
              {t.valueSub}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left mt-4 sm:mt-6">
              <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-sky-400/40 shadow-xl flex flex-col justify-between">
                <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">🛡️</div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight">{t.valSafeTitle}</h4>
                  <p className="text-xs text-sky-200 font-bold mt-1 leading-snug keep-all break-keep">
                    {t.valSafeDesc}
                  </p>
                </div>
              </div>
              <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-amber-400/40 shadow-xl flex flex-col justify-between">
                <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">💸</div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight">{t.valFreeTitle}</h4>
                  <p className="text-xs text-amber-200 font-bold mt-1 leading-snug keep-all break-keep">
                    {t.valFreeDesc}
                  </p>
                </div>
              </div>
              <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-indigo-400/40 shadow-xl flex flex-col justify-between">
                <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">✨</div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight">{t.valFaceTitle}</h4>
                  <p className="text-xs text-indigo-200 font-bold mt-1 leading-snug keep-all break-keep">
                    {t.valFaceDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-sky-600 bg-sky-50 border border-sky-200 px-3.5 py-1 rounded-full mb-3">
            {t.pricingBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4 keep-all break-keep">
            {t.pricingTitle}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base keep-all break-keep">{t.pricingSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* 1. Starter Plan ($9) */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative">
            <div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {t.planStarterBadge}
              </span>
              <div className="mt-4 mb-2 flex items-baseline">
                <span className="text-4xl font-black text-slate-900">$9</span>
                <span className="text-slate-500 text-sm font-semibold ml-1.5">/ 20장</span>
              </div>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed keep-all break-keep">
                {t.planStarterDesc}
              </p>
              <ul className="space-y-3.5 text-xs text-slate-700 font-medium border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {t.planStarterF1}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {t.planStarterF2}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {t.planStarterF3}
                </li>
              </ul>
            </div>
            <button
              onClick={() => selectPlanAndScroll("starter")}
              className="w-full mt-8 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-2xl text-xs transition-colors active:scale-95 cursor-pointer"
            >
              {t.btnSelectPlan} ➔
            </button>
          </div>

          {/* 2. Pro Plan ($19) - Most Popular */}
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 border-2 border-sky-400 shadow-2xl flex flex-col justify-between relative transform md:-translate-y-3">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <span>{t.planProBadge}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-sky-400 bg-sky-950/80 border border-sky-800 px-3 py-1 rounded-full uppercase tracking-wider">
                {t.planProTitle}
              </span>
              <div className="mt-4 mb-2 flex items-baseline">
                <span className="text-4xl font-black text-white">$19</span>
                <span className="text-amber-300 text-sm font-black ml-1.5">/ 60장 (30% OFF)</span>
              </div>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed keep-all break-keep">
                {t.planProDesc}
              </p>
              <ul className="space-y-3.5 text-xs text-slate-200 font-medium border-t border-slate-800/80 pt-6">
                <li className="flex items-center gap-2">
                  <span className="text-sky-400 font-bold">✓</span> {t.planProF1}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-400 font-bold">✓</span> {t.planProF2}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-400 font-bold">✓</span> {t.planProF3}
                </li>
              </ul>
            </div>
            <button
              onClick={() => selectPlanAndScroll("pro")}
              className="w-full mt-8 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold py-4 rounded-2xl text-xs transition-all shadow-lg shadow-sky-500/25 active:scale-95 cursor-pointer"
            >
              {t.btnSelectPlan} ➔
            </button>
          </div>

          {/* 3. Ultimate Plan ($39) */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative">
            <div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {t.planUltimateBadge}
              </span>
              <div className="mt-4 mb-2 flex items-baseline">
                <span className="text-4xl font-black text-slate-900">$39</span>
                <span className="text-indigo-600 text-sm font-black ml-1.5">/ 150장 (42% OFF)</span>
              </div>

              <p className="text-xs text-slate-500 mb-6 leading-relaxed keep-all break-keep">
                {t.planUltimateDesc}
              </p>
              <ul className="space-y-3.5 text-xs text-slate-700 font-medium border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600 font-bold">✓</span> {t.planUltimateF1}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600 font-bold">✓</span> {t.planUltimateF2}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600 font-bold">✓</span> {t.planUltimateF3}
                </li>
              </ul>
            </div>
            <button
              onClick={() => selectPlanAndScroll("ultimate")}
              className="w-full mt-8 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3.5 rounded-2xl text-xs transition-colors active:scale-95 cursor-pointer"
            >
              {t.btnSelectPlan} ➔
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-bold text-sm text-slate-800">
            TripShot.world — Safe & Stunning Travel AI
          </div>
          <p>© 2026 TripShot.world. All rights reserved. ✈️ Global Travel & Portrait Series.</p>
        </div>
      </footer>

      {/* Coupon Modal */}
      <CouponModal
        isOpen={isCouponOpen}
        onClose={() => setIsCouponOpen(false)}
        lang={lang}
        onApplyCoupon={(addedCredits) => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("tripshot_add_credits", { detail: addedCredits })
            );
          }
          scrollToUpload();
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        lang={lang}
        onSuccess={(profile) => {
          setUserProfile(profile);
          if (typeof window !== "undefined") {
            localStorage.setItem("tripshot_user", JSON.stringify(profile));
          }
        }}
      />
    </div>
  );
}
