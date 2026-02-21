import { PriceCard } from '@/components/cards/PriceCard';
import { useForexStore } from '@/stores/use-forex-store';
import { usePolling } from '@/hooks/use-polling';
import { REFRESH_INTERVALS } from '@/config/refresh-intervals';

export function ForexPage() {
  const { quotes, loading, error, fetch } = useForexStore();

  usePolling(() => fetch(), REFRESH_INTERVALS.forex);

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
          <PriceCard key={q.symbol} quote={q} loading={loading && quotes.length === 0} />
        ))}
        {loading && quotes.length === 0 &&
          Array.from({ length: 4 }).map((_, i) => <PriceCard key={i} loading />)
        }
      </div>
    </div>
  );
}
