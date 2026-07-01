"use client";

import React from 'react';
import { Course } from '../../types';
import { cn } from '@/lib/utils';

interface CourseDetailsProps {
  course: Course;
}

export function CourseDetails({ course }: CourseDetailsProps) {
  const details = [
    { label: 'Course ID', value: course.courseId },
    { label: 'Course Code', value: course.courseCode },
    { label: 'Course Name', value: course.courseName },
    { label: 'Credits', value: String(course.credits) },
    { label: 'Contact Hours', value: `${course.contactHours} hours` },
    { label: 'Department', value: course.department },
    { label: 'Program', value: course.program },
    { label: 'Semester', value: `Semester ${course.semester}` },
    { label: 'Course Type', value: course.courseType },
    { label: 'Description', value: course.description || 'No description provided' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <div className="h-12 w-12 rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center font-bold text-lg select-none">
          {course.courseName.charAt(0)}
          {course.courseCode.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {course.courseName}
          </h4>
          <span
            className={cn(
              "inline-flex items-center self-start rounded-md px-2 py-0.5 mt-1 text-[10px] font-semibold ring-1 ring-inset uppercase tracking-wide",
              course.status === 'active' &&
                "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
              course.status === 'inactive' &&
                "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20"
            )}
          >
            {course.status}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 border-t border-zinc-100 dark:border-zinc-900 pt-4">
        {details.map((detail) => (
          <div key={detail.label} className={cn("flex flex-col gap-1", detail.label === 'Description' && "md:col-span-2")}>
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
