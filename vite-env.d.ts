/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FINNHUB_KEY?: string;
  readonly VITE_COINGECKO_KEY?: string;
  readonly VITE_METALS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
