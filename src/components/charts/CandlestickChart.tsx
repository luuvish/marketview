import { useCallback } from 'react';
import { IChartApi } from 'lightweight-charts';
import { LightweightChart } from './LightweightChart';
import { CandleData } from '@/types/market';

interface CandlestickChartProps {
  data: CandleData[];
  height?: number;
  className?: string;
}

export function CandlestickChart({ data, height = 400, className }: CandlestickChartProps) {
  const setupChart = useCallback(
    (chart: IChartApi) => {
      const series = chart.addCandlestickSeries({
        upColor: '#00d4aa',
        downColor: '#ff6b6b',
        borderDownColor: '#ff6b6b',
        borderUpColor: '#00d4aa',
        wickDownColor: '#ff6b6b',
        wickUpColor: '#00d4aa',
      });

      series.setData(
        data.map((d) => ({
          time: d.time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }))
      );
      chart.timeScale().fitContent();
    },
    [data]
  );

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-gray-500"
        style={{ height }}
      >
        No chart data available
      </div>
    );
  }

  return <LightweightChart height={height} className={className} children={setupChart} />;
}
