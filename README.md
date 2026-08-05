# ✈️ TripShot.world (트립샷)

> **"방구석에서 10초 만에 떠나는 세계 여행 인생샷"**  
> 셀카 한 장으로 세계 명소(발리, 보로부두르, 파리, 산토리니) 배경에 내 모습을 자연스럽게 합성해 주는 AI 여행 사진 스튜디오 SaaS 플랫폼입니다.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (Dark/Vibrant Mode, Bento Grid Layout)
- **State Management:** React Hooks / Zustand
- **AI Engine:** Google Gemini (`gemini-3.1-flash-lite`, `gemini-3-pro`) / fal-ai (`fal-ai/flux-pulid`)
- **Deployment:** Vercel

---

## 🚀 로컬 개발 환경 실행 방법

1. **저장소 클론 및 패키지 설치**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/tripshot-world.git
   cd tripshot-world
   npm install
   ```

2. **환경변수 설정**
   루트 경로에 `.env.local` 파일을 생성하고 API 키를 입력합니다:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   FAL_KEY=your_fal_ai_api_key_here
   ```

3. **개발 서버 실행 (Port 3001)**
   ```bash
   npm run dev
   ```
   브라우저에서 [http://localhost:3001](http://localhost:3001) 로 접속하여 확인합니다.

---

## 🔒 배포 전 보안 및 런타임 체크리스트 (Phase 6)

- [x] `/api/generate/route.ts` 파일 상단 Node.js 런타임 명시 (`export const runtime = "nodejs";`)
- [x] API 타임아웃 방지 설정 (`export const maxDuration = 60;`)
- [x] `.env.local` 파일 GitHub 유출 방지 (`.gitignore`에 `.env*.local` 지정 완료)
- [x] Vercel Dashboard Environment Variables 설정 (`GEMINI_API_KEY`, `FAL_KEY`)

---

© 2026 TripShot.world. All rights reserved. ✈️ JalanJalan Indah Series.


