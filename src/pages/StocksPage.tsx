import { PriceCard, NeedKeyCard } from '@/components/cards/PriceCard';
import { useStockStore } from '@/stores/use-stock-store';
import { useSettingsStore } from '@/stores/use-settings-store';
import { usePolling } from '@/hooks/use-polling';
import { useNavigate } from 'react-router-dom';
import { REFRESH_INTERVALS } from '@/config/refresh-intervals';

export function StocksPage() {
  const navigate = useNavigate();
  const { finnhubKey } = useSettingsStore();
  const { quotes, loading, error, fetch } = useStockStore();

  usePolling(() => fetch(finnhubKey), REFRESH_INTERVALS.stock, !!finnhubKey);

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
          <PriceCard key={q.symbol} quote={q} loading={loading && quotes.length === 0} />
        ))}
        {loading && quotes.length === 0 &&
          Array.from({ length: 10 }).map((_, i) => <PriceCard key={i} loading />)
        }
      </div>
    </div>
  );
}
