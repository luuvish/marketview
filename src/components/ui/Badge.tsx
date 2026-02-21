import { cn } from '@/utils/cn';
import { formatPercent } from '@/utils/format';

interface BadgeProps {
  value: number;
  className?: string;
}

export function Badge({ value, className }: BadgeProps) {
  const isPositive = value >= 0;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-medium',
        isPositive ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red',
        className
      )}
    >
      {isPositive ? '▲' : '▼'} {formatPercent(value)}
    </span>
  );
}
