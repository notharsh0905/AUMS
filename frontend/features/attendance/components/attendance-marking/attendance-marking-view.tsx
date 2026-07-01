"use client";

import React, { useState } from 'react';
import { AttendanceSession, StudentAttendanceRow } from '../../types';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttendanceMarkingViewProps {
  session: AttendanceSession;
  onSubmit: (rows: StudentAttendanceRow[]) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function AttendanceMarkingView({ session, onSubmit, isSubmitting = false }: AttendanceMarkingViewProps) {
  const [rows, setRows] = useState<StudentAttendanceRow[]>(() => [...session.students]);

  const updateStatus = (enrollmentId: string, status: StudentAttendanceRow['status']) => {
    setRows((prev) =>
      prev.map((r) => (r.enrollmentId === enrollmentId ? { ...r, status } : r))
    );
  };

  const markAll = (status: StudentAttendanceRow['status']) => {
    setRows((prev) => prev.map((r) => ({ ...r, status })));
  };

  const resetAll = () => {
    setRows(() => [...session.students]);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Session Title Info */}
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
          Marking Attendance
        </h4>
        <p className="text-xs text-zinc-500 mt-1">
          {session.courseCode} - {session.courseName} | Sec {session.section} | {session.date}
        </p>
      </div>

      {/* Bulk actions */}
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-900">
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAll('PRESENT')}
          className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
        >
          <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
          Mark All Present
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAll('ABSENT')}
          className="text-red-700 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <XCircle className="mr-1.5 h-3.5 w-3.5" />
          Mark All Absent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetAll}
          className="text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      {/* Student List */}
      <div className="max-h-[360px] overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-xl divide-y divide-zinc-100 dark:divide-zinc-800">
        {rows.map((row) => (
          <div key={row.enrollmentId} className="flex items-center justify-between p-3.5 text-xs">
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{row.studentName}</span>
              <span className="text-zinc-400 mt-0.5">{row.rollNumber}</span>
            </div>

            {/* Status selectors */}
            <div className="flex items-center gap-1.5">
              {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const).map((statusVal) => {
                const isActive = row.status === statusVal;
                return (
                  <button
                    key={statusVal}
                    type="button"
                    onClick={() => updateStatus(row.enrollmentId, statusVal)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all tracking-wide select-none ring-1 ring-inset ring-transparent",
                      isActive
                        ? statusVal === 'PRESENT'
                          ? "bg-emerald-600 text-white dark:bg-emerald-500"
                          : statusVal === 'ABSENT'
                            ? "bg-red-600 text-white dark:bg-red-500"
                            : statusVal === 'LATE'
                              ? "bg-amber-600 text-white dark:bg-amber-500"
                              : "bg-blue-600 text-white dark:bg-blue-500"
                        : "bg-zinc-50 hover:bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    )}
                  >
                    {statusVal.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
        <Button
          onClick={() => onSubmit(rows)}
          disabled={isSubmitting}
          className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
        >
          {isSubmitting ? 'Saving...' : 'Save Attendance'}
        </Button>
      </div>
    </div>
  );
}
