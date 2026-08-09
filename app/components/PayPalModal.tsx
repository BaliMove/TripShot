"use client";

import { useEffect, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

export type PlanType = "starter" | "pro" | "ultimate";

export interface PlanDetail {
  id: PlanType;
  name: string;
  price: string;
  amount: number;
  credits: number;
  badge: string;
  description: string;
}

export const PLAN_DETAILS: Record<PlanType, PlanDetail> = {
  starter: {
    id: "starter",
    name: "Starter 패스",
    price: "$9",
    amount: 9.0,
    credits: 10,
    badge: "⚡ 10회 생성",
    description: "인생샷 10장 생성 권한 (HD 고화질 소장)",
  },
  pro: {
    id: "pro",
    name: "Pro 프로 패스",
    price: "$19",
    amount: 19.0,
    credits: 30,
    badge: "⭐ MOST POPULAR (30회)",
    description: "월 30장 생성 & Full HD(2K) 무제한 스튜디오 혜택",
  },
  ultimate: {
    id: "ultimate",
    name: "Ultimate VIP 패스",
    price: "$39",
    amount: 39.0,
    credits: 100,
    badge: "👑 VIP (100회)",
    description: "월 100장 생성 & 4K Ultra HD + 워터마크 100% 제거",
  },

};

interface PayPalModalProps {
  isOpen: boolean;
  selectedPlan: PlanType;
  onClose: () => void;
  onSuccess: (plan: PlanType, addedCredits: number) => void;
}

export default function PayPalModal({
  isOpen,
  selectedPlan,
  onClose,
  onSuccess,
}: PayPalModalProps) {
  const [activePlanId, setActivePlanId] = useState<PlanType>(selectedPlan || "pro");
  const [clientId, setClientId] = useState<string>("test");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setActivePlanId(selectedPlan || "pro");
  }, [selectedPlan]);

  const plan = PLAN_DETAILS[activePlanId] || PLAN_DETAILS.pro;

  useEffect(() => {
    const envClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (envClientId && envClientId.trim() !== "") {
      setClientId(envClientId.trim());
    } else {
      setClientId("BAAr--XBdO4SPPkUXFsYm1Ju6TNQytwLlgHwdDd_r17OCZxc9L1Xqob1YiYfhC3Ibq7Ua2Qf8PXVkKsD4s");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <PayPalScriptProvider options={{ clientId: clientId, currency: "USD" }}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden min-h-full w-full">
        <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-100 text-slate-900 max-h-[92vh] overflow-y-auto">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>

          {/* Title Header */}
          <div className="text-center mb-4">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full mb-1.5">
              💳 SECURE CHECKOUT
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AI 화보 요금제 결제
            </h3>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">
              원하시는 플랜 탭을 클릭하시면 요금이 즉시 변경됩니다.
            </p>
          </div>

          {/* Interactive Plan Selector Tabs (3 Plans inside modal) */}
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

          {/* Selected Plan Summary Card - Clean & Beautiful Typography */}
          <div className="bg-sky-50/60 rounded-2xl p-4 border border-sky-100 mb-4">
            <div className="flex flex-col gap-1.5 mb-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-block text-[11px] font-extrabold text-sky-700 bg-white border border-sky-200 px-2.5 py-0.5 rounded-md shadow-sm">
                  {plan.badge}
                </span>
                <span className="text-2xl font-black text-sky-600 tracking-tight">
                  {plan.price} <span className="text-xs text-slate-400 font-bold">USD</span>
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900 tracking-tight">
                {plan.name}
              </h4>
            </div>

            <div className="border-t border-sky-200/70 pt-2.5">
              <p className="text-xs text-slate-700 font-semibold leading-relaxed keep-all flex items-start gap-1.5">
                <span className="text-sky-600 font-bold shrink-0">✓</span>
                <span>{plan.description}</span>
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
                  purchase_units: [
                    {
                      description: `TripShot.world ${plan.name} (${plan.credits} credits)`,
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
                  const message = err instanceof Error ? err.message : "결제 승인 중 오류가 발생했습니다.";
                  setErrorMsg(message);
                }
              }}
              onError={() => {
                setLoading(false);
                setErrorMsg("PayPal 결제 과정에서 오류가 발생했습니다. Sandbox 또는 Client ID를 확인해 주세요.");
              }}
              onCancel={() => {
                setLoading(false);
              }}
            />
            {loading && <p className="text-center text-xs text-sky-600 font-bold mt-1">결제 승인 처리 중입니다...</p>}
          </div>
        </div>
      </div>
    </PayPalScriptProvider>


  );
}

