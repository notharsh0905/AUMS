"use client";

import React from 'react';
import { Info, AlertTriangle, AlertOctagon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { NotificationData } from '../types';
import { cn } from '@/lib/utils';

const priorityConfig = {
  high: {
    icon: AlertOctagon,
    colorClass: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  },
  medium: {
    icon: AlertTriangle,
    colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  },
  low: {
    icon: Info,
    colorClass: 'text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800',
    badge: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300',
  },
};

interface NotificationsPanelProps {
  notifications: NotificationData[];
}

export function NotificationsPanel({ notifications }: NotificationsPanelProps) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="flex items-center gap-2">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white dark:bg-zinc-50 dark:text-zinc-950">
                {unreadCount}
              </span>
            )}
          </CardTitle>
          <CardDescription>Critical alerts and administrative notifications</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {notifications.map((notif) => {
          const config = priorityConfig[notif.priority] || priorityConfig.low;
          const IconComponent = config.icon;

          return (
            <div
              key={notif.id}
              className={cn(
                "p-3 rounded-xl border flex items-start gap-3 relative transition-all",
                config.colorClass,
                notif.unread && "ring-1 ring-offset-0 ring-zinc-900 dark:ring-zinc-50"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded", config.badge)}>
                    {notif.priority}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-sm font-medium leading-normal text-zinc-800 dark:text-zinc-200">
                  {notif.title}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
