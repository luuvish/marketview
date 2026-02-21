import { useState } from 'react';
import { useSettingsStore } from '@/stores/use-settings-store';

function ApiKeyInput({
  label,
  value,
  onChange,
  helpUrl,
  helpText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helpUrl: string;
  helpText: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <a
          href={helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent-blue hover:underline"
        >
          {helpText}
        </a>
      </div>
      <div className="flex gap-2">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter API key..."
          className="flex-1 bg-surface border border-gray-700 rounded-lg px-3 py-2 text-sm
                     text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue"
        />
        <button
          onClick={() => setVisible(!visible)}
          className="btn-ghost text-xs min-w-[60px]"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {value && (
        <p className="text-xs text-accent-green">Key saved (stored in localStorage)</p>
      )}
    </div>
  );
}

export function SettingsPage() {
  const {
    finnhubKey, setFinnhubKey,
    coingeckoKey, setCoingeckoKey,
    metalsKey, setMetalsKey,
  } = useSettingsStore();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">API Settings</h1>
      <p className="text-gray-400 text-sm">
        API keys are stored locally in your browser. They are never sent to any server other than the respective API providers.
      </p>

      <ApiKeyInput
        label="Finnhub (US Stocks, Korean Proxy)"
        value={finnhubKey}
        onChange={setFinnhubKey}
        helpUrl="https://finnhub.io/register"
        helpText="Get free key"
      />

      <ApiKeyInput
        label="CoinGecko (Cryptocurrency)"
        value={coingeckoKey}
        onChange={setCoingeckoKey}
        helpUrl="https://www.coingecko.com/en/api"
        helpText="Get demo key (optional)"
      />

      <ApiKeyInput
        label="Metals.Dev (Gold, Silver, Platinum)"
        value={metalsKey}
        onChange={setMetalsKey}
        helpUrl="https://metals.dev"
        helpText="Get free key"
      />

      <div className="card space-y-2">
        <h3 className="text-sm font-medium">No key required</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>Foreign Exchange (fawazahmed0/exchange-api) - unlimited, CDN-backed</li>
          <li>CoinGecko basic access works without a key (30 req/min)</li>
        </ul>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium mb-2">Rate Limits</h3>
        <table className="w-full text-xs text-gray-400">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left py-1">API</th>
              <th className="text-left py-1">Limit</th>
              <th className="text-left py-1">Cache TTL</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-1">Finnhub</td><td>60/min</td><td>60s</td></tr>
            <tr><td className="py-1">CoinGecko</td><td>30/min</td><td>120s</td></tr>
            <tr><td className="py-1">Exchange Rate</td><td>Unlimited</td><td>4h</td></tr>
            <tr><td className="py-1">Metals.Dev</td><td>100/month</td><td>30min</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
