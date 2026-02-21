import { useNavigate } from 'react-router-dom';
import { PriceCard, NeedKeyCard } from '@/components/cards/PriceCard';
import { useStockStore } from '@/stores/use-stock-store';
import { useCryptoStore } from '@/stores/use-crypto-store';
import { useForexStore } from '@/stores/use-forex-store';
import { useMetalsStore } from '@/stores/use-metals-store';
import { useSettingsStore } from '@/stores/use-settings-store';
import { usePolling } from '@/hooks/use-polling';
import { REFRESH_INTERVALS } from '@/config/refresh-intervals';

export function Dashboard() {
  const navigate = useNavigate();
  const { finnhubKey, coingeckoKey, metalsKey } = useSettingsStore();

  const stocks = useStockStore();
  const crypto = useCryptoStore();
  const forex = useForexStore();
  const metals = useMetalsStore();

  usePolling(() => stocks.fetch(finnhubKey), REFRESH_INTERVALS.stock, !!finnhubKey);
  usePolling(() => crypto.fetch(coingeckoKey), REFRESH_INTERVALS.crypto);
  usePolling(() => forex.fetch(), REFRESH_INTERVALS.forex);
  usePolling(() => metals.fetch(metalsKey), REFRESH_INTERVALS.metal, !!metalsKey);

  const featuredStocks = stocks.quotes.slice(0, 4);
  const featuredCrypto = crypto.quotes.slice(0, 2);
  const featuredForex = forex.quotes.slice(0, 1);
  const featuredMetals = metals.quotes.slice(0, 1);

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Market Overview</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {finnhubKey ? (
            featuredStocks.map((q) => (
              <PriceCard
                key={q.symbol}
                quote={q}
                loading={stocks.loading && stocks.quotes.length === 0}
                onClick={() => navigate('/stocks')}
              />
            ))
          ) : (
            <NeedKeyCard title="Stocks: Finnhub key needed" onSettings={() => navigate('/settings')} />
          )}

          {featuredCrypto.map((q) => (
            <PriceCard
              key={q.symbol}
              quote={q}
              loading={crypto.loading && crypto.quotes.length === 0}
              onClick={() => navigate('/crypto')}
            />
          ))}

          {featuredForex.map((q) => (
            <PriceCard
              key={q.symbol}
              quote={q}
              loading={forex.loading && forex.quotes.length === 0}
              onClick={() => navigate('/forex')}
            />
          ))}

          {metalsKey ? (
            featuredMetals.map((q) => (
              <PriceCard
                key={q.symbol}
                quote={q}
                loading={metals.loading && metals.quotes.length === 0}
                onClick={() => navigate('/metals')}
              />
            ))
          ) : (
            <NeedKeyCard title="Metals: API key needed" onSettings={() => navigate('/settings')} />
          )}
        </div>
      </section>

      {/* Category sections */}
      {stocks.quotes.length > 4 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400">US Stocks</h3>
            <button onClick={() => navigate('/stocks')} className="text-xs text-accent-blue hover:underline">
              View all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {stocks.quotes.slice(4).map((q) => (
              <PriceCard key={q.symbol} quote={q} onClick={() => navigate('/stocks')} />
            ))}
          </div>
        </section>
      )}

      {crypto.quotes.length > 2 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400">Crypto</h3>
            <button onClick={() => navigate('/crypto')} className="text-xs text-accent-blue hover:underline">
              View all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {crypto.quotes.slice(2).map((q) => (
              <PriceCard key={q.symbol} quote={q} onClick={() => navigate('/crypto')} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
