export const API_CONFIG = {
  finnhub: {
    baseUrl: 'https://finnhub.io/api/v1',
    rateLimit: 60,
    ratePeriod: 60_000,
    cacheTTL: 60_000,
  },
  coingecko: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    rateLimit: 30,
    ratePeriod: 60_000,
    cacheTTL: 120_000,
  },
  exchangeRate: {
    baseUrl: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1',
    rateLimit: Infinity,
    ratePeriod: 60_000,
    cacheTTL: 4 * 60 * 60_000,
  },
  metals: {
    baseUrl: 'https://api.metals.dev/v1',
    rateLimit: 3,
    ratePeriod: 24 * 60 * 60_000,
    cacheTTL: 30 * 60_000,
  },
} as const;

export type ApiProvider = keyof typeof API_CONFIG;
