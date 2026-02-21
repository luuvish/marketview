import { cn } from '@/utils/cn';
import { useSettingsStore } from '@/stores/use-settings-store';
import { getRateLimiterStatus } from '@/services/api-client';

interface StatusDotProps {
  label: string;
  hasKey: boolean;
  provider?: 'finnhub' | 'coingecko' | 'exchangeRate' | 'metals';
}

function StatusDot({ label, hasKey, provider }: StatusDotProps) {
  const remaining = provider ? getRateLimiterStatus(provider) : null;
  return (
    <span className="flex items-center gap-1.5 text-xs text-gray-400">
      <span
        className={cn(
          'w-2 h-2 rounded-full',
          hasKey ? 'bg-accent-green' : 'bg-gray-600'
        )}
      />
      {label}
      {remaining !== null && hasKey && (
        <span className="text-gray-500">{remaining}</span>
      )}
    </span>
  );
}

export function Footer() {
  const { finnhubKey, metalsKey } = useSettingsStore();

  return (
    <footer className="border-t border-gray-700/50 bg-surface/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StatusDot label="Finnhub" hasKey={!!finnhubKey} provider="finnhub" />
          <StatusDot label="CoinGecko" hasKey={true} provider="coingecko" />
          <StatusDot label="Forex" hasKey={true} provider="exchangeRate" />
          <StatusDot label="Metals" hasKey={!!metalsKey} provider="metals" />
        </div>
        <span className="text-xs text-gray-600">Marketview</span>
      </div>
    </footer>
  );
}
