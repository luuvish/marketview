import { AssetConfig } from '@/types/market';

export const STOCK_ASSETS: AssetConfig[] = [
  { symbol: 'SPY', name: 'S&P 500', category: 'stock' },
  { symbol: 'QQQ', name: 'NASDAQ 100', category: 'stock' },
  { symbol: 'DIA', name: 'Dow Jones', category: 'stock' },
  { symbol: 'AAPL', name: 'Apple', category: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft', category: 'stock' },
  { symbol: 'GOOGL', name: 'Alphabet', category: 'stock' },
  { symbol: 'AMZN', name: 'Amazon', category: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA', category: 'stock' },
  { symbol: 'META', name: 'Meta', category: 'stock' },
  { symbol: 'TSLA', name: 'Tesla', category: 'stock' },
];

export const KOREAN_ASSETS: AssetConfig[] = [
  { symbol: 'EWY', name: 'iShares MSCI Korea', category: 'korean' },
  { symbol: 'PKX', name: 'POSCO', category: 'korean' },
  { symbol: 'KB', name: 'KB Financial', category: 'korean' },
  { symbol: 'KT', name: 'KT Corp', category: 'korean' },
];

export const CRYPTO_ASSETS: AssetConfig[] = [
  { symbol: 'BTC', name: 'Bitcoin', category: 'crypto', apiId: 'bitcoin', currency: 'usd' },
  { symbol: 'ETH', name: 'Ethereum', category: 'crypto', apiId: 'ethereum', currency: 'usd' },
  { symbol: 'BNB', name: 'BNB', category: 'crypto', apiId: 'binancecoin', currency: 'usd' },
  { symbol: 'XRP', name: 'XRP', category: 'crypto', apiId: 'ripple', currency: 'usd' },
  { symbol: 'SOL', name: 'Solana', category: 'crypto', apiId: 'solana', currency: 'usd' },
  { symbol: 'ADA', name: 'Cardano', category: 'crypto', apiId: 'cardano', currency: 'usd' },
  { symbol: 'DOGE', name: 'Dogecoin', category: 'crypto', apiId: 'dogecoin', currency: 'usd' },
];

export const FOREX_PAIRS: AssetConfig[] = [
  { symbol: 'USD/KRW', name: 'Dollar / Won', category: 'forex', apiId: 'krw', currency: 'usd' },
  { symbol: 'EUR/USD', name: 'Euro / Dollar', category: 'forex', apiId: 'usd', currency: 'eur' },
  { symbol: 'USD/JPY', name: 'Dollar / Yen', category: 'forex', apiId: 'jpy', currency: 'usd' },
  { symbol: 'GBP/USD', name: 'Pound / Dollar', category: 'forex', apiId: 'usd', currency: 'gbp' },
];

export const METAL_ASSETS: AssetConfig[] = [
  { symbol: 'XAU', name: 'Gold', category: 'metal', apiId: 'gold' },
  { symbol: 'XAG', name: 'Silver', category: 'metal', apiId: 'silver' },
  { symbol: 'XPT', name: 'Platinum', category: 'metal', apiId: 'platinum' },
];

export const ALL_ASSETS = [
  ...STOCK_ASSETS,
  ...KOREAN_ASSETS,
  ...CRYPTO_ASSETS,
  ...FOREX_PAIRS,
  ...METAL_ASSETS,
];
