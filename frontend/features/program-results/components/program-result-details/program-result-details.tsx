"use client";

import React from 'react';
import { ProgramResult } from '../../types';
import { cn } from '@/lib/utils';
import { Calendar, FileText, CheckCircle2, ShieldCheck, ShieldAlert, Award } from 'lucide-react';

interface ProgramResultDetailsProps {
  result: ProgramResult;
}

export function ProgramResultDetails({ result }: ProgramResultDetailsProps) {
  const isPublished = result.resultStatus === 'PUBLISHED';
  const isEligible = result.graduationEligibility === 'ELIGIBLE' || result.degreeCompleted;

  return (
    <div className="flex flex-col gap-6">
      {/* Eligibility Alert Banner */}
      {isEligible ? (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-450 border border-emerald-150 dark:border-emerald-900/30">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-450 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm">Graduation Status: ELIGIBLE</span>
            <span className="text-xs">
              Candidate successfully satisfied all required program credit milestones ({result.earnedCredits} / {result.totalCredits}) and is eligible for degree award.
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/15 text-yellow-805 dark:text-yellow-450 border border-yellow-150 dark:border-yellow-900/30">
          <ShieldAlert className="h-5 w-5 text-yellow-600 dark:text-yellow-450 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm">Graduation Status: INCOMPLETE</span>
            <span className="text-xs">
              Candidate has not earned the minimum required credits to qualify for graduation ({result.creditsRemaining} credits outstanding).
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
          <span className="text-xs text-zinc-500">Branch Code: {result.programCode}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Academic Batch</span>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {result.batch}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Standing Class</span>
          <span className="text-sm font-semibold text-zinc-850 dark:text-zinc-200 uppercase tracking-wide">
            {result.degreeClassification}
          </span>
        </div>
      </div>

      {/* Cumulative GPA Scorecard */}
      <div className="flex flex-col gap-3.5 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-850">
        <h5 className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          <Award className="h-4 w-4 text-zinc-500" />
          <span>Cumulative GPA Scorecard</span>
        </h5>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-zinc-200 dark:divide-zinc-800">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500">Final CGPA</span>
            <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">
              {result.cgpa.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500">Overall Percentage</span>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {result.overallPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500">Earned Credits</span>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {result.earnedCredits} <span className="text-xs text-zinc-400">/ {result.totalCredits}</span>
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500">Remaining Cr</span>
            <span className={cn(
              "text-base font-bold",
              result.creditsRemaining > 0 ? "text-yellow-600 dark:text-yellow-450" : "text-zinc-500"
            )}>
              {result.creditsRemaining}
            </span>
          </div>
        </div>
      </div>

      {/* Date & Completion Details */}
      <div className="flex flex-col gap-3.5 border-t border-zinc-100 dark:border-zinc-900 pt-4 text-xs text-zinc-500">
        <div className="flex items-center justify-between flex-wrap gap-4">
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
          {result.degreeCompleted && result.completionDate && (
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>
                Degree Completed On:{' '}
                <strong>{new Date(result.completionDate).toLocaleDateString()}</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
