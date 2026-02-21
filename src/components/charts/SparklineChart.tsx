import { useCallback } from 'react';
import { IChartApi } from 'lightweight-charts';
import { LightweightChart } from './LightweightChart';
import { LineData } from '@/types/market';

interface SparklineChartProps {
  data: LineData[];
  color?: string;
  height?: number;
  className?: string;
}

export function SparklineChart({
  data,
  color = '#00d4aa',
  height = 60,
  className,
}: SparklineChartProps) {
  const setupChart = useCallback(
    (chart: IChartApi) => {
      chart.applyOptions({
        rightPriceScale: { visible: false },
        timeScale: { visible: false },
        grid: {
          vertLines: { visible: false },
          horzLines: { visible: false },
        },
        crosshair: {
          vertLine: { visible: false },
          horzLine: { visible: false },
        },
        handleScroll: false,
        handleScale: false,
      });

      const series = chart.addAreaSeries({
        lineColor: color,
        topColor: `${color}33`,
        bottomColor: `${color}05`,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });

      series.setData(data.map((d) => ({ time: d.time, value: d.value })));
      chart.timeScale().fitContent();
    },
    [data, color]
  );

  if (data.length === 0) return null;

  return <LightweightChart height={height} className={className} children={setupChart} />;
}
