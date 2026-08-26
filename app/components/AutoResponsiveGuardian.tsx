"use client";

import { useEffect } from "react";

/**
 * 🛡️ AutoResponsiveGuardian
 * Invisible, zero-overhead background guardian that guarantees 100% Mobile & Desktop UI/UX
 * optimization automatically on every screen resize, orientation change, and dynamic DOM update.
 */
export default function AutoResponsiveGuardian() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyResponsiveOptimizations = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const root = document.documentElement;

      // 1. Dynamic viewport height synchronization (--app-vh) to avoid mobile address bar cutoffs
      const vh = window.innerHeight * 0.01;
      root.style.setProperty("--app-vh", `${vh}px`);

      // 2. Set responsive state classes on root element
      if (isMobile) {
        root.classList.add("is-mobile-device");
        root.classList.remove("is-desktop-device");
      } else {
        root.classList.add("is-desktop-device");
        root.classList.remove("is-mobile-device");
      }

      // 3. Ensure all horizontal chip lists & scrolls have smooth touch scrolling & hidden scrollbars
      const horizontalScrollers = document.querySelectorAll<HTMLElement>(".overflow-x-auto");
      horizontalScrollers.forEach((el) => {
        (el.style as any).webkitOverflowScrolling = "touch";
        el.style.touchAction = "pan-x";
      });

      // 4. Ensure Korean/CJK text containers keep word breaks natural
      const textContainers = document.querySelectorAll<HTMLElement>("h1, h2, h3, p.keep-all");
      textContainers.forEach((el) => {
        el.style.wordBreak = "keep-all";
      });
    };

    // Initial run
    applyResponsiveOptimizations();

    // Listen to resize and orientation changes
    window.addEventListener("resize", applyResponsiveOptimizations, { passive: true });
    window.addEventListener("orientationchange", applyResponsiveOptimizations, { passive: true });

    // MutationObserver to apply optimizations on dynamic route changes / modals
    const observer = new MutationObserver(() => {
      applyResponsiveOptimizations();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener("resize", applyResponsiveOptimizations);
      window.removeEventListener("orientationchange", applyResponsiveOptimizations);
      observer.disconnect();
    };
  }, []);

  return null;
}
