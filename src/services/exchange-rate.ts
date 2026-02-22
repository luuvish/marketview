import { apiFetch } from './api-client';
import { Quote } from '@/types/market';
import { FOREX_PAIRS } from '@/config/assets';

type ExchangeRateResponse = Record<string, unknown>;

const REQUEST_TIMEOUT_MS = 7000;

const EXCHANGE_RATE_ENDPOINTS = [
  (base: string) =>
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`,
  (base: string) =>
    `https://latest.currency-api.pages.dev/v1/currencies/${base}.json`,
  (base: string) =>
    `https://latest.currency-api.pages.dev/v1/currencies/${base}.min.json`,
];

function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function extractRate(
  payload: ExchangeRateResponse,
  base: string,
  target: string
): number | null {
  // Legacy format: { krw: 1320.1, ... }
  const directRate = toFiniteNumber(payload[target]);
  if (directRate !== null) return directRate;

  // Current format: { date: "...", usd: { krw: 1320.1, ... } }
  const nested = payload[base];
  if (nested && typeof nested === 'object') {
    const nestedRate = toFiniteNumber(
      (nested as Record<string, unknown>)[target]
    );
    if (nestedRate !== null) return nestedRate;
  }

  // Alternative format some providers use: { rates: { ... } }
  const rates = payload.rates;
  if (rates && typeof rates === 'object') {
    const ratesValue = toFiniteNumber((rates as Record<string, unknown>)[target]);
    if (ratesValue !== null) return ratesValue;
  }

  return null;
}

async function fetchBaseRates(base: string): Promise<ExchangeRateResponse> {
  let lastError: Error | null = null;

  for (const buildEndpoint of EXCHANGE_RATE_ENDPOINTS) {
    try {
      return await apiFetch<ExchangeRateResponse>({
        provider: 'exchangeRate',
        endpoint: buildEndpoint(base),
        timeoutMs: REQUEST_TIMEOUT_MS,
      });
    } catch (error) {
      lastError = error as Error;
    }
  }

  throw lastError ?? new Error(`Failed to fetch FX rates for ${base}`);
}

export async function fetchForexQuotes(): Promise<Quote[]> {
  const bases = Array.from(
    new Set(FOREX_PAIRS.map((pair) => pair.currency).filter(Boolean))
  ) as string[];

  const basePayloads = await Promise.all(
    bases.map(async (base) => {
      try {
        const payload = await fetchBaseRates(base);
        return [base, payload] as const;
      } catch {
        return [base, null] as const;
      }
    })
  );

  const payloadByBase = new Map<string, ExchangeRateResponse | null>(basePayloads);
  const timestamp = Date.now();
  const results: Quote[] = [];

  for (const pair of FOREX_PAIRS) {
    const base = pair.currency;
    const target = pair.apiId;
    if (!base || !target) continue;

    const payload = payloadByBase.get(base);
    if (!payload) continue;

    const rate = extractRate(payload, base, target);
    if (rate === null) continue;

    results.push({
      symbol: pair.symbol,
      name: pair.name,
      price: rate,
      change: 0,
      changePercent: 0,
      timestamp,
      currency: base.toUpperCase(),
      category: 'forex',
    });
  }

  if (results.length === 0) {
    throw new Error('Failed to load exchange rates. Check network or try again later.');
  }

  return results;
}
