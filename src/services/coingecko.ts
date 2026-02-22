import { apiFetch } from './api-client';
import { Quote, LineData } from '@/types/market';
import { CRYPTO_ASSETS } from '@/config/assets';
import type { UTCTimestamp } from 'lightweight-charts';

interface CoinGeckoPrice {
  [id: string]: {
    usd: number;
    usd_24h_change: number;
    usd_24h_vol: number;
    usd_market_cap: number;
  };
}

export async function fetchCryptoQuotes(apiKey?: string): Promise<Quote[]> {
  const ids = CRYPTO_ASSETS.map((a) => a.apiId).join(',');
  const params: Record<string, string> = {
    ids,
    vs_currencies: 'usd',
    include_24hr_change: 'true',
    include_24hr_vol: 'true',
    include_market_cap: 'true',
  };
  if (apiKey) {
    params['x_cg_demo_api_key'] = apiKey;
  }

  const data = await apiFetch<CoinGeckoPrice>({
    provider: 'coingecko',
    endpoint: 'https://api.coingecko.com/api/v3/simple/price',
    params,
  });

  return CRYPTO_ASSETS.map((asset) => {
    const coin = data[asset.apiId!];
    if (!coin) {
      return {
        symbol: asset.symbol,
        name: asset.name,
        price: 0,
        change: 0,
        changePercent: 0,
        timestamp: Date.now(),
        currency: 'USD',
        category: 'crypto' as const,
      };
    }
    const price = coin.usd;
    const changePercent = coin.usd_24h_change ?? 0;
    const change = (price * changePercent) / 100;
    return {
      symbol: asset.symbol,
      name: asset.name,
      price,
      change,
      changePercent,
      timestamp: Date.now(),
      currency: 'USD',
      category: 'crypto' as const,
    };
  });
}

interface CoinGeckoMarketChart {
  prices: [number, number][];
}

export async function fetchCryptoChart(
  coinId: string,
  days: number,
  apiKey?: string
): Promise<LineData[]> {
  const params: Record<string, string> = {
    vs_currency: 'usd',
    days: days.toString(),
  };
  if (apiKey) {
    params['x_cg_demo_api_key'] = apiKey;
  }

  const data = await apiFetch<CoinGeckoMarketChart>({
    provider: 'coingecko',
    endpoint: `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
    params,
    cacheTTL: 5 * 60_000,
  });

  const sorted = data.prices
    .map(([timestamp, value]) => ({
      time: Math.floor(timestamp / 1000) as UTCTimestamp,
      value,
    }))
    .sort((a, b) => Number(a.time) - Number(b.time));

  // lightweight-charts expects strictly increasing time values.
  const deduped: LineData[] = [];
  let lastTime: number | null = null;
  for (const point of sorted) {
    const currentTime = Number(point.time);
    if (lastTime === currentTime) continue;
    deduped.push(point);
    lastTime = currentTime;
  }

  return deduped;
}
