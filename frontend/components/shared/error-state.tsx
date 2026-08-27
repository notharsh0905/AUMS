import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description: string;
  retryCallback?: () => void;
}

export function ErrorState({
  title = 'Failed to load records',
  description,
  retryCallback,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-xl border border-red-200/80 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10 min-h-[300px] gap-4 w-full shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 shadow-xs">
        <AlertCircle className="h-6 w-6" />
      </div>

      <div className="flex flex-col gap-1.5 max-w-md">
        <h3 className="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>

      {retryCallback && (
        <Button
          onClick={retryCallback}
          variant="outline"
          size="sm"
          className="mt-2 border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-700 dark:text-red-400 hover:text-red-800 gap-1.5 h-8.5 text-xs font-semibold"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Request</span>
        </Button>
      )}
    </div>
  );
}
