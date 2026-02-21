import { apiFetch } from './api-client';
import { Quote } from '@/types/market';

interface FinnhubQuote {
  c: number;  // current
  d: number;  // change
  dp: number; // percent change
  h: number;  // high
  l: number;  // low
  o: number;  // open
  pc: number; // previous close
  t: number;  // timestamp
}

export async function fetchStockQuote(
  symbol: string,
  name: string,
  apiKey: string,
  category: 'stock' | 'korean' = 'stock'
): Promise<Quote> {
  const data = await apiFetch<FinnhubQuote>({
    provider: 'finnhub',
    endpoint: `${__FINNHUB_BASE__}/quote`,
    params: { symbol, token: apiKey },
  });

  return {
    symbol,
    name,
    price: data.c,
    change: data.d,
    changePercent: data.dp,
    high: data.h,
    low: data.l,
    open: data.o,
    previousClose: data.pc,
    timestamp: data.t * 1000,
    currency: 'USD',
    category,
  };
}

const __FINNHUB_BASE__ = 'https://finnhub.io/api/v1';

export async function fetchStockQuotes(
  symbols: { symbol: string; name: string }[],
  apiKey: string,
  category: 'stock' | 'korean' = 'stock'
): Promise<Quote[]> {
  const results = await Promise.allSettled(
    symbols.map((s) => fetchStockQuote(s.symbol, s.name, apiKey, category))
  );
  return results
    .filter((r): r is PromiseFulfilledResult<Quote> => r.status === 'fulfilled')
    .map((r) => r.value);
}
