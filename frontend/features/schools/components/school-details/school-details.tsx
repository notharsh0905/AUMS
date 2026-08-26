"use client";

import React from 'react';
import { School } from '../../types';
import { Building2 } from 'lucide-react';

interface SchoolDetailsProps {
  school: School;
}

export function SchoolDetails({ school }: SchoolDetailsProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="p-3 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50">{school.schoolName}</h3>
          <p className="text-xs font-mono text-zinc-500">{school.schoolCode}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 text-sm">
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-zinc-100 dark:border-zinc-850">
          <span className="text-xs font-medium text-zinc-400">Campus</span>
          <span className="text-zinc-800 dark:text-zinc-200">{school.campusName || 'Main Campus'}</span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-zinc-100 dark:border-zinc-850">
          <span className="text-xs font-medium text-zinc-400">Description</span>
          <span className="text-zinc-800 dark:text-zinc-200">{school.description || 'No description provided.'}</span>
        </div>
      </div>
    </div>
  );
}
