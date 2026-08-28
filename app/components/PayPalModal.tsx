"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { TRANSLATIONS, type Language } from "../lib/i18n";

export type PlanType = "starter" | "pro" | "ultimate";

export interface PlanDetail {
  id: PlanType;
  price: string;
  amount: number;
  credits: number;
}

export const PLAN_CONFIGS: Record<PlanType, PlanDetail> = {
  starter: {
    id: "starter",
    price: "$9",
    amount: 9.0,
    credits: 20,
  },
  pro: {
    id: "pro",
    price: "$19",
    amount: 19.0,
    credits: 60,
  },
  ultimate: {
    id: "ultimate",
    price: "$39",
    amount: 39.0,
    credits: 150,
  },
};

interface PayPalModalProps {
  isOpen: boolean;
  selectedPlan: PlanType;
  onClose: () => void;
  onSuccess: (plan: PlanType, addedCredits: number) => void;
  lang?: Language;
}

export default function PayPalModal({
  isOpen,
  selectedPlan = "pro",
  onClose,
  onSuccess,
  lang = "en",
}: PayPalModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activePlanId, setActivePlanId] = useState<PlanType>(selectedPlan || "pro");
  const [clientId, setClientId] = useState<string>("BAAVC61J6p-md2v0ElszUbjgrht0I_PYG7g1VrTdOluuFE5T6IWv1wElF3fNSGUWfsh-5fSJ9LcNRzSjTk");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActivePlanId(selectedPlan || "pro");
  }, [selectedPlan]);

  const plan = PLAN_CONFIGS[activePlanId] || PLAN_CONFIGS.pro;

  const planName =
    activePlanId === "starter"
      ? t.planStarterTitle
      : activePlanId === "pro"
      ? t.planProTitle
      : t.planUltimateTitle;

  const planBadge =
    activePlanId === "starter"
      ? t.planStarterBadge
      : activePlanId === "pro"
      ? t.planProBadge
      : t.planUltimateBadge;

  const planDesc =
    activePlanId === "starter"
      ? t.planStarterDesc
      : activePlanId === "pro"
      ? t.planProDesc
      : t.planUltimateDesc;

  useEffect(() => {
    const envClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (envClientId && envClientId.trim() !== "") {
      setClientId(envClientId.trim());
    } else {
      setClientId("BAAVC61J6p-md2v0ElszUbjgrht0I_PYG7g1VrTdOluuFE5T6IWv1wElF3fNSGUWfsh-5fSJ9LcNRzSjTk");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, onClose]);

  const paypalLocaleMap: Record<Language, string> = {
    ko: "ko_KR",
    en: "en_US",
    ja: "ja_JP",
    zh: "zh_CN",
    id: "id_ID",
  };

  const currentPaypalLocale = paypalLocaleMap[lang] || "en_US";

  const modalContent = (
    <PayPalScriptProvider options={{ clientId: clientId, currency: "USD", intent: "capture", locale: currentPaypalLocale }}>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto w-full h-full animate-fadeIn"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-100 text-slate-900 my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Mobile-First Enhanced Close Button (min 44px touch target) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 text-slate-500 hover:text-slate-900 active:scale-90 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100/90 hover:bg-slate-200 shadow-sm flex items-center justify-center font-black text-base transition-all cursor-pointer touch-manipulation"
            aria-label={lang === "ko" ? "결제창 닫기" : "Close Payment Modal"}
          >
            ✕
          </button>

          {/* Title Header with Safe Right Padding */}
          <div className="text-center mb-4 pr-10 pl-2">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full mb-1.5">
              💳 {t.paySecureNotice}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.payTitle}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5 font-medium keep-all break-keep">
              {t.paySub}
            </p>
          </div>

          {/* Interactive Plan Selector Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 mb-4">
            <button
              type="button"
              onClick={() => setActivePlanId("starter")}
              className={`py-2 px-1.5 rounded-xl text-center transition-all cursor-pointer ${
                activePlanId === "starter"
                  ? "bg-white text-sky-700 font-extrabold shadow-md scale-[1.02] border border-sky-200"
                  : "text-slate-500 hover:text-slate-800 font-semibold"
              }`}
            >
              <span className="block text-[11px] font-black">Starter</span>
              <span className="block text-xs font-black text-slate-900">$9</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePlanId("pro")}
              className={`py-2 px-1.5 rounded-xl text-center transition-all cursor-pointer ${
                activePlanId === "pro"
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-black shadow-md scale-[1.02]"
                  : "text-slate-500 hover:text-slate-800 font-semibold"
              }`}
            >
              <span className="block text-[11px] font-black">⭐ Pro</span>
              <span className="block text-xs font-black">$19</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePlanId("ultimate")}
              className={`py-2 px-1.5 rounded-xl text-center transition-all cursor-pointer ${
                activePlanId === "ultimate"
                  ? "bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-black shadow-md scale-[1.02]"
                  : "text-slate-500 hover:text-slate-800 font-semibold"
              }`}
            >
              <span className="block text-[11px] font-black">👑 Ultimate</span>
              <span className="block text-xs font-black">$39</span>
            </button>
          </div>

          {/* Selected Plan Summary Card */}
          <div className="bg-sky-50/60 rounded-2xl p-4 border border-sky-100 mb-4">
            <div className="flex flex-col gap-1.5 mb-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-block text-[11px] font-extrabold text-sky-700 bg-white border border-sky-200 px-2.5 py-0.5 rounded-md shadow-sm">
                  {planBadge}
                </span>
                <span className="text-2xl font-black text-sky-600 tracking-tight">
                  {plan.price} <span className="text-xs text-slate-400 font-bold">USD</span>
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900 tracking-tight">
                {planName}
              </h4>
            </div>

            <div className="border-t border-sky-200/70 pt-2.5">
              <p className="text-xs text-slate-700 font-semibold leading-relaxed keep-all break-keep flex items-start gap-1.5">
                <span className="text-sky-600 font-bold shrink-0">✓</span>
                <span>{planDesc}</span>
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* PayPal Smart Payment Buttons */}
          <div className="mt-1 min-h-[130px] flex flex-col justify-center bg-slate-50/50 p-2 rounded-2xl border border-slate-200/70">
            <PayPalButtons
              style={{
                layout: "vertical",
                color: "gold",
                shape: "rect",
                label: "paypal",
              }}
              createOrder={(data, actions) => {
                setErrorMsg(null);
                setLoading(true);
                return actions.order.create({
                  intent: "CAPTURE",
                  application_context: {
                    shipping_preference: "NO_SHIPPING",
                    user_action: "PAY_NOW",
                    brand_name: "TripShot.world",
                  },
                  purchase_units: [
                    {
                      description: `TripShot.world ${planName} (${plan.credits} credits)`,
                      amount: {
                        currency_code: "USD",
                        value: plan.amount.toFixed(2),
                      },
                    },
                  ],
                });
              }}
              onApprove={async (_data, actions) => {
                try {
                  if (actions.order) {
                    await actions.order.capture();
                    setLoading(false);
                    onSuccess(plan.id, plan.credits);
                  }
                } catch (err: unknown) {
                  setLoading(false);
                  const message =
                    err instanceof Error
                      ? err.message
                      : lang === "ko"
                      ? "결제 승인 중 오류가 발생했습니다."
                      : "Payment approval failed.";
                  setErrorMsg(message);
                }
              }}
              onError={() => {
                setLoading(false);
                setErrorMsg(
                  lang === "ko"
                    ? "PayPal 결제 과정에서 오류가 발생했습니다."
                    : "An error occurred during PayPal checkout."
                );
              }}
              onCancel={() => {
                setLoading(false);
              }}
            />
            {loading && (
              <p className="text-center text-xs text-sky-600 font-bold mt-1">
                {lang === "ko" ? "결제 승인 처리 중입니다..." : "Processing payment..."}
              </p>
            )}
          </div>

          {/* Bottom Direct Close & Continue Creating Action */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col items-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation min-h-[44px]"
            >
              <span>✕</span>
              <span>{lang === "ko" ? "닫기 (사진 생성하러 가기)" : "Close & Continue Creating Photos"}</span>
            </button>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );

  if (typeof window === "undefined" || typeof document === "undefined" || !document.body) return null;
  return createPortal(modalContent, document.body);
}
