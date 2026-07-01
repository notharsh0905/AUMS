"use client";

import React from 'react';
import { Faculty } from '../../types';
import { cn } from '@/lib/utils';

interface FacultyDetailsProps {
  faculty: Faculty;
}

export function FacultyDetails({ faculty }: FacultyDetailsProps) {
  const details = [
    { label: 'Faculty ID', value: faculty.facultyId },
    { label: 'Employee ID', value: faculty.employeeCode },
    { label: 'Full Name', value: `${faculty.firstName} ${faculty.lastName}` },
    { label: 'Email Address', value: faculty.email },
    { label: 'Phone Number', value: faculty.phone },
    { label: 'Department', value: faculty.department },
    { label: 'Designation', value: faculty.designation.replace('_', ' ') },
    { label: 'Employment Type', value: faculty.employmentType.replace('_', ' ') },
    { label: 'Joining Date', value: faculty.joiningDate },
    { label: 'Years of Experience', value: faculty.yearsOfExperience },
    { label: 'Office Location', value: faculty.officeLocation },
    { label: 'Bio', value: faculty.bio },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <div className="h-12 w-12 rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center font-bold text-lg select-none">
          {faculty.firstName.charAt(0)}
          {faculty.lastName.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {faculty.firstName} {faculty.lastName}
          </h4>
          <span
            className={cn(
              "inline-flex items-center self-start rounded-md px-2 py-0.5 mt-1 text-[10px] font-semibold ring-1 ring-inset uppercase tracking-wide",
              faculty.status === 'active' &&
                "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
              faculty.status === 'on_leave' &&
                "bg-yellow-50 text-yellow-750 ring-yellow-600/10 dark:bg-yellow-500/10 dark:text-yellow-400 dark:ring-yellow-500/20",
              faculty.status === 'suspended' &&
                "bg-red-50 text-red-750 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
              (faculty.status === 'retired' || faculty.status === 'resigned') &&
                "bg-zinc-50 text-zinc-600 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20"
            )}
          >
            {faculty.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 border-t border-zinc-100 dark:border-zinc-900 pt-4">
        {details.map((detail) => (
          <div key={detail.label} className="flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {detail.label}
            </span>
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {detail.value || 'N/A'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
