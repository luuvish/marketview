import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UTCTimestamp } from 'lightweight-charts';
import { LineData, Quote } from '@/types/market';
import { fetchForexQuotes } from '@/services/exchange-rate';

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

interface ForexState {
  quotes: Quote[];
  history: Record<string, LineData[]>;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  fetch: () => Promise<void>;
}

export const useForexStore = create<ForexState>()(
  persist(
    (set) => ({
      quotes: [],
      history: {},
      loading: false,
      error: null,
      lastUpdated: null,
      fetch: async () => {
        set({ loading: true, error: null });
        try {
          const quotes = await fetchForexQuotes();
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
      name: 'forex-market-state',
      partialize: (state) => ({
        quotes: state.quotes,
        history: state.history,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
