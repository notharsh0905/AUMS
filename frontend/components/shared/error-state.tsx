import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description: string;
  retryCallback?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  retryCallback,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/20 dark:bg-red-950/5 min-h-[300px] gap-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400">
        <AlertCircle className="h-6 w-6" />
      </div>

      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>

      {retryCallback && (
        <Button
          onClick={retryCallback}
          variant="outline"
          className="mt-2 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-700 dark:text-red-400 hover:text-red-800"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
