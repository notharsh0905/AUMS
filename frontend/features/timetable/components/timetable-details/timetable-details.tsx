"use client";

import React from 'react';
import { TimetableSlot } from '../../types';
import { cn } from '@/lib/utils';

interface TimetableDetailsProps {
  slot: TimetableSlot;
}

export function TimetableDetails({ slot }: TimetableDetailsProps) {
  const details = [
    { label: 'Slot ID', value: slot.timetableSlotId },
    { label: 'Course Code', value: slot.courseCode },
    { label: 'Course Name', value: slot.courseName },
    { label: 'Faculty Name', value: slot.facultyName },
    { label: 'Day of Week', value: slot.dayOfWeek },
    { label: 'Schedule Time', value: `${slot.startTime} - ${slot.endTime}` },
    { label: 'Room & Building', value: `${slot.classroom} (${slot.building})` },
    { label: 'Section', value: slot.section },
    { label: 'Max Capacity', value: slot.maxCapacity.toString() },
    { label: 'Department', value: slot.department },
    { label: 'Program', value: slot.program },
    { label: 'Academic Year', value: slot.academicYear },
    { label: 'Semester', value: slot.semester },
    { label: 'Entry Type', value: slot.entryType },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <div className="h-12 w-12 rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center font-bold text-lg select-none">
          {slot.courseCode.charAt(0)}
          {slot.dayOfWeek.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {slot.courseCode} - {slot.courseName}
          </h4>
          <span
            className={cn(
              "inline-flex items-center self-start rounded-md px-2 py-0.5 mt-1 text-[10px] font-semibold ring-1 ring-inset uppercase tracking-wide",
              slot.status === 'ACTIVE' &&
                "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
              slot.status === 'PLANNED' &&
                "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
              slot.status === 'COMPLETED' &&
                "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20",
              slot.status === 'CANCELLED' &&
                "bg-red-50 text-red-750 ring-red-500/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20"
            )}
          >
            {slot.status}
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
