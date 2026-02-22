import { useEffect, useState } from 'react';
import { PriceCard, NeedKeyCard } from '@/components/cards/PriceCard';
import { useStockStore } from '@/stores/use-stock-store';
import { useSettingsStore } from '@/stores/use-settings-store';
import { usePolling } from '@/hooks/use-polling';
import { useNavigate } from 'react-router-dom';
import { REFRESH_INTERVALS } from '@/config/refresh-intervals';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { fetchStockChart, StockChartRange } from '@/services/finnhub';
import { CandleData } from '@/types/market';
import { cn } from '@/utils/cn';

const STOCK_CHART_RANGES: StockChartRange[] = ['1D', '5D', '1M'];

export function StocksPage() {
  const navigate = useNavigate();
  const { finnhubKey } = useSettingsStore();
  const { quotes, loading, error, fetch } = useStockStore();
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [chartRange, setChartRange] = useState<StockChartRange>('1D');
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartResolution, setChartResolution] = useState<'60' | 'D' | null>(null);
  const [chartNotice, setChartNotice] = useState<string | null>(null);

  usePolling(() => fetch(finnhubKey), REFRESH_INTERVALS.stock, !!finnhubKey);

  useEffect(() => {
    if (quotes.length === 0) return;
    if (!selectedSymbol || !quotes.some((quote) => quote.symbol === selectedSymbol)) {
      setSelectedSymbol(quotes[0].symbol);
    }
  }, [quotes, selectedSymbol]);

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

  if (!finnhubKey) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <NeedKeyCard title="Finnhub API key required for stock data" onSettings={() => navigate('/settings')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">US Stocks</h1>
        {error && <span className="text-accent-red text-xs">{error}</span>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {quotes.map((q) => (
          <PriceCard
            key={q.symbol}
            quote={q}
            loading={loading && quotes.length === 0}
            onClick={() => setSelectedSymbol(q.symbol)}
          />
        ))}
        {loading && quotes.length === 0 &&
          Array.from({ length: 10 }).map((_, i) => <PriceCard key={i} loading />)
        }
      </div>

      {selectedSymbol && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">
              {selectedSymbol} Hourly Candlestick
            </h3>
            <div className="flex gap-1">
              {STOCK_CHART_RANGES.map((range) => (
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
