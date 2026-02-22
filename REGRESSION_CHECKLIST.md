# Regression Checklist

간단한 수동 회귀 점검 목록입니다.

## 사전 조건

- `pnpm dev` 실행
- API 키 확인:
  - Finnhub (`#/settings`)
  - CoinGecko (선택)
  - Metals.Dev (`#/settings`)

## 기본 동작

- `#/` 대시보드 진입 시 카드가 렌더링된다.
- 화면 하단 Footer에 API 상태가 표시된다.
- 탭 이동 시 레이아웃/헤더가 깨지지 않는다.

## 카테고리별 점검

- `#/stocks`
  - API 키가 있으면 종목 카드가 로딩 후 표시된다.
  - API 키가 없으면 설정 유도 카드가 표시된다.

- `#/korean`
  - EWY/ADR 카드가 표시된다.
  - USD/KRW 카드가 함께 표시된다.

- `#/crypto`
  - 코인 카드가 표시된다.
  - 차트가 렌더링되고 `Something went wrong`가 발생하지 않는다.
  - 기간 버튼(`1D/1W/1M/3M/1Y`) 전환이 동작한다.

- `#/forex`
  - 환율 카드가 로딩 후 표시된다.
  - 카드가 무한 스켈레톤 상태에 머무르지 않는다.

- `#/metals`
  - 금/은/백금 카드가 표시된다.
  - `Cannot read properties of undefined` 오류가 발생하지 않는다.

## 오류 처리 점검

- 잘못된 키 입력 시 우측 상단 에러 문구가 표시된다.
- 네트워크 단절 시 페이지가 완전히 깨지지 않고 재시도 가능 상태를 유지한다.

## 빌드 점검

- `pnpm build` 성공
- `pnpm preview`로 빌드 산출물 렌더링 확인
