"use client";

import React from 'react';
import { Assignment } from '../../types';
import { cn } from '@/lib/utils';

interface AssignmentDetailsProps {
  assignment: Assignment;
}

export function AssignmentDetails({ assignment }: AssignmentDetailsProps) {
  const details = [
    { label: 'Assignment ID', value: assignment.assignmentId },
    { label: 'Title', value: assignment.title },
    { label: 'Course Code', value: assignment.courseCode },
    { label: 'Course Name', value: assignment.courseName },
    { label: 'Faculty coordinator', value: assignment.facultyName },
    { label: 'Maximum Marks', value: assignment.totalMarks.toString() },
    { label: 'Publish Date', value: assignment.publishAt },
    { label: 'Due Date', value: assignment.dueAt },
    { label: 'Program', value: assignment.program },
    { label: 'Department', value: assignment.department },
    { label: 'Semester', value: assignment.semester },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <div className="h-12 w-12 rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center font-bold text-lg select-none">
          {assignment.title.charAt(0)}
          {assignment.courseCode.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {assignment.title}
          </h4>
          <span
            className={cn(
              "inline-flex items-center self-start rounded-md px-2 py-0.5 mt-1 text-[10px] font-semibold ring-1 ring-inset uppercase tracking-wide",
              assignment.status === 'PUBLISHED' &&
                "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
              assignment.status === 'DRAFT' &&
                "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
              assignment.status === 'CLOSED' &&
                "bg-zinc-50 text-zinc-655 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20"
            )}
          >
            {assignment.status}
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

      {/* Description */}
      <div className="flex flex-col gap-1.5 border-t border-zinc-100 dark:border-zinc-900 pt-4">
        <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          Task Description
        </span>
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
          {assignment.description || 'No task description available.'}
        </p>
      </div>
    </div>
  );
}
