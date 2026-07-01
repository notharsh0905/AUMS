"use client";

import React from 'react';
import { InternalAssessment } from '../../types';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface AssessmentBreakdownProps {
  assessment: InternalAssessment;
}

export function AssessmentBreakdown({ assessment }: AssessmentBreakdownProps) {
  const steps = [
    {
      title: '1. Attendance Percentage Evaluation',
      description: `Attendance of ${assessment.attendancePercentage}% maps to attendance marks.`,
      score: `+ ${assessment.attendanceMarks} Marks`,
      type: 'addition',
    },
    {
      title: '2. Continuous Assignment Grading',
      description: `Weighted average score of submitted class assignments.`,
      score: `+ ${assessment.assignmentMarks} Marks`,
      type: 'addition',
    },
    {
      title: '3. Mid Semester Exam Score',
      description: `Performance score in central mid term assessment.`,
      score: `+ ${assessment.midSemesterMarks} Marks`,
      type: 'addition',
    },
    {
      title: '4. Continuous Classroom Quizzes',
      description: `Cumulative quiz parameters score.`,
      score: `+ ${assessment.quizMarks} Marks`,
      type: 'addition',
    },
    {
      title: '5. Practical / Lab Assessment',
      description: `Practical file checks and implementation outputs.`,
      score: `+ ${assessment.practicalMarks} Marks`,
      type: 'addition',
    },
    {
      title: '6. Viva Voce Performance',
      description: `Student oral test evaluation.`,
      score: `+ ${assessment.vivaMarks} Marks`,
      type: 'addition',
    },
    {
      title: '7. Co-curricular Bonus Marks',
      description: `Extra credits for seminar presentations or hackathon participations.`,
      score: `+ ${assessment.bonusMarks} Marks`,
      type: 'addition',
    },
    {
      title: '8. Penalty Deductions',
      description: `Submissions delays or behavior penalty deductions.`,
      score: `- ${assessment.penalty} Marks`,
      type: 'subtraction',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Student/Course Info */}
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
          {assessment.studentName} ({assessment.rollNumber})
        </h4>
        <span className="text-xs font-semibold text-zinc-550 dark:text-zinc-400 mt-1 block">
          {assessment.courseCode} - {assessment.courseName}
        </span>
      </div>

      {/* Steps List */}
      <div className="flex flex-col gap-4 border-t border-zinc-100 dark:border-zinc-900 pt-4">
        <h5 className="text-xs font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-wider">
          Calculation Steps Breakdown
        </h5>
        <div className="flex flex-col gap-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex items-start justify-between gap-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  {step.title}
                </span>
                <span className="text-[10px] text-zinc-450 dark:text-zinc-500 truncate">
                  {step.description}
                </span>
              </div>
              <span
                className={cn(
                  "text-xs font-bold shrink-0",
                  step.type === 'addition' ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"
                )}
              >
                {step.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summation Total Block */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 mt-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Total Internals Earned
          </span>
          <span className="text-lg font-extrabold">
            {assessment.totalInternalMarks} / {assessment.maxMarks} Marks
          </span>
        </div>
        {assessment.totalInternalMarks >= assessment.maxMarks * 0.4 ? (
          <div className="flex items-center gap-1.5 text-emerald-400 dark:text-emerald-600">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wide">Internals Pass</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-red-400 dark:text-red-650">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wide">Internals Fail</span>
          </div>
        )}
      </div>
    </div>
  );
}
