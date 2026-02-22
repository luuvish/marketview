# TODO

확인일: 2026-02-22

## Data Provider Strategy (Research Follow-up)

### P0 - 결정 필요

- [ ] 무료 API만으로 `US/KR/Forex/Metals/Crypto` 전부를 실시간+히스토리로 운영할지, 일부 유료 업그레이드를 허용할지 결정
- [ ] `KR` 시세는 프록시(EWY/ADR) 유지 vs 정식 KRX 소스 도입 여부 결정
- [ ] 서비스 목표 SLA(갱신 주기, 허용 지연, 차트 히스토리 길이) 정의

### P1 - 기술 검증

- [ ] `US Stocks`: Finnhub candle `HTTP 403` 케이스 비율 측정 및 fallback(日봉) 사용자 경험 점검
- [ ] `Forex`: 현재 exchange-api 기반 일 단위 특성 문서화 및 백필 필요 시 날짜 기반 fetch 설계
- [ ] `Metals`: 월 100회 제한(Free) 기준으로 히스토리 백필 시나리오에서 예상 호출량 산정
- [ ] `Crypto`: CoinGecko Demo credits/minute 제한 기준으로 차트 요청량 검증

### P2 - 대안 비교 문서화

- [ ] 무료안/저비용안/상용안 3가지 운영 시나리오 작성
- [ ] 각 안에 대해 월 비용, 구현 난이도, 데이터 품질(지연/해상도/히스토리) 비교표 작성
- [ ] KR 시세 라이선스/계약 이슈(거래소 정보 이용 계약 포함) 반영

### P3 - 구현 백로그

- [ ] 공급자 교체/추가가 쉬운 구조로 `services` 계층 인터페이스화
- [ ] 백엔드 수집기(옵션) + DB 적재(옵션) 설계안 작성
- [ ] 차트 히스토리 캐시 정책(localStorage/TTL)과 마이그레이션 전략 수립
