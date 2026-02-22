import { useEffect, useMemo, useState } from 'react';
import { PriceCard, NeedKeyCard } from '@/components/cards/PriceCard';
import { useMetalsStore } from '@/stores/use-metals-store';
import { useSettingsStore } from '@/stores/use-settings-store';
import { usePolling } from '@/hooks/use-polling';
import { useNavigate } from 'react-router-dom';
import { REFRESH_INTERVALS } from '@/config/refresh-intervals';
import { LineChart } from '@/components/charts/LineChart';
import { cn } from '@/utils/cn';

type HistoryRange = '24H' | '7D' | '30D' | 'ALL';

const METALS_CHART_RANGES: HistoryRange[] = ['24H', '7D', '30D', 'ALL'];
const RANGE_WINDOW_SECONDS: Record<Exclude<HistoryRange, 'ALL'>, number> = {
  '24H': 24 * 60 * 60,
  '7D': 7 * 24 * 60 * 60,
  '30D': 30 * 24 * 60 * 60,
};

export function MetalsPage() {
  const navigate = useNavigate();
  const { metalsKey } = useSettingsStore();
  const { quotes, history, loading, error, fetch } = useMetalsStore();
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [chartRange, setChartRange] = useState<HistoryRange>('7D');

  usePolling(() => fetch(metalsKey), REFRESH_INTERVALS.metal, !!metalsKey);

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

  if (!metalsKey) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <NeedKeyCard title="Metals.Dev API key required" onSettings={() => navigate('/settings')} />
        <p className="text-gray-500 text-xs mt-3 text-center">
          Free tier: 100 requests/month. Dashboard caches for 30 minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Precious Metals</h1>
        {error && <span className="text-accent-red text-xs">{error}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {quotes.map((q) => (
          <PriceCard
            key={q.symbol}
            quote={q}
            loading={loading && quotes.length === 0}
            onClick={() => setSelectedSymbol(q.symbol)}
          />
        ))}
        {loading && quotes.length === 0 &&
          Array.from({ length: 3 }).map((_, i) => <PriceCard key={i} loading />)
        }
      </div>

      {selectedSymbol && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{selectedSymbol} Price History</h3>
            <div className="flex gap-1">
              {METALS_CHART_RANGES.map((range) => (
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

          <LineChart data={filteredHistory} height={360} color="#ffd700" />
          <p className="text-xs text-gray-500 mt-3">
            Updates every 30 minutes. To respect monthly API limits, this chart uses collected snapshots.
          </p>
        </div>
      )}
    </div>
  );
}
