import { create } from 'zustand';
import { Quote } from '@/types/market';
import { fetchStockQuotes } from '@/services/finnhub';
import { STOCK_ASSETS } from '@/config/assets';

interface StockState {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  fetch: (apiKey: string) => Promise<void>;
}

export const useStockStore = create<StockState>((set) => ({
  quotes: [],
  loading: false,
  error: null,
  lastUpdated: null,
  fetch: async (apiKey) => {
    if (!apiKey) {
      set({ error: 'Finnhub API key required' });
      return;
    }
    set({ loading: true, error: null });
    try {
      const quotes = await fetchStockQuotes(
        STOCK_ASSETS.map((a) => ({ symbol: a.symbol, name: a.name })),
        apiKey,
        'stock'
      );
      set({ quotes, loading: false, lastUpdated: Date.now() });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));
