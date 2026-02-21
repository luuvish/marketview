import { PriceCard, NeedKeyCard } from '@/components/cards/PriceCard';
import { useMetalsStore } from '@/stores/use-metals-store';
import { useSettingsStore } from '@/stores/use-settings-store';
import { usePolling } from '@/hooks/use-polling';
import { useNavigate } from 'react-router-dom';
import { REFRESH_INTERVALS } from '@/config/refresh-intervals';

export function MetalsPage() {
  const navigate = useNavigate();
  const { metalsKey } = useSettingsStore();
  const { quotes, loading, error, fetch } = useMetalsStore();

  usePolling(() => fetch(metalsKey), REFRESH_INTERVALS.metal, !!metalsKey);

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
          <PriceCard key={q.symbol} quote={q} loading={loading && quotes.length === 0} />
        ))}
        {loading && quotes.length === 0 &&
          Array.from({ length: 3 }).map((_, i) => <PriceCard key={i} loading />)
        }
      </div>
    </div>
  );
}
