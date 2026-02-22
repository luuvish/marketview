# API 계정 생성 및 API Key 발급 가이드

이 문서는 Marketview에서 사용하는 외부 API(Finnhub, CoinGecko, Metals.Dev)의
계정 생성, API Key 발급, 그리고 프로젝트 적용 방법을 정리한 문서입니다.

확인일: 2026-02-22

## 1. 어떤 API에 키가 필요한가?

| API | 사용 영역 | 계정 생성 필요 | API Key 필요 |
| --- | --- | --- | --- |
| Finnhub | US Stocks, Korean Proxy | 예 | 예 |
| CoinGecko | Crypto | 예 (Demo/Pro 플랜 사용자) | 선택 (프로젝트에서는 optional) |
| Metals.Dev | Gold/Silver/Platinum | 예 | 예 |
| Exchange Rate API | Forex | 아니오 | 아니오 |

주의:
- CoinGecko는 인증 없이도 일부 호출이 가능하지만, 공식 가이드는 API Key 사용을 권장합니다.
- Metals.Dev free 플랜은 월 100회 호출 제한이 있습니다.

## 2. Finnhub 계정 생성 및 키 발급

1. 회원가입
- `https://finnhub.io/register` 접속
- 이메일/소셜 로그인으로 계정 생성

2. 로그인 후 대시보드 이동
- `https://finnhub.io/dashboard` 접속 (로그인 필요)

3. API Key 복사
- Dashboard에서 개인 API Key를 확인하고 복사

4. 키 동작 테스트 (선택)

```bash
curl "https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_FINNHUB_KEY"
```

## 3. CoinGecko 계정 생성 및 키 발급 (Demo 기준)

1. 무료 계정 생성
- `https://www.coingecko.com/en/api/pricing` 에서 Free/Demo 시작
- CoinGecko 계정 생성 및 로그인

2. Developer Dashboard에서 키 생성
- Developer Dashboard 이동
- `+ Add New Key` 클릭
- 생성된 키를 안전하게 저장

3. 키 동작 테스트

헤더 방식 (권장):

```bash
curl -X GET "https://api.coingecko.com/api/v3/ping" \
  -H "x-cg-demo-api-key: YOUR_COINGECKO_KEY"
```

쿼리 파라미터 방식:

```bash
curl "https://api.coingecko.com/api/v3/ping?x_cg_demo_api_key=YOUR_COINGECKO_KEY"
```

## 4. Metals.Dev 계정 생성 및 키 발급

1. 무료 키 발급 시작
- `https://metals.dev/pricing` 접속
- Free 플랜에서 `Get Free API Key` 선택
- 계정 생성 (공식 안내: 카드 불필요)

2. Dashboard에서 API Key 확인
- 로그인 후 Dashboard에서 API Key 복사

3. 키 동작 테스트

```bash
curl "https://api.metals.dev/v1/latest?api_key=YOUR_METALS_KEY&currency=USD&unit=toz"
```

사용량 확인:

```bash
curl "https://api.metals.dev/usage?api_key=YOUR_METALS_KEY"
```

## 5. Marketview 프로젝트에 키 적용

방법 A: UI에서 설정 (권장)

1. 개발 서버 실행

```bash
pnpm dev
```

2. 설정 페이지 이동
- `http://localhost:5173/marketview/#/settings`

3. 각 키 입력
- Finnhub: 필수
- CoinGecko: 선택
- Metals.Dev: 필수

저장 위치:
- 브라우저 `localStorage`의 `trade-settings`에 저장됩니다.

방법 B: 환경변수로 기본값 설정

1. 파일 생성

```bash
cp .env.example .env.local
```

2. `.env.local`에 입력

```bash
VITE_FINNHUB_KEY=YOUR_FINNHUB_KEY
VITE_COINGECKO_KEY=YOUR_COINGECKO_KEY
VITE_METALS_KEY=YOUR_METALS_KEY
```

3. 서버 재시작
- `pnpm dev` 재실행

참고:
- `.env.local`은 `.gitignore`에 포함되어 있어 커밋되지 않습니다.
- 이미 UI에서 저장한 값(localStorage)이 있으면, 다음 실행 시 해당 값이 우선 적용됩니다.

## 6. 보안 체크리스트

- API Key를 Git에 커밋하지 않기
- 키를 화면 공유/로그에 노출하지 않기
- 유출 시 즉시 Dashboard에서 키 재생성 또는 폐기 후 신규 발급
- 가능하면 클라이언트 직접 호출 대신 서버 프록시 방식 고려

## 7. 공식 문서

- Finnhub Register: `https://finnhub.io/register`
- Finnhub Dashboard (로그인 필요): `https://finnhub.io/dashboard`
- Finnhub API Docs: `https://finnhub.io/docs/api`
- CoinGecko Demo 가입/키 생성 가이드:
  `https://support.coingecko.com/hc/en-us/articles/21880397454233-User-Guide-How-to-sign-up-for-CoinGecko-Demo-API-and-generate-an-API-key`
- CoinGecko 인증 문서:
  `https://docs.coingecko.com/v3.0.1/reference/authentication`
- CoinGecko 키 위치 안내:
  `https://support.coingecko.com/hc/en-us/articles/6473057867161-Where-can-I-find-my-API-key`
- Metals.Dev Docs: `https://www.metals.dev/docs`
- Metals.Dev Pricing: `https://metals.dev/pricing`
