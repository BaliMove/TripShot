"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import UploadCard from "./components/UploadCard";
import { CATEGORIES, STYLES, type CategoryId } from "./lib/styles";
import { detectUserDeviceAndLang, TRANSLATIONS, type Language } from "./lib/i18n";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("extreme");
  const [selectedStyleId, setSelectedStyleId] = useState<string>("trolltunga");
  const [lang, setLang] = useState<Language>("ko");

  useEffect(() => {
    const { lang: detectedLang } = detectUserDeviceAndLang();
    setLang(detectedLang);
  }, []);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

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
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-xl shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 font-outfit hover:opacity-90 transition-opacity">
              TripShot.world
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500 animate-ping" />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#destinations" className="hover:text-sky-600 transition-colors py-1 hover:border-b-2 border-sky-500">{t.navDestinations}</a>
            <a href="#value-prop" className="hover:text-sky-600 transition-colors py-1 hover:border-b-2 border-sky-500">{t.navWhy}</a>
            <a href="#how-it-works" className="hover:text-sky-600 transition-colors py-1 hover:border-b-2 border-sky-500">{t.navHowItWorks}</a>
            <a href="#pricing" className="hover:text-sky-600 transition-colors py-1 hover:border-b-2 border-sky-500">{t.navPricing}</a>
          </nav>
          <div>
            <button
              onClick={scrollToUpload}
              className="bg-slate-900 hover:bg-sky-600 text-white text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-slate-950/10 active:scale-95 flex items-center gap-1.5"
            >
              <span>{t.ctaMakeMyPhoto}</span>
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
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.18] mb-6 max-w-4xl mx-auto text-balance">
          {t.heroHeadlineLine1}<br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-sky-600 to-indigo-600">
            {t.heroHeadlineLine2}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium mb-9 leading-relaxed text-balance">
          {t.heroSub}
        </p>

        {/* Category chips */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => selectStyleAndScroll(cat.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold border shadow-sm transition-all duration-200 active:scale-95 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-transparent shadow-lg shadow-sky-500/25 scale-105"
                  : "bg-white/90 hover:bg-sky-50 text-slate-700 hover:text-sky-600 border-slate-200/90 hover:border-sky-300"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Primary CTA button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToUpload}
            className="w-full sm:w-auto bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 hover:opacity-95 text-white font-extrabold text-base px-9 py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-sky-600/30 hover:shadow-sky-600/45 active:scale-95 flex items-center justify-center gap-2"
          >
            ✈️ 내 인생샷 생성하기 (무료 2회)
          </button>
        </div>
      </section>

      {/* Featured Destination Cards Grid (Phase 1) */}
      <section id="destinations" className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            🌍 대표 명소 카테고리
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            클릭 한 번으로 인도네시아 발리, 보로부두르 사원부터 파리 에펠탑까지 이동하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STYLES.filter((s) => s.category === "travel").map((style) => (
            <div
              key={style.id}
              onClick={() => selectStyleAndScroll("travel", style.id)}
              className="group relative bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-100 to-amber-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  {style.emoji}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">
                  {style.label}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {style.description}
                </p>
              </div>
              <div className="inline-flex items-center text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
                이 배경 선택하기 →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition Highlights */}
      <section id="value-prop" className="max-w-7xl mx-auto px-6 py-12 my-6">
        <div className="bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-sky-400 mb-3">
              SAFE & STUNNING
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mb-4 leading-snug">
              위험한 촬영은 그만! <br />
              100% 안전하게 만드는 나만의 명소 화보
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              위험천만한 절벽 스윙이나 통제 구역에 들어가는 리스크 없이, AI 기술로 내 인물 특징은 그대로 보존하면서 가장 아름다운 명소의 햇살과 배경을 완벽하게 드레스업해드립니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl mb-1">🛡️</div>
                <h4 className="font-bold text-sm text-white">100% 안전함</h4>
                <p className="text-xs text-slate-400 mt-1">위험 지대 방문 필요 없이 안심 제작</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl mb-1">💸</div>
                <h4 className="font-bold text-sm text-white">여행 경비 0원</h4>
                <p className="text-xs text-slate-400 mt-1">비행기 표 값 없이 방구석 10초 완성</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl mb-1">✨</div>
                <h4 className="font-bold text-sm text-white">얼굴 ID 유지</h4>
                <p className="text-xs text-slate-400 mt-1">나의 실제 얼굴 특징을 완벽히 유지</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-sky-600 bg-sky-50 border border-sky-200 px-3.5 py-1 rounded-full mb-3">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            10초 완성 이용 방법 3단계
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            셀카 한 장 업로드부터 맞춤 화보 완성까지 세 단계만 거치세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 font-black text-xl flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">사진 업로드</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              얼굴이 또렷하게 나온 셀카나 전신 사진 1장을 업로드합니다.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 font-black text-xl flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">명소 & 컨셉 선택</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              세계 명소, 익스트림 스윙, 비즈니스 정장 중 원하는 템플릿을 클릭합니다.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 font-black text-xl flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">10초 완성 & 소장</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI가 이목구비 핏을 100% 보존한 고화질 화보를 즉시 완성합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Main Upload Section */}
      <section id="upload-section" className="max-w-5xl mx-auto px-6 py-12">
        <UploadCard
          initialCategory={selectedCategory}
          initialStyleId={selectedStyleId}
        />
      </section>

      {/* Pricing Comparison Section (Placed at the very bottom) */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-sky-600 bg-sky-50 border border-sky-200 px-3.5 py-1 rounded-full mb-3">
            PRICING PLANS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            나에게 딱 맞는 AI 화보 요금제 선택하기
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            부담 없는 단발성 촬영부터 고화질 4K 상업용 수트·명소 화보 패스까지 합리적인 비용으로 소장하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* 1. Starter Plan ($9) */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative">
            <div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Starter (단건 패스)
              </span>
              <div className="mt-4 mb-2 flex items-baseline">
                <span className="text-4xl font-black text-slate-900">$9</span>
                <span className="text-slate-500 text-sm font-semibold ml-1.5">/ 1회성 결제</span>
              </div>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                단발성 체험 & 라이트 유저용. 미용실·여행 전 10장으로 바로 소장하세요.
              </p>
              <ul className="space-y-3.5 text-xs text-slate-700 font-medium border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> ⚡ AI 명소/정장 화보 10장
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> 기본 인물 핏 진단 (얼굴 비율 보존)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> 기본 3컬러 배경 (단색 선택)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> HD (1080p) 고화질 다운로드
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span>-</span> 일반 대기열 (약 30초 소요)
                </li>
              </ul>
            </div>
            <button
              onClick={() => selectPlanAndScroll("starter")}
              className="w-full mt-8 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-2xl text-xs transition-colors active:scale-95 cursor-pointer"
            >
              Starter 패스 시작하기 ➔
            </button>
          </div>

          {/* 2. Pro Plan ($19) - ⭐ Most Popular */}
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 border-2 border-sky-400 shadow-2xl flex flex-col justify-between relative transform md:-translate-y-3">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <span>⭐ MOST POPULAR (추천)</span>
            </div>
            <div>
              <span className="text-xs font-bold text-sky-400 bg-sky-950/80 border border-sky-800 px-3 py-1 rounded-full uppercase tracking-wider">
                Pro (월간 프로 패스)
              </span>
              <div className="mt-4 mb-2 flex items-baseline">
                <span className="text-4xl font-black text-white">$19</span>
                <span className="text-slate-400 text-sm font-semibold ml-1.5">/ 월</span>
              </div>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                주력 수익 모델! 다양한 명소/정장/증명 템플릿으로 베스트 룩을 완성하세요.
              </p>
              <ul className="space-y-3.5 text-xs text-slate-200 font-medium border-t border-slate-800/80 pt-6">
                <li className="flex items-center gap-2">
                  <span className="text-sky-400">✓</span> ⚡ AI 화보 30장 / 월 (3배 기회)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-400">✓</span> 정밀 얼굴 ID 분석 (윤곽 & 90% 닮은꼴)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-400">✓</span> 전체 스튜디오 배경 슬라이더
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-400">✓</span> Full HD (2K) 고화질 화보 소장
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-400">✓</span> Before/After 비포애프터 비교 뷰어
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-400">✓</span> 우선 대기열 (약 15초 패스트트랙)
                </li>
              </ul>
            </div>
            <button
              onClick={() => selectPlanAndScroll("pro")}
              className="w-full mt-8 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold py-4 rounded-2xl text-xs transition-all shadow-lg shadow-sky-500/25 active:scale-95 cursor-pointer"
            >
              ⭐ Pro 프로 패스 선택하기 ➔
            </button>
          </div>

          {/* 3. Ultimate Plan ($29) */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative">
            <div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Ultimate (스튜디오 VIP)
              </span>
              <div className="mt-4 mb-2 flex items-baseline">
                <span className="text-4xl font-black text-slate-900">$29</span>
                <span className="text-slate-500 text-sm font-semibold ml-1.5">/ 월</span>
              </div>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                SNS 프로필, AI 헤드샷, 상업용 마케팅 고화질 소장이 필요한 전문가용.
              </p>
              <ul className="space-y-3.5 text-xs text-slate-700 font-medium border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600">✓</span> ⚡ AI 화보 100장 / 월
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600">✓</span> 정밀 분석 + 퍼스널 톤 진단
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600">✓</span> Ultra HD (4K 초고화질)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600">✓</span> 워터마크 100% 완전 제거
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600">✓</span> 상업적 라이선스 & 활용 권한
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600">✓</span> 최우선 초고속 패스트트랙 (수초 내)
                </li>
              </ul>
            </div>
            <button
              onClick={() => selectPlanAndScroll("ultimate")}
              className="w-full mt-8 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3.5 rounded-2xl text-xs transition-colors active:scale-95 cursor-pointer"
            >
              Ultimate VIP 시작하기 ➔
            </button>
          </div>
        </div>
      </section>

      {/* Footer (Phase 1) */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-bold text-sm text-slate-800">
            TripShot.world — Safe & Stunning Travel AI
          </div>
          <p>© 2026 TripShot.world. All rights reserved. ✈️ JalanJalan Indah Series.</p>
        </div>
      </footer>
    </div>
  );
}
