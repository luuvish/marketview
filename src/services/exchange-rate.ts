import { apiFetch } from './api-client';
import { Quote } from '@/types/market';
import { FOREX_PAIRS } from '@/config/assets';

interface ExchangeRateResponse {
  [currency: string]: number;
}

export async function fetchForexQuotes(): Promise<Quote[]> {
  const results: Quote[] = [];

  for (const pair of FOREX_PAIRS) {
    try {
      const base = pair.currency!;
      const target = pair.apiId!;

      const data = await apiFetch<ExchangeRateResponse>({
        provider: 'exchangeRate',
        endpoint: `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`,
      });

      const rate = data[target];
      if (rate !== undefined) {
        results.push({
          symbol: pair.symbol,
          name: pair.name,
          price: rate,
          change: 0,
          changePercent: 0,
          timestamp: Date.now(),
          currency: base.toUpperCase(),
          category: 'forex',
        });
      }
    } catch {
      // Skip failed pairs
    }
  }

  return results;
}
