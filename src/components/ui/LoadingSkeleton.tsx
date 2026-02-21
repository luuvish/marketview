import { cn } from '@/utils/cn';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn('animate-pulse space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-gray-700/50 rounded',
            i === 0 && 'w-3/4',
            i === 1 && 'w-1/2',
            i >= 2 && 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-3" />
      <div className="h-8 bg-gray-700/50 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-700/50 rounded w-1/3 mb-4" />
      <div className="h-16 bg-gray-700/50 rounded w-full" />
    </div>
  );
}
