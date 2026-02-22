import { useEffect, useMemo, useState } from 'react';
import { PriceCard } from '@/components/cards/PriceCard';
import { useForexStore } from '@/stores/use-forex-store';
import { usePolling } from '@/hooks/use-polling';
import { REFRESH_INTERVALS } from '@/config/refresh-intervals';
import { LineChart } from '@/components/charts/LineChart';
import { cn } from '@/utils/cn';

type HistoryRange = '24H' | '7D' | '30D' | 'ALL';

const FOREX_CHART_RANGES: HistoryRange[] = ['24H', '7D', '30D', 'ALL'];
const RANGE_WINDOW_SECONDS: Record<Exclude<HistoryRange, 'ALL'>, number> = {
  '24H': 24 * 60 * 60,
  '7D': 7 * 24 * 60 * 60,
  '30D': 30 * 24 * 60 * 60,
};

export function ForexPage() {
  const { quotes, history, loading, error, fetch } = useForexStore();
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [chartRange, setChartRange] = useState<HistoryRange>('7D');

  usePolling(() => fetch(), REFRESH_INTERVALS.forex);

  useEffect(() => {
    if (quotes.length === 0) return;
    if (!selectedSymbol || !quotes.some((quote) => quote.symbol === selectedSymbol)) {
      setSelectedSymbol(quotes[0].symbol);
    }
  }, [quotes, selectedSymbol]);

  const filteredHistory = useMemo(() => {
    if (!selectedSymbol) return [];
    const all = history[selectedSymbol] ?? [];
    if (chartRange === 'ALL') return all;

    const now = Math.floor(Date.now() / 1000);
    const cutoff = now - RANGE_WINDOW_SECONDS[chartRange];
    return all.filter((point) => Number(point.time) >= cutoff);
  }, [history, selectedSymbol, chartRange]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Foreign Exchange</h1>
        {error && <span className="text-accent-red text-xs">{error}</span>}
      </div>
      <p className="text-gray-400 text-sm">
        Exchange rates from fawazahmed0/exchange-api. No API key required.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quotes.map((q) => (
          <PriceCard
            key={q.symbol}
            quote={q}
            loading={loading && quotes.length === 0}
            onClick={() => setSelectedSymbol(q.symbol)}
          />
        ))}
        {loading && quotes.length === 0 &&
          Array.from({ length: 4 }).map((_, i) => <PriceCard key={i} loading />)
        }
      </div>

      {selectedSymbol && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{selectedSymbol} Price History</h3>
            <div className="flex gap-1">
              {FOREX_CHART_RANGES.map((range) => (
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

          <LineChart data={filteredHistory} height={360} />
          <p className="text-xs text-gray-500 mt-3">
            Updates every 4 hours. Chart builds as new snapshots are collected.
          </p>
        </div>
      )}
    </div>
  );
}
