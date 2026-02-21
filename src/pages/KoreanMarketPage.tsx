import { PriceCard, NeedKeyCard } from '@/components/cards/PriceCard';
import { useSettingsStore } from '@/stores/use-settings-store';
import { useForexStore } from '@/stores/use-forex-store';
import { usePolling } from '@/hooks/use-polling';
import { useNavigate } from 'react-router-dom';
import { REFRESH_INTERVALS } from '@/config/refresh-intervals';
import { Quote } from '@/types/market';
import { fetchStockQuotes } from '@/services/finnhub';
import { KOREAN_ASSETS } from '@/config/assets';
import { useState, useCallback } from 'react';

export function KoreanMarketPage() {
  const navigate = useNavigate();
  const { finnhubKey } = useSettingsStore();
  const forex = useForexStore();
  const [koreanQuotes, setKoreanQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchKorean = useCallback(async () => {
    if (!finnhubKey) return;
    setLoading(true);
    try {
      const quotes = await fetchStockQuotes(
        KOREAN_ASSETS.map((a) => ({ symbol: a.symbol, name: a.name })),
        finnhubKey,
        'korean'
      );
      setKoreanQuotes(quotes);
    } finally {
      setLoading(false);
    }
  }, [finnhubKey]);

  usePolling(fetchKorean, REFRESH_INTERVALS.korean, !!finnhubKey);
  usePolling(() => forex.fetch(), REFRESH_INTERVALS.forex);

  const usdKrw = forex.quotes.find((q) => q.symbol === 'USD/KRW');

  if (!finnhubKey) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <NeedKeyCard title="Finnhub API key required for Korean market data" onSettings={() => navigate('/settings')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Korean Market (Proxy)</h1>
      <p className="text-gray-400 text-sm">
        EWY ETF and Korean ADRs as KOSPI proxy. USD/KRW exchange rate included.
      </p>

      {usdKrw && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <PriceCard quote={usdKrw} />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {koreanQuotes.map((q) => (
          <PriceCard key={q.symbol} quote={q} loading={loading && koreanQuotes.length === 0} />
        ))}
        {loading && koreanQuotes.length === 0 &&
          Array.from({ length: 4 }).map((_, i) => <PriceCard key={i} loading />)
        }
      </div>
    </div>
  );
}
