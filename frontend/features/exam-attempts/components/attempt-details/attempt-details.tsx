"use client";

import React from 'react';
import { ExamAttempt } from '../../types';
import { Calendar, UserCheck, ShieldCheck, ShieldAlert, Award } from 'lucide-react';

interface AttemptDetailsProps {
  attempt: ExamAttempt;
}

export function AttemptDetails({ attempt }: AttemptDetailsProps) {
  const details = [
    { label: 'Attempt ID', value: attempt.examAttemptId },
    { label: 'Candidate', value: attempt.studentName },
    { label: 'Roll Number', value: attempt.rollNumber },
    { label: 'Exam Session', value: `${attempt.examName} (${attempt.examType})` },
    { label: 'Course Code & Name', value: `${attempt.courseCode} - ${attempt.courseName}` },
    { label: 'Attempt Number', value: `Attempt #${attempt.attemptNumber}` },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Status Header Alert */}
      {attempt.isPass ? (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-450 border border-emerald-150 dark:border-emerald-900/30">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-450 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm">Evaluation result: PASS</span>
            <span className="text-xs">
              Candidate successfully passed the examination by securing {attempt.marksObtained} marks (Passing threshold was {attempt.passingMarks}).
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border border-red-150 dark:border-red-900/30">
          <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm">Evaluation result: FAIL</span>
            <span className="text-xs">
              Candidate did not satisfy the minimum passing threshold of {attempt.passingMarks} (Secured {attempt.marksObtained} marks).
            </span>
          </div>
        </div>
      )}

      {/* Grid of basic lookup details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 border-t border-zinc-100 dark:border-zinc-900 pt-4">
        {details.map((detail) => (
          <div key={detail.label} className="flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {detail.label}
            </span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {detail.value || 'N/A'}
            </span>
          </div>
        ))}
      </div>

      {/* Marks Breakdown Widget */}
      <div className="flex flex-col gap-3.5 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-850">
        <h5 className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          <Award className="h-4 w-4 text-zinc-500" />
          <span>Marks Breakdown</span>
        </h5>
        
        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-zinc-200 dark:divide-zinc-800">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500">Internal Marks</span>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {attempt.internalMarks !== undefined ? attempt.internalMarks : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500">External Marks</span>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {attempt.externalMarks !== undefined ? attempt.externalMarks : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500">Total Marks</span>
            <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
              {attempt.marksObtained} <span className="text-xs font-normal text-zinc-400">/ {attempt.maxMarks || 100}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Evaluator & Remarks Details */}
      <div className="flex flex-col gap-3.5 border-t border-zinc-100 dark:border-zinc-900 pt-4">
        <div className="flex items-center gap-4 text-sm text-zinc-650 dark:text-zinc-350">
          <div className="flex items-center gap-1.5">
            <UserCheck className="h-4 w-4 text-zinc-400" />
            <span>Evaluator: <strong>{attempt.evaluatorName}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-zinc-400" />
            <span>Evaluated On: <strong>{attempt.evaluatedAt ? new Date(attempt.evaluatedAt).toLocaleDateString() : 'N/A'}</strong></span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Remarks / Notes</span>
          <span className="text-sm text-zinc-700 dark:text-zinc-300 italic bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg border border-zinc-100 dark:border-zinc-850">
            {attempt.remarks || 'No evaluation remarks registered.'}
          </span>
        </div>
      </div>
    </div>
  );
}
