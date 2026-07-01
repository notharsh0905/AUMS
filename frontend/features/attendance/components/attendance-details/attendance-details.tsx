"use client";

import React from 'react';
import { AttendanceSession } from '../../types';
import { cn } from '@/lib/utils';

interface AttendanceDetailsProps {
  session: AttendanceSession;
}

export function AttendanceDetails({ session }: AttendanceDetailsProps) {
  const details = [
    { label: 'Session ID', value: session.attendanceSessionId },
    { label: 'Session Date', value: session.date },
    { label: 'Course Code', value: session.courseCode },
    { label: 'Course Name', value: session.courseName },
    { label: 'Faculty Name', value: session.facultyName },
    { label: 'Program', value: session.program },
    { label: 'Department', value: session.department },
    { label: 'Semester', value: session.semester },
    { label: 'Section', value: session.section },
    { label: 'Remarks', value: session.remarks || 'N/A' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <div className="h-12 w-12 rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center font-bold text-lg select-none">
          {session.courseCode.charAt(0)}
          {session.section.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {session.courseCode} - {session.courseName} (Sec {session.section})
          </h4>
          <span
            className={cn(
              "inline-flex items-center self-start rounded-md px-2 py-0.5 mt-1 text-[10px] font-semibold ring-1 ring-inset uppercase tracking-wide",
              session.status === 'COMPLETED' &&
                "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
              session.status === 'SCHEDULED' &&
                "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
              session.status === 'CANCELLED' &&
                "bg-red-50 text-red-750 ring-red-500/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20"
            )}
          >
            {session.status}
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

      {/* Students Roll Call List */}
      <div className="flex flex-col gap-3 border-t border-zinc-100 dark:border-zinc-900 pt-4">
        <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
          Marked Students List ({session.students.length})
        </h5>
        <div className="max-h-60 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-xl divider-y">
          {session.students.map((student) => (
            <div key={student.enrollmentId} className="flex items-center justify-between p-3 text-xs border-b border-zinc-100 last:border-0 dark:border-zinc-800">
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{student.studentName}</span>
                <span className="text-zinc-400">{student.rollNumber}</span>
              </div>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full font-bold select-none text-[10px]",
                  student.status === 'PRESENT' && "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
                  student.status === 'ABSENT' && "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
                  student.status === 'LATE' && "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
                  student.status === 'EXCUSED' && "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                )}
              >
                {student.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
