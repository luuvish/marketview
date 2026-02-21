import { apiFetch } from './api-client';
import { Quote } from '@/types/market';

interface MetalsResponse {
  status: string;
  metals: {
    gold: number;
    silver: number;
    platinum: number;
    palladium: number;
  };
}

export async function fetchMetalQuotes(apiKey: string): Promise<Quote[]> {
  const data = await apiFetch<MetalsResponse>({
    provider: 'metals',
    endpoint: 'https://api.metals.dev/v1/metal/latest',
    params: {
      api_key: apiKey,
      currency: 'USD',
    },
  });

  const metals = [
    { symbol: 'XAU', name: 'Gold', key: 'gold' as const },
    { symbol: 'XAG', name: 'Silver', key: 'silver' as const },
    { symbol: 'XPT', name: 'Platinum', key: 'platinum' as const },
  ];

  return metals.map((metal) => ({
    symbol: metal.symbol,
    name: metal.name,
    price: data.metals[metal.key],
    change: 0,
    changePercent: 0,
    timestamp: Date.now(),
    currency: 'USD',
    category: 'metal' as const,
  }));
}
