"use client";

import React from 'react';
import { CheckCircle2, Terminal, FileText, UserCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RecentActivityData } from '../types';

const activityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'check-circle2': CheckCircle2,
  'terminal': Terminal,
  'file-text': FileText,
  'user-check': UserCheck,
};

interface RecentActivityProps {
  activities: RecentActivityData[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Academic and system event timeline logs</CardDescription>
      </CardHeader>
      <CardContent className="relative flex flex-col gap-6 pl-4 border-l border-zinc-200 dark:border-zinc-800 ml-3 py-1">
        {activities.map((activity) => {
          const IconComponent = activityIcons[activity.icon] || UserCheck;

          return (
            <div key={activity.id} className="relative flex items-start gap-4 group">
              {/* Timeline marker */}
              <div className="absolute -left-7.5 top-0.5 h-6 w-6 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center">
                <IconComponent className="h-3 w-3" />
              </div>

              {/* Activity Details */}
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {activity.actor}
                  </span>{' '}
                  {activity.description}
                </p>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
