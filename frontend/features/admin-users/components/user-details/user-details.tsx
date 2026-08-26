"use client";

import React from 'react';
import { AdminUser } from '../../types';
import { UserCheck, Mail, Phone } from 'lucide-react';
import { StatusBadge } from '@/components/shared/status-badge';

interface UserDetailsProps {
  user: AdminUser;
}

export function UserDetails({ user }: UserDetailsProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="p-3 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900">
          <UserCheck className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-xs font-mono text-zinc-500">@{user.username}</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-850">
        <span className="text-xs font-medium text-zinc-400">Account Status</span>
        <StatusBadge status={user.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-zinc-100 dark:border-zinc-850">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
            <Mail className="h-3.5 w-3.5" />
            <span>Email</span>
          </div>
          <span className="text-zinc-800 dark:text-zinc-200 truncate">{user.email}</span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-zinc-100 dark:border-zinc-850">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
            <Phone className="h-3.5 w-3.5" />
            <span>Phone</span>
          </div>
          <span className="text-zinc-800 dark:text-zinc-200">{user.phoneNumber || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
