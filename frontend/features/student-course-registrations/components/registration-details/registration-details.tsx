"use client";

import React from 'react';
import { StudentCourseRegistration } from '../../types';
import { cn } from '@/lib/utils';

interface RegistrationDetailsProps {
  registration: StudentCourseRegistration;
}

export function RegistrationDetails({ registration }: RegistrationDetailsProps) {
  const details = [
    { label: 'Registration ID', value: registration.studentCourseRegistrationId },
    { label: 'Student Name', value: registration.studentName },
    { label: 'Student ID', value: registration.studentId },
    { label: 'Roll Number', value: registration.rollNumber },
    { label: 'Course Code', value: registration.courseCode },
    { label: 'Course Name', value: registration.courseName },
    { label: 'Allocated Faculty', value: registration.facultyName },
    { label: 'Program', value: registration.program },
    { label: 'Department', value: registration.department },
    { label: 'Academic Year', value: registration.academicYear },
    { label: 'Semester', value: registration.semester },
    { label: 'Registration Date', value: registration.registeredAt },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <div className="h-12 w-12 rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center font-bold text-lg select-none">
          {registration.studentName.charAt(0)}
          {registration.courseCode.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {registration.studentName}
          </h4>
          <span
            className={cn(
              "inline-flex items-center self-start rounded-md px-2 py-0.5 mt-1 text-[10px] font-semibold ring-1 ring-inset uppercase tracking-wide",
              registration.registrationStatus === 'REGISTERED' &&
                "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
              registration.registrationStatus === 'DROPPED' &&
                "bg-red-50 text-red-755 ring-red-500/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
              registration.registrationStatus === 'COMPLETED' &&
                "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20",
              registration.registrationStatus === 'FAILED' &&
                "bg-red-50 text-red-750 ring-red-500/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20"
            )}
          >
            {registration.registrationStatus}
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
