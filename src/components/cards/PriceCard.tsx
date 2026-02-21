import { Quote } from '@/types/market';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';

interface PriceCardProps {
  quote?: Quote;
  loading?: boolean;
  onClick?: () => void;
  error?: string | null;
}

export function PriceCard({ quote, loading, onClick, error }: PriceCardProps) {
  if (loading || !quote) return <CardSkeleton />;

  if (error) {
    return (
      <div className="card flex flex-col items-center justify-center min-h-[140px]">
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'card text-left w-full cursor-pointer',
        'hover:scale-[1.02] transition-transform'
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-400 text-sm font-medium">{quote.symbol}</span>
        <Badge value={quote.changePercent} />
      </div>
      <p className="text-xl font-bold tracking-tight mb-0.5">
        {formatPrice(quote.price, quote.currency)}
      </p>
      <p className="text-gray-500 text-xs">{quote.name}</p>
    </button>
  );
}

interface NeedKeyCardProps {
  title: string;
  onSettings: () => void;
}

export function NeedKeyCard({ title, onSettings }: NeedKeyCardProps) {
  return (
    <div className="card flex flex-col items-center justify-center min-h-[140px] gap-2">
      <p className="text-gray-400 text-sm">{title}</p>
      <button onClick={onSettings} className="btn-primary text-sm">
        API Key Settings
      </button>
    </div>
  );
}
