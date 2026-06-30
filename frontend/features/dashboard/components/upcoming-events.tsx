"use client";

import React from 'react';
import { Award, Users, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UpcomingEventData } from '../types';
import { cn } from '@/lib/utils';

const typeConfig = {
  exam: {
    icon: Award,
    colorClass: 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400',
  },
  meeting: {
    icon: Users,
    colorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400',
  },
  holiday: {
    icon: Calendar,
    colorClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400',
  },
};

interface UpcomingEventsProps {
  events: UpcomingEventData[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Academic schedules and calendar holidays</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {events.map((event) => {
          const config = typeConfig[event.type] || typeConfig.meeting;
          const IconComponent = config.icon;

          return (
            <div key={event.id} className="flex items-center gap-3.5">
              <div className={cn("p-2 rounded-lg flex-shrink-0", config.colorClass)}>
                <IconComponent className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                  {event.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {event.date}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
