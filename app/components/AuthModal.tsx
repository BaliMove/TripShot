"use client";

import { useState, useEffect } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  marketingConsent: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfileData) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Prevent background scrolling on mobile when modal opens
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

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const profileData: UserProfileData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split("@")[0] || "TripShot 회원",
        photoURL: user.photoURL,
        marketingConsent: true,
      };

      onSuccess(profileData);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setError("구글 로그인 중 오류가 발생했습니다. 이메일 로그인을 이용해 보세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUpMode) {
        // Sign Up
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (name.trim()) {
          await updateProfile(userCred.user, { displayName: name.trim() });
        }
        const profileData: UserProfileData = {
          uid: userCred.user.uid,
          email: userCred.user.email,
          displayName: name.trim() || email.split("@")[0],
          photoURL: null,
          marketingConsent,
        };
        onSuccess(profileData);
      } else {
        // Sign In
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const profileData: UserProfileData = {
          uid: userCred.user.uid,
          email: userCred.user.email,
          displayName: userCred.user.displayName || email.split("@")[0],
          photoURL: userCred.user.photoURL,
          marketingConsent: true,
        };
        onSuccess(profileData);
      }
      onClose();
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("auth/user-not-found") || msg.includes("auth/wrong-password")) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (msg.includes("auth/email-already-in-use")) {
        setError("이미 가입된 이메일 주소입니다. 로그인을 진행해 주세요.");
      } else {
        setError("인증 과정에서 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden min-h-full w-full">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-100 text-slate-900 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Title Header - 간결하고 스마트하게 개편 */}
        <div className="text-center mb-5 pr-4">
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-sky-600 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full mb-1">
            📱 PC & 모바일 동기화
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {isSignUpMode ? "1초 회원가입" : "TripShot 로그인"}
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            로그인 시 구매하신 이용권 혜택이 모바일과 즉시 연동됩니다.
          </p>
        </div>

        {/* Google 1-Click Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm py-3.5 px-4 rounded-2xl border border-slate-200/90 shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2.5 mb-4 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google 계정으로 1초 로그인</span>
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-slate-200" />
          <span className="px-3 text-xs text-slate-400 font-bold">또는 이메일</span>
          <div className="flex-1 border-t border-slate-200" />
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Email Auth Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {isSignUpMode && (
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                이름 / 닉네임
              </label>
              <input
                type="text"
                placeholder="예: 홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              이메일 주소
            </label>
            <input
              type="email"
              required
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              required
              placeholder="비밀번호 6자리 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          {/* Marketing / Newsletter Consent Checkbox */}
          {isSignUpMode && (
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="marketingConsent"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
              <label htmlFor="marketingConsent" className="text-[11px] text-slate-500 font-medium leading-tight cursor-pointer">
                [선택] 신규 명소 화보 출시 소식 및 혜택 뉴스레터/이메일 수신에 동의합니다.
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs sm:text-sm py-4 px-4 rounded-2xl shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{isSignUpMode ? "✨ 1초 회원가입 완료하기" : "🚀 로그인하기"}</span>
            )}
          </button>
        </form>

        {/* Toggle Mode Button */}
        <div className="text-center mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setIsSignUpMode(!isSignUpMode);
              setError(null);
            }}
            className="text-xs font-bold text-sky-600 hover:text-indigo-600 transition-colors"
          >
            {isSignUpMode
              ? "이미 계정이 있으신가요? 로그인하기 ➔"
              : "처음 방문하셨나요? 1초 회원가입하기 ➔"}
          </button>
        </div>
      </div>
    </div>
  );
}
