import { useEffect, useRef } from 'react';
import { createChart, IChartApi, DeepPartial, ChartOptions } from 'lightweight-charts';

interface LightweightChartProps {
  width?: number;
  height?: number;
  children?: (chart: IChartApi) => void;
  className?: string;
}

const defaultOptions: DeepPartial<ChartOptions> = {
  layout: {
    background: { color: 'transparent' },
    textColor: '#9ca3af',
    fontSize: 12,
  },
  grid: {
    vertLines: { color: 'rgba(75, 85, 99, 0.2)' },
    horzLines: { color: 'rgba(75, 85, 99, 0.2)' },
  },
  crosshair: {
    vertLine: { labelBackgroundColor: '#1a1a2e' },
    horzLine: { labelBackgroundColor: '#1a1a2e' },
  },
  timeScale: {
    borderColor: 'rgba(75, 85, 99, 0.3)',
    timeVisible: true,
  },
  rightPriceScale: {
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
};

export function LightweightChart({ height = 400, children, className }: LightweightChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      ...defaultOptions,
      width: containerRef.current.clientWidth,
      height,
    });

    chartRef.current = chart;
    children?.(chart);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [height, children]);

  return <div ref={containerRef} className={className} />;
}
