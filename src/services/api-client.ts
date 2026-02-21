import { cache } from './cache';
import { RateLimiter } from './rate-limiter';
import { API_CONFIG, ApiProvider } from '@/config/api';

const rateLimiters: Partial<Record<ApiProvider, RateLimiter>> = {};

function getLimiter(provider: ApiProvider): RateLimiter {
  if (!rateLimiters[provider]) {
    const config = API_CONFIG[provider];
    rateLimiters[provider] = new RateLimiter(config.rateLimit, config.ratePeriod);
  }
  return rateLimiters[provider];
}

interface FetchOptions {
  provider: ApiProvider;
  endpoint: string;
  params?: Record<string, string>;
  cacheTTL?: number;
}

export async function apiFetch<T>(options: FetchOptions): Promise<T> {
  const { provider, endpoint, params, cacheTTL } = options;
  const config = API_CONFIG[provider];
  const ttl = cacheTTL ?? config.cacheTTL;

  const url = new URL(endpoint, config.baseUrl);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const cacheKey = `${provider}:${url.toString()}`;

  // Check cache
  const cached = cache.get<T>(cacheKey);
  if (cached !== null) return cached;

  // Rate limit
  const limiter = getLimiter(provider);
  if (!limiter.canConsume()) {
    // Try cache even if expired
    const stale = cache.get<T>(cacheKey);
    if (stale !== null) return stale;
    await limiter.waitForToken();
  } else {
    limiter.consume();
  }

  // Fetch with retry
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = (await res.json()) as T;
      cache.set(cacheKey, data, ttl);
      return data;
    } catch (err) {
      lastError = err as Error;
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError ?? new Error('Fetch failed');
}

export function getRateLimiterStatus(provider: ApiProvider): number {
  return getLimiter(provider).remaining;
}
