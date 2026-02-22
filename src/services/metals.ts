import { apiFetch } from './api-client';
import { Quote } from '@/types/market';

interface MetalsMap {
  gold?: number;
  silver?: number;
  platinum?: number;
  palladium?: number;
}

interface MetalsResponse {
  status?: string;
  error?: string;
  message?: string;
  metals?: MetalsMap;
}

export async function fetchMetalQuotes(apiKey: string): Promise<Quote[]> {
  const data = await apiFetch<MetalsResponse>({
    provider: 'metals',
    endpoint: 'https://api.metals.dev/v1/latest',
    params: {
      api_key: apiKey,
      currency: 'USD',
      unit: 'toz',
    },
  });

  if (data.status && data.status !== 'success') {
    throw new Error(data.error ?? data.message ?? 'Metals API request failed');
  }

  if (!data.metals) {
    throw new Error(
      data.error ??
        data.message ??
        'Unexpected Metals API response: missing metals payload'
    );
  }

  const metals = [
    { symbol: 'XAU', name: 'Gold', key: 'gold' as const },
    { symbol: 'XAG', name: 'Silver', key: 'silver' as const },
    { symbol: 'XPT', name: 'Platinum', key: 'platinum' as const },
  ];

  const quotes: Quote[] = [];
  const timestamp = Date.now();

  for (const metal of metals) {
    const price = data.metals?.[metal.key];
    if (typeof price !== 'number' || !Number.isFinite(price)) {
      continue;
    }

    quotes.push({
      symbol: metal.symbol,
      name: metal.name,
      price,
      change: 0,
      changePercent: 0,
      timestamp,
      currency: 'USD',
      category: 'metal',
    });
  }

  if (quotes.length === 0) {
    throw new Error('No metal rates available from Metals API');
  }

  return quotes;
}
