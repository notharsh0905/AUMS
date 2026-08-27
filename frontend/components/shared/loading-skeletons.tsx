import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading card content"
      aria-busy="true"
      className={cn(
        "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card p-6 flex flex-col gap-4 shadow-sm",
        className
      )}
    >
      <span className="sr-only">Loading card data...</span>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
      </div>
    </div>
  );
}

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading statistic"
      aria-busy="true"
      className={cn(
        "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col gap-2 shadow-sm",
        className
      )}
    >
      <span className="sr-only">Loading metric...</span>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-4 w-4 rounded-md" />
      </div>
      <Skeleton className="h-7 w-16 mt-1" />
      <Skeleton className="h-3 w-28 mt-0.5" />
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  cols = 4,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="Loading table data"
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "rounded-xl border border-zinc-200 dark:border-zinc-800 w-full overflow-hidden bg-white dark:bg-zinc-950 shadow-sm",
        className
      )}
    >
      <span className="sr-only">Loading records, please wait...</span>

      {/* Header Skeleton */}
      <div className="bg-zinc-50/75 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3.5 flex gap-4 items-center">
        {Array.from({ length: cols }).map((_, idx) => (
          <Skeleton
            key={idx}
            className={cn(
              "h-4 rounded",
              idx === 0 ? "w-28 flex-none" : "flex-1",
              idx === cols - 1 ? "max-w-[80px]" : ""
            )}
          />
        ))}
      </div>

      {/* Row Skeletons */}
      <div className="divide-y divide-zinc-150 dark:divide-zinc-850">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="px-6 py-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton
                key={cIdx}
                className={cn(
                  "h-3.5 rounded",
                  cIdx === 0
                    ? "w-24 flex-none"
                    : cIdx === 1
                      ? "w-44 flex-none"
                      : "flex-1",
                  cIdx === cols - 1 ? "max-w-[70px]" : ""
                )}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer / Pagination Skeleton */}
      <div className="px-6 py-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20 flex items-center justify-between">
        <Skeleton className="h-3.5 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function DetailViewSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading details"
      aria-busy="true"
      className={cn("flex flex-col gap-6 p-6", className)}
    >
      <span className="sr-only">Loading detailed view...</span>
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-8">
      {/* Page Header Skeleton */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-8 w-1/3 max-w-sm" />
          <Skeleton className="h-4 w-1/2 max-w-md" />
        </div>
        <Skeleton className="h-10 w-28 mt-2 md:mt-0" />
      </div>

      {/* Metric Cards Skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-40" />
        <TableSkeleton rows={5} cols={5} />
      </div>
    </div>
  );
}
