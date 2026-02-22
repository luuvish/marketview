import { useCallback } from 'react';
import { IChartApi } from 'lightweight-charts';
import { LightweightChart } from './LightweightChart';
import { LineData } from '@/types/market';

interface LineChartProps {
  data: LineData[];
  color?: string;
  height?: number;
  className?: string;
}

export function LineChart({
  data,
  color = '#4fc3f7',
  height = 360,
  className,
}: LineChartProps) {
  const setupChart = useCallback(
    (chart: IChartApi) => {
      const series = chart.addLineSeries({
        color,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
      });

      try {
        series.setData(data.map((point) => ({ time: point.time, value: point.value })));
        chart.timeScale().fitContent();
      } catch (error) {
        console.error('Failed to render line chart data', error);
      }
    },
    [data, color]
  );

  if (data.length === 0) {
    return (
      <div
        className="h-[360px] flex items-center justify-center text-gray-500"
        style={{ height }}
      >
        No chart data available yet
      </div>
    );
  }

  return <LightweightChart height={height} className={className} children={setupChart} />;
}
