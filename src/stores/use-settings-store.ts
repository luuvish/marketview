import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  finnhubKey: string;
  coingeckoKey: string;
  metalsKey: string;
  showOnboarding: boolean;
  setFinnhubKey: (key: string) => void;
  setCoingeckoKey: (key: string) => void;
  setMetalsKey: (key: string) => void;
  dismissOnboarding: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      finnhubKey: import.meta.env.VITE_FINNHUB_KEY ?? '',
      coingeckoKey: import.meta.env.VITE_COINGECKO_KEY ?? '',
      metalsKey: import.meta.env.VITE_METALS_KEY ?? '',
      showOnboarding: true,
      setFinnhubKey: (key) => set({ finnhubKey: key }),
      setCoingeckoKey: (key) => set({ coingeckoKey: key }),
      setMetalsKey: (key) => set({ metalsKey: key }),
      dismissOnboarding: () => set({ showOnboarding: false }),
    }),
    { name: 'trade-settings' }
  )
);
