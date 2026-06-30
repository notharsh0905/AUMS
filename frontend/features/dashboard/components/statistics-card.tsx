"use client";

import React from 'react';
import {
  Users,
  GraduationCap,
  School,
  BookOpen,
  UserCheck,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCardData } from '../types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'users': Users,
  'graduation-cap': GraduationCap,
  'school': School,
  'book-open': BookOpen,
  'user-check': UserCheck,
  'calendar': Calendar,
};

interface StatisticsCardProps {
  data: StatCardData;
  isLoading?: boolean;
}

export function StatisticsCard({ data, isLoading = false }: StatisticsCardProps) {
  const IconComponent = iconMap[data.icon] || Users;

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-5 rounded-md" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-36" />
        </CardContent>
      </Card>
    );
  }

  const renderTrend = () => {
    if (data.percentageChange === undefined || data.percentageChange === null) return null;
    const isUp = data.trend === 'up';
    const isDown = data.trend === 'down';

    return (
      <div className="flex items-center gap-1 mt-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded",
            isUp && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            isDown && "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
            !isUp && !isDown && "bg-zinc-50 dark:bg-zinc-950 text-zinc-500"
          )}
        >
          {isUp && <ArrowUpRight className="h-3 w-3" />}
          {isDown && <ArrowDownRight className="h-3 w-3" />}
          {!isUp && !isDown && <Minus className="h-3 w-3" />}
          {Math.abs(data.percentageChange)}%
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">vs last semester</span>
      </div>
    );
  };

  return (
    <Card className="shadow-sm hover:ring-1 hover:ring-zinc-200 dark:hover:ring-zinc-800 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            {data.title}
          </CardTitle>
        </div>
        <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <IconComponent className="h-4.5 w-4.5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {data.value}
        </div>
        {renderTrend()}
      </CardContent>
    </Card>
  );
}
