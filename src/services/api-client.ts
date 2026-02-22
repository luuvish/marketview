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
  timeoutMs?: number;
}

export async function apiFetch<T>(options: FetchOptions): Promise<T> {
  const { provider, endpoint, params, cacheTTL, timeoutMs } = options;
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
    const controller = new AbortController();
    const timeoutId = timeoutMs
      ? setTimeout(() => controller.abort(), timeoutMs)
      : null;

    try {
      const res = await fetch(url.toString(), { signal: controller.signal });
      if (!res.ok) {
        let detail = '';
        try {
          const text = (await res.text()).trim();
          if (text) {
            const compact = text.replace(/\s+/g, ' ').slice(0, 200);
            detail = ` - ${compact}`;
          }
        } catch {
          // Ignore body parse failures for non-OK responses.
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}${detail}`);
      }
      const data = (await res.json()) as T;
      cache.set(cacheKey, data, ttl);
      return data;
    } catch (err) {
      const error = err as Error;
      lastError =
        error.name === 'AbortError' && timeoutMs
          ? new Error(`Request timed out after ${timeoutMs}ms`)
          : error;
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  throw lastError ?? new Error('Fetch failed');
}

export function getRateLimiterStatus(provider: ApiProvider): number {
  return getLimiter(provider).remaining;
}
