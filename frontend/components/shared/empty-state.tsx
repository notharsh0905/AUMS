import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon | React.ComponentType<{ className?: string }> | React.ReactNode;
  title: string;
  description: string;
  actionButton?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionButton,
  secondaryAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 min-h-[300px] gap-4 w-full",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 border border-zinc-200/60 dark:border-zinc-700/60 shadow-xs">
        {Icon ? (
          typeof Icon === 'function' ? (
            React.createElement(Icon as React.ComponentType<{ className?: string }>, {
              className: 'h-6 w-6',
            })
          ) : (
            (Icon as React.ReactNode)
          )
        ) : (
          <Inbox className="h-6 w-6" />
        )}
      </div>

      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>

      {(actionButton || secondaryAction) && (
        <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
          {actionButton}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
