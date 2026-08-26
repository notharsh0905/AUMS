"use client";

import React from 'react';
import { Campus } from '../../types';
import { Building2 } from 'lucide-react';

interface CampusDetailsProps {
  campus: Campus;
}

export function CampusDetails({ campus }: CampusDetailsProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="p-3 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50">{campus.campusName}</h3>
          <p className="text-xs font-mono text-zinc-500">{campus.campusCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-zinc-100 dark:border-zinc-850">
          <span className="text-xs font-medium text-zinc-400">Address</span>
          <span className="text-zinc-800 dark:text-zinc-200">{campus.addressLine1 || 'N/A'}</span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-zinc-100 dark:border-zinc-850">
          <span className="text-xs font-medium text-zinc-400">City / State</span>
          <span className="text-zinc-800 dark:text-zinc-200">{campus.city || 'N/A'}, {campus.state || 'N/A'}</span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-zinc-100 dark:border-zinc-850">
          <span className="text-xs font-medium text-zinc-400">Country</span>
          <span className="text-zinc-800 dark:text-zinc-200">{campus.country || 'N/A'}</span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-zinc-100 dark:border-zinc-850">
          <span className="text-xs font-medium text-zinc-400">Postal Code</span>
          <span className="text-zinc-800 dark:text-zinc-200">{campus.postalCode || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
