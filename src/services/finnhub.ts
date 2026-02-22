import { apiFetch } from './api-client';
import { CandleData, Quote } from '@/types/market';
import type { UTCTimestamp } from 'lightweight-charts';

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

interface FinnhubCandles {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  s: 'ok' | 'no_data';
  t: number[];
  v: number[];
}

export type StockChartRange = '1D' | '5D' | '1M';
type StockChartResolution = '60' | 'D';

export interface StockChartResult {
  candles: CandleData[];
  resolution: StockChartResolution;
  warning?: string;
}

function getStockChartWindow(
  range: StockChartRange,
  resolution: StockChartResolution
): { from: number; to: number } {
  const to = Math.floor(Date.now() / 1000);

  if (resolution === 'D') {
    switch (range) {
      case '1D':
        return { from: to - 90 * 24 * 60 * 60, to };
      case '5D':
        return { from: to - 180 * 24 * 60 * 60, to };
      case '1M':
        return { from: to - 365 * 24 * 60 * 60, to };
      default:
        return { from: to - 90 * 24 * 60 * 60, to };
    }
  }

  switch (range) {
    case '1D':
      return { from: to - 24 * 60 * 60, to };
    case '5D':
      return { from: to - 5 * 24 * 60 * 60, to };
    case '1M':
      return { from: to - 30 * 24 * 60 * 60, to };
    default:
      return { from: to - 24 * 60 * 60, to };
  }
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

export async function fetchStockChart(
  symbol: string,
  apiKey: string,
  range: StockChartRange = '1D'
): Promise<StockChartResult> {
  try {
    const candles = await fetchStockCandles(symbol, apiKey, range, '60');
    return { candles, resolution: '60' };
  } catch (error) {
    const message = (error as Error)?.message ?? '';
    if (!message.includes('HTTP 403')) {
      throw error;
    }
  }

  const candles = await fetchStockCandles(symbol, apiKey, range, 'D');
  return {
    candles,
    resolution: 'D',
    warning:
      'Hourly candles are not available for this Finnhub key (HTTP 403). Showing daily candles instead.',
  };
}

async function fetchStockCandles(
  symbol: string,
  apiKey: string,
  range: StockChartRange,
  resolution: StockChartResolution
): Promise<CandleData[]> {
  const { from, to } = getStockChartWindow(range, resolution);

  const data = await apiFetch<FinnhubCandles>({
    provider: 'finnhub',
    endpoint: `${__FINNHUB_BASE__}/stock/candle`,
    params: {
      symbol,
      resolution,
      from: from.toString(),
      to: to.toString(),
      token: apiKey,
    },
    cacheTTL: 60_000,
  });

  if (data.s !== 'ok') {
    return [];
  }

  const size = Math.min(
    data.t?.length ?? 0,
    data.o?.length ?? 0,
    data.h?.length ?? 0,
    data.l?.length ?? 0,
    data.c?.length ?? 0
  );

  const candles: CandleData[] = [];
  let lastTime: number | null = null;

  for (let i = 0; i < size; i++) {
    const time = data.t[i];
    const open = data.o[i];
    const high = data.h[i];
    const low = data.l[i];
    const close = data.c[i];

    if (
      !Number.isFinite(time) ||
      !Number.isFinite(open) ||
      !Number.isFinite(high) ||
      !Number.isFinite(low) ||
      !Number.isFinite(close)
    ) {
      continue;
    }

    if (lastTime === time) continue;

    candles.push({
      time: time as UTCTimestamp,
      open,
      high,
      low,
      close,
      volume: data.v?.[i],
    });

    lastTime = time;
  }

  return candles;
}
