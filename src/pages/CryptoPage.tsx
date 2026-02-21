import { useState } from 'react';
import { PriceCard } from '@/components/cards/PriceCard';
import { useCryptoStore } from '@/stores/use-crypto-store';
import { useSettingsStore } from '@/stores/use-settings-store';
import { usePolling } from '@/hooks/use-polling';
import { useChartData } from '@/hooks/use-chart-data';
import { REFRESH_INTERVALS } from '@/config/refresh-intervals';
import { CRYPTO_ASSETS } from '@/config/assets';
import { SparklineChart } from '@/components/charts/SparklineChart';
import { cn } from '@/utils/cn';
import { TimeRange } from '@/types/market';

const TIME_RANGES: TimeRange[] = ['1D', '1W', '1M', '3M', '1Y'];

export function CryptoPage() {
  const { coingeckoKey } = useSettingsStore();
  const { quotes, loading, error, fetch } = useCryptoStore();
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');

  usePolling(() => fetch(coingeckoKey), REFRESH_INTERVALS.crypto);

  const { data: chartData, loading: chartLoading } = useChartData(selectedCoin, timeRange, coingeckoKey);

  const selectedAsset = CRYPTO_ASSETS.find((a) => a.apiId === selectedCoin);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Cryptocurrency</h1>
        {error && <span className="text-accent-red text-xs">{error}</span>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {quotes.map((q) => {
          const asset = CRYPTO_ASSETS.find((a) => a.symbol === q.symbol);
          return (
            <PriceCard
              key={q.symbol}
              quote={q}
              loading={loading && quotes.length === 0}
              onClick={() => asset?.apiId && setSelectedCoin(asset.apiId)}
            />
          );
        })}
        {loading && quotes.length === 0 &&
          Array.from({ length: 7 }).map((_, i) => <PriceCard key={i} loading />)
        }
      </div>

      {/* Chart section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{selectedAsset?.name ?? 'Bitcoin'} Chart</h3>
          <div className="flex gap-1">
            {TIME_RANGES.map((tr) => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={cn(
                  'px-2 py-1 text-xs rounded',
                  timeRange === tr ? 'bg-accent-blue text-white' : 'text-gray-400 hover:text-white'
                )}
              >
                {tr}
              </button>
            ))}
          </div>
        </div>

        {chartLoading ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Loading chart...
          </div>
        ) : (
          <SparklineChart data={chartData} height={300} />
        )}
      </div>
    </div>
  );
}
