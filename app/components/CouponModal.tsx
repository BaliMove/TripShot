"use client";

import { useState } from "react";
import { TRANSLATIONS, type Language } from "../lib/i18n";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (addedCredits: number, couponCode: string) => void;
  lang?: Language;
}

// Valid Coupon Codes dictionary (Code -> Added Credits)
const VALID_COUPONS: Record<string, number> = {
  TRIP30: 30,
  TRIP7DAY: 30,
  BETA30: 30,
  VIP30: 30,
  PROSHOT30: 30,
};

export default function CouponModal({
  isOpen,
  onClose,
  onApplyCoupon,
  lang = "en",
}: CouponModalProps) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      setMessage({ text: t.couponErrorEmpty, type: "error" });
      return;
    }

    const addedCredits = VALID_COUPONS[cleanCode];
    if (!addedCredits) {
      setMessage({ text: t.couponErrorInvalid, type: "error" });
      return;
    }

    // Save used state for tracking
    const usedCoupons = JSON.parse(localStorage.getItem("tripshot_used_coupons") || "[]");
    if (!usedCoupons.includes(cleanCode)) {
      usedCoupons.push(cleanCode);
      localStorage.setItem("tripshot_used_coupons", JSON.stringify(usedCoupons));
    }

    setMessage({ text: t.couponSuccess, type: "success" });

    setTimeout(() => {
      onApplyCoupon(addedCredits, cleanCode);
      setCode("");
      setMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-5">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-1.5">
            {t.couponBadge}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t.couponTitle}
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-medium keep-all break-keep">
            {t.couponSub}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              {t.couponCodeLabel}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t.couponPlaceholder}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-extrabold tracking-widest text-center text-lg uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal placeholder:text-xs"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-2xl text-xs font-bold text-center leading-relaxed ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            {t.couponBtnApply}
          </button>
        </form>
      </div>
    </div>
  );
}
