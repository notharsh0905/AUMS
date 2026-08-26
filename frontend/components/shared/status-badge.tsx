"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'completed'
  | 'archived'
  | 'published'
  | 'draft'
  | 'pass'
  | 'fail'
  | 'present'
  | 'absent'
  | 'late'
  | 'excused'
  | 'neutral';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const normStatus = status.toLowerCase();

  const getVariantStyles = (): string => {
    const v = variant || normStatus;
    switch (v) {
      case 'active':
      case 'published':
      case 'completed':
      case 'pass':
      case 'present':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';

      case 'pending':
      case 'late':
      case 'draft':
      case 'upcoming':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';

      case 'inactive':
      case 'archived':
      case 'excused':
        return 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800';

      case 'fail':
      case 'absent':
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';

      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors',
        getVariantStyles(),
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}
