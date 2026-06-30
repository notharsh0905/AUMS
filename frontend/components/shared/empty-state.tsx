import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon | React.ComponentType<{ className?: string }> | React.ReactNode;
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionButton,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 min-h-[320px] gap-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600">
        {Icon ? (
          typeof Icon === 'function' ? (
            React.createElement(Icon as React.ComponentType<{ className?: string }>, {
              className: 'h-6 w-6',
            })
          ) : (
            (Icon as React.ReactNode)
          )
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
        )}
      </div>

      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>

      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  );
}
