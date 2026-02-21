interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export class TTLCache {
  private prefix: string;

  constructor(prefix = 'trade') {
    this.prefix = prefix;
  }

  private key(k: string): string {
    return `${this.prefix}:${k}`;
  }

  get<T>(k: string): T | null {
    try {
      const raw = localStorage.getItem(this.key(k));
      if (!raw) return null;
      const entry: CacheEntry<T> = JSON.parse(raw);
      if (Date.now() > entry.expiry) {
        localStorage.removeItem(this.key(k));
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  }

  set<T>(k: string, data: T, ttl: number): void {
    try {
      const entry: CacheEntry<T> = { data, expiry: Date.now() + ttl };
      localStorage.setItem(this.key(k), JSON.stringify(entry));
    } catch {
      // localStorage full — evict oldest entries
      this.evict();
    }
  }

  remove(k: string): void {
    localStorage.removeItem(this.key(k));
  }

  private evict(): void {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix + ':')) {
        keys.push(key);
      }
    }
    // Remove first 10 entries
    keys.slice(0, 10).forEach((k) => localStorage.removeItem(k));
  }
}

export const cache = new TTLCache();
