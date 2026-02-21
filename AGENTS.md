# Marketview - Agent Instructions

## Project Overview

금융 시세 대시보드 SPA. React 18 + TypeScript + Vite 5 + Tailwind CSS.
GitHub Pages에 배포 (`luuvish.github.io/marketview`).

## Architecture

### Data Flow

```
API Services → Zustand Stores → React Components
     ↑                              ↓
  TTL Cache ←──────────────── usePolling hook
  (localStorage)
```

### Key Patterns

- **API abstraction**: `services/api-client.ts`가 모든 API 호출을 래핑 (캐시 + rate limit + 재시도)
- **Rate limiting**: `services/rate-limiter.ts`의 Token Bucket 방식, API별 독립 인스턴스
- **Caching**: `services/cache.ts`의 localStorage TTL 캐시
- **Polling**: `hooks/use-polling.ts`로 자동 갱신, `document.hidden` 시 일시중지
- **Stores**: Zustand per category (`use-stock-store`, `use-crypto-store` 등)
- **Settings**: `use-settings-store`에서 API key를 localStorage persist로 관리

### File Conventions

- Components: PascalCase (`PriceCard.tsx`)
- Hooks/stores: kebab-case (`use-polling.ts`)
- Services/utils: kebab-case (`api-client.ts`)

## Important Constraints

- **HashRouter 필수**: GitHub Pages는 서버사이드 라우팅 불가
- **`base: '/marketview/'`**: vite.config.ts에서 설정, 변경 시 index.html favicon 경로도 함께 수정
- **Metals.Dev 월 100회 제한**: 30분 캐시 + 일 3회 이하 호출
- **한국 시장**: 무료 KOSPI API 없음 → EWY ETF + ADR(PKX, KB, KT) 프록시
- **API key**: localStorage 저장, 절대 외부 서버로 전송하지 않음

## Adding a New Asset Category

1. `config/assets.ts`에 자산 목록 추가
2. `services/`에 API 서비스 파일 생성
3. `stores/`에 Zustand 스토어 생성
4. `pages/`에 페이지 컴포넌트 생성
5. `App.tsx`에 Route 추가
6. `components/layout/Header.tsx` nav에 링크 추가

## Commands

```bash
pnpm dev       # 개발 서버 (localhost:5173)
pnpm build     # TypeScript 체크 + 프로덕션 빌드
pnpm preview   # 빌드 결과 로컬 확인
```
