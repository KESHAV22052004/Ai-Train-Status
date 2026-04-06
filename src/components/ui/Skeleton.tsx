interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/[0.06] ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-4">
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-[300px] w-full rounded-xl" />
    </div>
  );
}
