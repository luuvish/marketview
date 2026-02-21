import { create } from 'zustand';
import { Quote } from '@/types/market';
import { fetchMetalQuotes } from '@/services/metals';

interface MetalsState {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  fetch: (apiKey: string) => Promise<void>;
}

export const useMetalsStore = create<MetalsState>((set) => ({
  quotes: [],
  loading: false,
  error: null,
  lastUpdated: null,
  fetch: async (apiKey) => {
    if (!apiKey) {
      set({ error: 'Metals.Dev API key required' });
      return;
    }
    set({ loading: true, error: null });
    try {
      const quotes = await fetchMetalQuotes(apiKey);
      set({ quotes, loading: false, lastUpdated: Date.now() });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));
