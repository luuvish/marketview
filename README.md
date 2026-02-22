# Marketview

주가, 암호화폐, 환율, 귀금속 시세를 한눈에 볼 수 있는 금융 대시보드.

**Live**: [luuvish.github.io/marketview](https://luuvish.github.io/marketview)

## Tech Stack

- **React 18** + TypeScript + Vite 5
- **Tailwind CSS 3** (다크 테마)
- **TradingView Lightweight Charts v4** (캔들스틱/스파크라인)
- **Zustand** (상태 관리)
- **React Router v6** (HashRouter)
- **GitHub Actions** → GitHub Pages 자동 배포

## API Sources

| Category | API | Key Required |
|----------|-----|:---:|
| US Stocks | [Finnhub](https://finnhub.io) | Yes (free) |
| Crypto | [CoinGecko](https://www.coingecko.com/en/api) | Optional |
| Exchange Rate | [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api) | No |
| Gold/Silver | [Metals.Dev](https://metals.dev) | Yes (free) |
| Korean Market | Finnhub (EWY ETF proxy) | Yes (same) |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173/marketview/](http://localhost:5173/marketview/)

## API Keys

Settings 페이지(`#/settings`)에서 API key를 입력하면 `localStorage`에 저장됩니다.
키는 해당 API 서버에만 전송되며 다른 곳으로 전송되지 않습니다.

계정 생성/키 발급이 처음이면 아래 가이드를 참고하세요:

- [API 계정 생성 및 API Key 발급 가이드](API_KEY_SETUP.md)

빌드 시 환경변수로 기본값을 주입할 수도 있습니다:

```bash
cp .env.example .env.local
# .env.local 에 키 입력
```

## Build & Deploy

```bash
pnpm build        # dist/ 생성
pnpm preview      # 프로덕션 빌드 로컬 확인
```

GitHub에 push하면 Actions가 자동으로 GitHub Pages에 배포합니다.

## Project Structure

```
src/
├── config/        # API endpoints, asset definitions, refresh intervals
├── types/         # TypeScript type definitions
├── services/      # API clients (finnhub, coingecko, exchange-rate, metals)
├── stores/        # Zustand stores per asset category
├── hooks/         # usePolling, useChartData
├── components/
│   ├── layout/    # Header, Footer, DashboardLayout
│   ├── cards/     # PriceCard
│   ├── charts/    # LightweightChart, Sparkline, Candlestick
│   └── ui/        # Badge, LoadingSkeleton, ErrorBoundary
├── pages/         # Dashboard, Stocks, Korean, Crypto, Forex, Metals, Settings
└── utils/         # format, cn
```

## License

MIT
