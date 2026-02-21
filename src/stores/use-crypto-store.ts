import { create } from 'zustand';
import { Quote } from '@/types/market';
import { fetchCryptoQuotes } from '@/services/coingecko';

interface CryptoState {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  fetch: (apiKey?: string) => Promise<void>;
}

export const useCryptoStore = create<CryptoState>((set) => ({
  quotes: [],
  loading: false,
  error: null,
  lastUpdated: null,
  fetch: async (apiKey) => {
    set({ loading: true, error: null });
    try {
      const quotes = await fetchCryptoQuotes(apiKey);
      set({ quotes, loading: false, lastUpdated: Date.now() });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));
