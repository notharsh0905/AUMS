"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SystemStatusData } from '../types';
import { cn } from '@/lib/utils';

const statusConfig = {
  healthy: {
    label: 'Healthy',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    dotClass: 'bg-emerald-500',
  },
  warning: {
    label: 'Warning',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  offline: {
    label: 'Offline',
    badgeClass: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    dotClass: 'bg-red-500',
  },
};

interface SystemStatusProps {
  statuses: SystemStatusData[];
}

export function SystemStatus({ statuses }: SystemStatusProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>System Diagnostics Status</CardTitle>
        <CardDescription>Mock heartbeat indicators</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3.5">
        {statuses.map((item) => {
          const config = statusConfig[item.status] || statusConfig.healthy;

          return (
            <div key={item.name} className="flex items-center justify-between gap-4 py-0.5">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {item.name}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border",
                  config.badgeClass
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
                {config.label}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
