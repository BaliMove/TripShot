# Project Specific Rules & Guidelines

## 1. Global Multi-Language Auto-Detection Rules
- **Automatic Language & Device Detection**: Always detect the user's device (Mobile/Desktop) and system language (`navigator.language`) automatically (`ko`, `en`, `ja`, `zh`, `id`).
- **No Manual Language Selector**: Never display a manual language selector dropdown or button in the UI. All translations must switch seamlessly and automatically based on user environment.

## 2. Responsive UI/UX & Mobile Readability Rules
- **Device Optimization**: Ensure 100% responsiveness across Mobile, Tablet, and Desktop viewports.
- **Mobile Text Legibility**:
  - Always apply `keep-all` and `break-keep` CSS styles for CJK and multi-language readability to avoid awkward word breaks.
  - Ensure clear line heights (`leading-relaxed`), optimal font sizes (minimum 12px for body, clear headings), and sufficient touch targets (minimum 44px for buttons).
  - Modal windows must lock body scrolling (`document.body.style.overflow = "hidden"`) and stay centered in the mobile viewport without empty dark gaps.

## 3. High-Speed & Token-Saving Optimization Rules (속도 2배 & 토큰 50% 절감)
- **Token-Efficient Answers**: Keep agent natural language responses highly concise, clear, and direct to the point. Avoid verbose re-summaries of code or documents to minimize token consumption.
- **Precision Code Edits**: Use targeted block edits instead of rewriting entire long files, keeping token payload small and execution ultra-fast.
- **Single-Pass Tool Execution**: Minimize redundant tool calls and batch required file checks, accelerating turn-around time by 2x.

