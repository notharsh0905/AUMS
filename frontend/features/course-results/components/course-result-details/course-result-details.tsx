"use client";

import React from 'react';
import { CourseResult } from '../../types';
import { Calendar, CheckCircle2, ShieldAlert, Award, FileText } from 'lucide-react';

interface CourseResultDetailsProps {
  result: CourseResult;
}

export function CourseResultDetails({ result }: CourseResultDetailsProps) {
  const isPublished = result.resultStatus === 'PUBLISHED';

  return (
    <div className="flex flex-col gap-6">
      {/* Dynamic Status Alert Banner */}
      {result.isPass ? (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-450 border border-emerald-150 dark:border-emerald-900/30">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-450 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm">Course Result: PASS</span>
            <span className="text-xs">
              Candidate successfully passed this course offering by securing {result.marksObtained} marks (Grade Point: {result.gradePoint?.toFixed(1)} / {result.gradeCode}).
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border border-red-150 dark:border-red-900/30">
          <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm">Course Result: FAIL</span>
            <span className="text-xs">
              Candidate did not satisfy the minimum passing threshold (secured {result.marksObtained} marks). Re-registration or backlogs registration might be required.
            </span>
          </div>
        </div>
      )}

      {/* Main Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-zinc-100 dark:border-zinc-900 pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Candidate</span>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {result.studentName}
          </span>
          <span className="text-xs text-zinc-500 font-mono">Roll: {result.rollNumber}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Course / Session</span>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {result.courseCode} - {result.courseName}
          </span>
          <span className="text-xs text-zinc-500">Semester: {result.semesterName}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Credits Awarded</span>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {result.credits} Credits
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Result ID</span>
          <span className="text-xs font-mono text-zinc-500 truncate">{result.courseResultId}</span>
        </div>
      </div>

      {/* Marks Breakdown Widget */}
      <div className="flex flex-col gap-3.5 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-850">
        <h5 className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          <Award className="h-4 w-4 text-zinc-500" />
          <span>Academic Score breakdown</span>
        </h5>

        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-zinc-200 dark:divide-zinc-800">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500">Internal Marks</span>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {result.internalMarks !== undefined ? result.internalMarks : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500">External Marks</span>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {result.externalMarks !== undefined ? result.externalMarks : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500">Final Grade</span>
            <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
              {result.gradeCode} <span className="text-xs font-normal text-zinc-400">({result.percentage.toFixed(1)}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Date and Publication Panel */}
      <div className="flex flex-col gap-3.5 border-t border-zinc-100 dark:border-zinc-900 pt-4 text-xs text-zinc-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-zinc-400" />
            <span>
              Publication Status: <strong>{result.resultStatus}</strong>
            </span>
          </div>
          {isPublished && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-zinc-400" />
              <span>
                Published On:{' '}
                <strong>
                  {result.publishedAt ? new Date(result.publishedAt).toLocaleDateString() : 'N/A'}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
