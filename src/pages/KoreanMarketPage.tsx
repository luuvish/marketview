import { PriceCard, NeedKeyCard } from '@/components/cards/PriceCard';
import { useSettingsStore } from '@/stores/use-settings-store';
import { useForexStore } from '@/stores/use-forex-store';
import { usePolling } from '@/hooks/use-polling';
import { useNavigate } from 'react-router-dom';
import { REFRESH_INTERVALS } from '@/config/refresh-intervals';
import { CandleData, Quote } from '@/types/market';
import { fetchStockChart, fetchStockQuotes, StockChartRange } from '@/services/finnhub';
import { KOREAN_ASSETS } from '@/config/assets';
import { useState, useCallback, useEffect } from 'react';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { cn } from '@/utils/cn';

const KOREAN_CHART_RANGES: StockChartRange[] = ['1D', '5D', '1M'];

export function KoreanMarketPage() {
  const navigate = useNavigate();
  const { finnhubKey } = useSettingsStore();
  const forex = useForexStore();
  const [koreanQuotes, setKoreanQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [chartRange, setChartRange] = useState<StockChartRange>('1D');
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartResolution, setChartResolution] = useState<'60' | 'D' | null>(null);
  const [chartNotice, setChartNotice] = useState<string | null>(null);

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

  useEffect(() => {
    if (koreanQuotes.length === 0) return;
    if (!selectedSymbol || !koreanQuotes.some((quote) => quote.symbol === selectedSymbol)) {
      setSelectedSymbol(koreanQuotes[0].symbol);
    }
  }, [koreanQuotes, selectedSymbol]);

  useEffect(() => {
    let cancelled = false;

    async function loadChart() {
      if (!finnhubKey || !selectedSymbol) return;

      setChartLoading(true);
      setChartError(null);
      setChartNotice(null);

      try {
        const result = await fetchStockChart(selectedSymbol, finnhubKey, chartRange);
        if (cancelled) return;
        setChartData(result.candles);
        setChartResolution(result.resolution);
        setChartNotice(result.warning ?? null);
      } catch (err) {
        if (cancelled) return;
        setChartError((err as Error).message);
        setChartData([]);
        setChartResolution(null);
      } finally {
        if (!cancelled) setChartLoading(false);
      }
    }

    void loadChart();

    return () => {
      cancelled = true;
    };
  }, [finnhubKey, selectedSymbol, chartRange]);

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
          <PriceCard
            key={q.symbol}
            quote={q}
            loading={loading && koreanQuotes.length === 0}
            onClick={() => setSelectedSymbol(q.symbol)}
          />
        ))}
        {loading && koreanQuotes.length === 0 &&
          Array.from({ length: 4 }).map((_, i) => <PriceCard key={i} loading />)
        }
      </div>

      {selectedSymbol && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{selectedSymbol} Hourly Candlestick</h3>
            <div className="flex gap-1">
              {KOREAN_CHART_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={cn(
                    'px-2 py-1 text-xs rounded',
                    chartRange === range
                      ? 'bg-accent-blue text-white'
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {chartError ? (
            <div className="h-[360px] flex items-center justify-center text-accent-red text-sm">
              {chartError}
            </div>
          ) : chartLoading ? (
            <div className="h-[360px] flex items-center justify-center text-gray-500">
              Loading chart...
            </div>
          ) : (
            <CandlestickChart data={chartData} height={360} />
          )}

          {chartNotice && (
            <p className="text-xs text-yellow-300 mt-3">
              {chartNotice}
            </p>
          )}

          <p className="text-xs text-gray-500 mt-3">
            Resolution: {chartResolution === 'D' ? '1D (fallback)' : '60m (hourly)'}
          </p>
        </div>
      )}
    </div>
  );
}
