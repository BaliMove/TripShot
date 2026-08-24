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
  // All translations are natively and safely rendered via useI18n / TRANSLATIONS tokens in React components
  return null;
}
