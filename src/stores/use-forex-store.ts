import { create } from 'zustand';
import { Quote } from '@/types/market';
import { fetchForexQuotes } from '@/services/exchange-rate';

interface ForexState {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  fetch: () => Promise<void>;
}

export const useForexStore = create<ForexState>((set) => ({
  quotes: [],
  loading: false,
  error: null,
  lastUpdated: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const quotes = await fetchForexQuotes();
      set({ quotes, loading: false, lastUpdated: Date.now() });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));
