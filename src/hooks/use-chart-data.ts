import { useState, useEffect } from 'react';
import { LineData } from '@/types/market';
import { fetchCryptoChart } from '@/services/coingecko';

const DAYS_MAP: Record<string, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
};

export function useChartData(coinId: string | null, timeRange: string, apiKey?: string) {
  const [data, setData] = useState<LineData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coinId) return;

    let cancelled = false;
    setLoading(true);

    const days = DAYS_MAP[timeRange] ?? 30;
    fetchCryptoChart(coinId, days, apiKey)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [coinId, timeRange, apiKey]);

  return { data, loading };
}
