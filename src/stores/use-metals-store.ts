import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UTCTimestamp } from 'lightweight-charts';
import { LineData, Quote } from '@/types/market';
import { fetchMetalQuotes } from '@/services/metals';

const MAX_HISTORY_POINTS = 240;

function mergeHistory(
  current: Record<string, LineData[]>,
  quotes: Quote[],
  timestampMs: number
): Record<string, LineData[]> {
  const timestamp = Math.floor(timestampMs / 1000) as UTCTimestamp;
  const nextHistory = { ...current };

  for (const quote of quotes) {
    const prev = nextHistory[quote.symbol] ?? [];
    const point: LineData = {
      time: timestamp,
      value: quote.price,
    };

    if (prev.length === 0) {
      nextHistory[quote.symbol] = [point];
      continue;
    }

    const updated = [...prev];
    const last = updated[updated.length - 1];
    if (Number(last.time) === timestamp) {
      updated[updated.length - 1] = point;
    } else {
      updated.push(point);
    }

    nextHistory[quote.symbol] = updated.slice(-MAX_HISTORY_POINTS);
  }

  return nextHistory;
}

interface MetalsState {
  quotes: Quote[];
  history: Record<string, LineData[]>;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  fetch: (apiKey: string) => Promise<void>;
}

export const useMetalsStore = create<MetalsState>()(
  persist(
    (set) => ({
      quotes: [],
      history: {},
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
          const fetchedAt = Date.now();
          set((state) => ({
            quotes,
            history: mergeHistory(state.history, quotes, fetchedAt),
            loading: false,
            lastUpdated: fetchedAt,
          }));
        } catch (err) {
          set({ error: (err as Error).message, loading: false });
        }
      },
    }),
    {
      name: 'metals-market-state',
      partialize: (state) => ({
        quotes: state.quotes,
        history: state.history,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
