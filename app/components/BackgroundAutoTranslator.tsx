"use client";

import { useEffect } from "react";
import { detectUserDeviceAndLang } from "../lib/i18n";
import { autoTranslateText } from "../lib/autoTranslate";

/**
 * 100% Invisible Background Auto-Translator.
 * Renders NOTHING to the UI (return null).
 * Continuously and silently translates any hardcoded Korean text in the DOM
 * into the user's detected system language without needing manual hooks or markup.
 */
export default function BackgroundAutoTranslator() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const { lang } = detectUserDeviceAndLang();
    // If user is Korean native, no translation is needed
    if (lang === "ko") return;

    const koreanRegex = /[\u3131-\uD79D]/;

    const translateNode = (node: Node) => {
      // 1. Text node translation
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (text && koreanRegex.test(text)) {
          const translated = autoTranslateText(text, lang);
          if (translated !== text) {
            node.textContent = translated;
          }
        }
      }

      // 2. Element attributes translation (placeholder, title, aria-label, alt)
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;

        // Skip script and style tags
        if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName)) return;

        const attrs = ["placeholder", "title", "aria-label", "alt"];
        for (const attr of attrs) {
          const val = el.getAttribute(attr);
          if (val && koreanRegex.test(val)) {
            const translated = autoTranslateText(val, lang);
            if (translated !== val) {
              el.setAttribute(attr, translated);
            }
          }
        }

        // Recursively translate child nodes
        node.childNodes.forEach(translateNode);
      }
    };

    // Initial pass on current DOM
    translateNode(document.body);

    // Dynamic pass with MutationObserver whenever DOM updates or new components mount
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach(translateNode);
        } else if (mutation.type === "characterData") {
          translateNode(mutation.target);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Completely invisible: renders zero UI elements
  return null;
}
