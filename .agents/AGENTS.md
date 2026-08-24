# Project Specific Rules & Guidelines

## 1. Global Multi-Language Auto-Detection & Zero-Korean Architecture
- **Automatic Language & Device Detection**: Always detect the user's device (Mobile/Desktop) and system language (`navigator.language`) automatically (`ko`, `en`, `ja`, `zh`, `id`) with 100% natural English fallback for international users.
- **No Manual Language Selector**: Never display a manual language selector dropdown or button in the UI. All translations must switch seamlessly and automatically based on user environment.
- **Automated i18n Synchronization on All Future Updates**:
  - **No Hardcoded Korean in UI Components**: Every new UI component, modal, banner, button, toast, or text modification MUST use `t.<token>` from `app/lib/i18n.ts` or the `useI18n()` hook.
  - **Adding New Text Tokens**: When introducing new features or text, add the new token to all 5 language dictionaries (`ko`, `en`, `ja`, `zh`, `id`) in `app/lib/i18n.ts` under the strict `Translation` interface.
  - **Adding New Landmark Styles**: When adding new styles to `app/lib/styles.ts`, always add the corresponding localized title & description into `STYLE_TRANSLATIONS` in `app/lib/i18n.ts`.
  - **Safe Dynamic Fallback**: `getTranslatedStyleInfo` guarantees that even if a new style is added without explicit translation entries, international users will automatically see clean English Title Case labels rather than raw Korean strings.

## 2. Responsive UI/UX & Mobile Readability Rules
- **Automatic Continuous UI/UX Optimization on All Future Updates**:
  - **Zero Manual Overhead**: The project includes `AutoResponsiveGuardian.tsx` mounted in `app/layout.tsx`. It automatically monitors all dynamic DOM updates, components, and screen resize events to guarantee optimal layout, text wrapping, touch targets, and scrolling.
  - **Mobile-First Touch Architecture**:
    - Every interactive button, chip, and link MUST have an effective touch target area of minimum 40px–44px (`min-h-[40px]`).
    - Horizontal lists (category chips, style previews) MUST use `overflow-x-auto no-scrollbar touch-pan-x` so mobile users can swipe horizontally without ugly scrollbars.
    - All containers must respect mobile bottom floating bars with safe area padding (`pb-20 sm:pb-8`).
  - **Mobile Text Legibility & CJK Word Wrapping**:
    - Always apply `keep-all` and `break-keep` CSS styles for CJK and multi-language readability to avoid awkward word breaks.
    - Ensure clear line heights (`leading-relaxed`), optimal font sizes (minimum 12px for body, clear headings).
  - **Modal Windows & Lightbox**:
    - Modal windows must lock body scrolling (`document.body.style.overflow = "hidden"`) and stay centered in the mobile viewport (`max-h-[92vh] overflow-y-auto`) without dark empty gaps.

## 3. High-Speed & Token-Saving Optimization Rules (속도 2배 & 토큰 50% 절감)
- **Token-Efficient Answers**: Keep agent natural language responses highly concise, clear, and direct to the point. Avoid verbose re-summaries of code or documents to minimize token consumption.
- **Precision Code Edits**: Use targeted block edits instead of rewriting entire long files, keeping token payload small and execution ultra-fast.
- **Single-Pass Tool Execution**: Minimize redundant tool calls and batch required file checks, accelerating turn-around time by 2x.

## 4. Localhost-First Ultra-Fast Development & Explicit Deploy Rule
- **Instant Localhost Iteration (0.1s Hot Reload)**: All code modifications, bug fixes, UI styling, and prompt engine improvements MUST be applied directly to `localhost:3001` files (`app/`, `app/api/generate/route.ts`, etc.) first. Do NOT run `firebase deploy` during regular intermediate edits.
- **Explicit Deployment Trigger**: Only execute `npm run build` and `npx firebase-tools deploy` when the user explicitly requests deployment (e.g., "도메인에 반영해 줘", "배포해 줘", "실서버에 올려줘"). This saves enormous time and makes development lightning-fast.


