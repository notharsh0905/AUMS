"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AttendanceSession, StudentAttendanceRow } from '../../types';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Keyboard, ArrowDown, ArrowUp, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttendanceMarkingViewProps {
  session: AttendanceSession;
  onSubmit: (rows: StudentAttendanceRow[]) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function AttendanceMarkingView({ session, onSubmit, isSubmitting = false }: AttendanceMarkingViewProps) {
  const [rows, setRows] = useState<StudentAttendanceRow[]>(() => [...session.students]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const updateStatus = useCallback((enrollmentId: string, status: StudentAttendanceRow['status']) => {
    setRows((prev) =>
      prev.map((r) => (r.enrollmentId === enrollmentId ? { ...r, status } : r))
    );
  }, []);

  const markAll = (status: StudentAttendanceRow['status']) => {
    setRows((prev) => prev.map((r) => ({ ...r, status })));
  };

  const resetAll = () => {
    setRows(() => [...session.students]);
    setActiveIndex(0);
  };

  // Keyboard navigation & rapid marking handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Safety check: do not intercept if user is typing in form controls
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toUpperCase();
        if (
          tagName === 'INPUT' ||
          tagName === 'TEXTAREA' ||
          tagName === 'SELECT' ||
          target.isContentEditable
        ) {
          return;
        }
      }

      // Ignore if modifier keys are pressed (e.g. Cmd+R, Ctrl+C)
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      const key = e.key.toLowerCase();
      const currentRow = rows[activeIndex];

      if (key === 'p') {
        e.preventDefault();
        if (currentRow) {
          updateStatus(currentRow.enrollmentId, 'PRESENT');
          setActiveIndex((prev) => Math.min(prev + 1, rows.length - 1));
        }
      } else if (key === 'a') {
        e.preventDefault();
        if (currentRow) {
          updateStatus(currentRow.enrollmentId, 'ABSENT');
          setActiveIndex((prev) => Math.min(prev + 1, rows.length - 1));
        }
      } else if (key === 'l') {
        e.preventDefault();
        if (currentRow) {
          updateStatus(currentRow.enrollmentId, 'LATE');
          setActiveIndex((prev) => Math.min(prev + 1, rows.length - 1));
        }
      } else if (key === 'e') {
        e.preventDefault();
        if (currentRow) {
          updateStatus(currentRow.enrollmentId, 'EXCUSED');
          setActiveIndex((prev) => Math.min(prev + 1, rows.length - 1));
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, rows.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, rows.length - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, rows, updateStatus]);

  // Scroll active row into view
  useEffect(() => {
    const el = rowRefs.current[activeIndex];
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <div className="flex flex-col gap-5">
      {/* Session Title Info */}
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
          Marking Attendance
        </h4>
        <p className="text-xs text-zinc-500 mt-1">
          {session.courseCode} - {session.courseName} | Sec {session.section} | {session.date}
        </p>
      </div>

      {/* Keyboard Shortcuts Helper Banner */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-3.5 py-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-200 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <Keyboard className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>Rapid Shortcuts:</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap text-[11px]">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 font-mono font-bold shadow-xs">P</kbd> Present
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 font-mono font-bold shadow-xs">A</kbd> Absent
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 font-mono font-bold shadow-xs">L</kbd> Late
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 font-mono font-bold shadow-xs">E</kbd> Excused
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 font-mono font-bold shadow-xs flex items-center"><ArrowUp className="h-2.5 w-2.5" /><ArrowDown className="h-2.5 w-2.5" /></kbd> Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 font-mono font-bold shadow-xs flex items-center"><CornerDownLeft className="h-2.5 w-2.5" /></kbd> Next
          </span>
        </div>
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
      <div
        role="listbox"
        aria-label="Student attendance roll list"
        className="max-h-[380px] overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-xl divide-y divide-zinc-100 dark:divide-zinc-800 focus:outline-none"
      >
        {rows.map((row, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={row.enrollmentId}
              ref={(el) => {
                rowRefs.current[idx] = el;
              }}
              role="option"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => setActiveIndex(idx)}
              onFocus={() => setActiveIndex(idx)}
              className={cn(
                "flex items-center justify-between p-3.5 text-xs transition-colors cursor-pointer select-none focus:outline-none",
                isActive
                  ? "bg-indigo-50/50 dark:bg-indigo-950/20 ring-1 ring-inset ring-indigo-500/40"
                  : "hover:bg-zinc-50/70 dark:hover:bg-zinc-900/30"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                  {idx + 1}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {row.studentName}
                  </span>
                  <span className="text-zinc-400 mt-0.5">{row.rollNumber}</span>
                </div>
              </div>

              {/* Status selectors */}
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const).map((statusVal) => {
                  const isCurrentStatus = row.status === statusVal;
                  return (
                    <button
                      key={statusVal}
                      type="button"
                      aria-pressed={isCurrentStatus}
                      aria-label={`Mark ${statusVal.toLowerCase()} for ${row.studentName}`}
                      onClick={() => {
                        updateStatus(row.enrollmentId, statusVal);
                        setActiveIndex(idx);
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all tracking-wide select-none ring-1 ring-inset",
                        isCurrentStatus
                          ? statusVal === 'PRESENT'
                            ? "bg-emerald-600 text-white dark:bg-emerald-500 ring-emerald-600 shadow-xs"
                            : statusVal === 'ABSENT'
                              ? "bg-red-600 text-white dark:bg-red-500 ring-red-600 shadow-xs"
                              : statusVal === 'LATE'
                                ? "bg-amber-600 text-white dark:bg-amber-500 ring-amber-600 shadow-xs"
                                : "bg-blue-600 text-white dark:bg-blue-500 ring-blue-600 shadow-xs"
                          : "bg-zinc-50 hover:bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:hover:bg-zinc-800 ring-zinc-200/60 dark:ring-zinc-800"
                      )}
                    >
                      {statusVal.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
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
