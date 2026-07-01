"use client";

import React from 'react';
import { SemesterResult } from '../../types';
import { cn } from '@/lib/utils';
import { Calendar, FileText, CheckCircle2, ShieldAlert, Award } from 'lucide-react';

interface SemesterResultDetailsProps {
  result: SemesterResult;
}

export function SemesterResultDetails({ result }: SemesterResultDetailsProps) {
  const isPublished = result.resultStatus === 'PUBLISHED';
  const hasBacklogs = (result.backlogCount || 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Standing Alert Banner */}
      {!hasBacklogs ? (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-450 border border-emerald-150 dark:border-emerald-900/30">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-450 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm">Academic Stand: PASS ({result.academicStanding})</span>
            <span className="text-xs">
              Candidate successfully completed all registered semester credits ({result.earnedCredits} / {result.totalCredits}) with an SGPA of {result.sgpa.toFixed(2)}.
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/15 text-yellow-805 dark:text-yellow-450 border border-yellow-150 dark:border-yellow-900/30">
          <ShieldAlert className="h-5 w-5 text-yellow-600 dark:text-yellow-450 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm">Academic Stand: PROBATION ({result.academicStanding})</span>
            <span className="text-xs">
              Candidate has pending backlog courses in this semester ({result.totalCredits - result.earnedCredits} credits outstanding). Re-appear evaluations are required.
            </span>
          </div>
        </div>
      )}

      {/* Main Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-zinc-100 dark:border-zinc-900 pt-4 text-sm">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Student Candidate</span>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {result.studentName}
          </span>
          <span className="text-xs text-zinc-500 font-mono">Roll: {result.rollNumber}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Degree Program</span>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {result.programName}
          </span>
          <span className="text-xs text-zinc-500">Code: {result.programCode}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Academic Semester</span>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {result.semesterName}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Result ID Reference</span>
          <span className="text-xs font-mono text-zinc-500 truncate">{result.semesterResultId}</span>
        </div>
      </div>

      {/* Performance Scorecard */}
      <div className="flex flex-col gap-3.5 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-850">
        <h5 className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          <Award className="h-4 w-4 text-zinc-500" />
          <span>Semester SGPA Scorecard</span>
        </h5>

        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-zinc-200 dark:divide-zinc-800">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500">Semester SGPA</span>
            <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">
              {result.sgpa.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500">Credits Earned</span>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {result.earnedCredits} <span className="text-xs text-zinc-400">/ {result.totalCredits}</span>
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500">Backlogs Count</span>
            <span className={cn(
              "text-base font-bold",
              hasBacklogs ? "text-yellow-600 dark:text-yellow-450" : "text-zinc-900 dark:text-zinc-100"
            )}>
              {result.backlogCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Audit Meta Information */}
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
