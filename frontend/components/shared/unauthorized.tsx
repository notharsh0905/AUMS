"use client";

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnauthorizedProps {
  title?: string;
  description?: string;
}

export function Unauthorized({
  title = 'Access Denied',
  description = 'You do not have the required roles or permissions to view this resource.',
}: UnauthorizedProps) {
  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 min-h-[400px] gap-4">
      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400">
        <ShieldAlert className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      <Button onClick={handleGoBack} variant="outline" className="mt-2">
        Go Back
      </Button>
    </div>
  );
}
