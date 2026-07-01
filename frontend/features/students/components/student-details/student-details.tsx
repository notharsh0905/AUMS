"use client";

import React from 'react';
import { Student } from '../../types';
import { cn } from '@/lib/utils';

interface StudentDetailsProps {
  student: Student;
}

export function StudentDetails({ student }: StudentDetailsProps) {
  const details = [
    { label: 'Student ID', value: student.studentId },
    { label: 'Roll Number', value: student.rollNumber },
    { label: 'Full Name', value: `${student.firstName} ${student.lastName}` },
    { label: 'Email Address', value: student.email },
    { label: 'Phone Number', value: student.phone },
    { label: 'Gender', value: student.gender.charAt(0).toUpperCase() + student.gender.slice(1) },
    { label: 'Date of Birth', value: student.dateOfBirth },
    { label: 'Department', value: student.department },
    { label: 'Program', value: student.program },
    { label: 'Semester', value: `Semester ${student.semester}` },
    { label: 'Admission Date', value: student.admissionDate },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header Block */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <div className="h-12 w-12 rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center font-bold text-lg select-none">
          {student.firstName.charAt(0)}
          {student.lastName.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {student.firstName} {student.lastName}
          </h4>
          <span
            className={cn(
              "inline-flex items-center self-start rounded-md px-2 py-0.5 mt-1 text-[10px] font-semibold ring-1 ring-inset uppercase tracking-wide",
              student.status === 'active' &&
                "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
              student.status === 'inactive' &&
                "bg-zinc-50 text-zinc-600 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20",
              student.status === 'suspended' &&
                "bg-red-50 text-red-750 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
              student.status === 'graduated' &&
                "bg-blue-50 text-blue-750 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20"
            )}
          >
            {student.status}
          </span>
        </div>
      </div>

      {/* Details Grid list */}
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
