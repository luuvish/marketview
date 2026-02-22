import type { Time } from 'lightweight-charts';

export interface Quote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  timestamp: number;
  currency?: string;
  category: AssetCategory;
}

export type AssetCategory = 'stock' | 'crypto' | 'forex' | 'metal' | 'korean';

export interface CandleData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface LineData {
  time: Time;
  value: number;
}

export interface AssetConfig {
  symbol: string;
  name: string;
  category: AssetCategory;
  apiId?: string;
  currency?: string;
}

export interface ApiStatus {
  name: string;
  healthy: boolean;
  remainingCalls?: number;
  lastCheck: number;
}

export type ChartType = 'candlestick' | 'area';
export type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y';
