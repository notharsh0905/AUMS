"use client";

import React from 'react';
import { AdminRole } from '../../types';
import { Shield, Key } from 'lucide-react';

interface RoleDetailsProps {
  role: AdminRole;
}

export function RoleDetails({ role }: RoleDetailsProps) {
  const samplePermissions = [
    'students.read', 'students.create', 'students.update',
    'faculty.read', 'faculty.create',
    'courses.read', 'course_offerings.read',
    'timetable.read', 'attendance.read', 'attendance.create',
    'assignments.read', 'assignment_submissions.read',
    'examinations.read', 'exam_attempts.read',
    'course_results.read', 'transcripts.read',
  ];

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="p-3 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900">
          <Shield className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50">{role.roleName}</h3>
          <p className="text-xs font-mono text-zinc-500">{role.roleCode}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-zinc-400">Description</span>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 p-3 rounded-lg border border-zinc-100 dark:border-zinc-850">
          {role.description || 'System standard role definition.'}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <Key className="h-3.5 w-3.5" />
          <span>Assigned Permission Policy</span>
        </div>
        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-zinc-100 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/50">
          {samplePermissions.map((perm) => (
            <span
              key={perm}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
            >
              {perm}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
