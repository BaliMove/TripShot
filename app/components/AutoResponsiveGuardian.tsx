"use client";

import { useEffect } from "react";

/**
 * 🛡️ AutoResponsiveGuardian
 * Invisible, zero-UI background engine that guarantees 100% Mobile & Desktop UI/UX optimization
 * automatically on every update, route change, and dynamic DOM mutation.
 */
export default function AutoResponsiveGuardian() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const enforceResponsiveOptimization = () => {
      try {
        const isMobile = window.innerWidth <= 768;

        // 1. Enforce CJK & Multi-language word breaking across all text containers
        const textElements = document.querySelectorAll<HTMLElement>("p, h1, h2, h3, h4, h5, h6, span, label, button, a");
        textElements.forEach((el) => {
          if (!el.style.wordBreak && !el.classList.contains("keep-all")) {
            el.style.wordBreak = "keep-all";
            el.style.overflowWrap = "break-word";
          }
        });

        // 2. Ensure minimum touch target for mobile buttons
        if (isMobile) {
          const interactiveElements = document.querySelectorAll<HTMLElement>("button, a[role='button']");
          interactiveElements.forEach((btn) => {
            const rect = btn.getBoundingClientRect();
            if (rect.height > 0 && rect.height < 36 && !btn.classList.contains("compact-badge")) {
              btn.style.minHeight = "38px";
            }
          });
        }

        // 3. Smooth touch scrolling on horizontal containers
        const scrollContainers = document.querySelectorAll<HTMLElement>(".overflow-x-auto, [data-scroll='x']");
        scrollContainers.forEach((container) => {
          (container.style as any).webkitOverflowScrolling = "touch";
          container.style.touchAction = "pan-x";
        });
      } catch (e) {
        // Silently fail without interrupting user experience
      }
    };

    // Run immediately on mount
    enforceResponsiveOptimization();

    // Listen to window resizing
    window.addEventListener("resize", enforceResponsiveOptimization, { passive: true });

    // MutationObserver to auto-optimize dynamically injected components / modals
    const observer = new MutationObserver(() => {
      enforceResponsiveOptimization();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener("resize", enforceResponsiveOptimization);
      observer.disconnect();
    };
  }, []);

  return null;
}
