"use client";

import React from 'react';
import { InternalAssessment } from '../../types';
import { cn } from '@/lib/utils';

interface AssessmentDetailsProps {
  assessment: InternalAssessment;
}

export function AssessmentDetails({ assessment }: AssessmentDetailsProps) {
  const details = [
    { label: 'Assessment ID', value: assessment.assessmentId },
    { label: 'Student Name', value: assessment.studentName },
    { label: 'Roll Number', value: assessment.rollNumber },
    { label: 'Course Code', value: assessment.courseCode },
    { label: 'Course Name', value: assessment.courseName },
    { label: 'Faculty coordinator', value: assessment.facultyName },
    { label: 'Attendance %', value: `${assessment.attendancePercentage}% (${assessment.attendanceMarks} Marks)` },
    { label: 'Assignment average score', value: `${assessment.assignmentMarks} Marks` },
    { label: 'Mid Semester exam score', value: `${assessment.midSemesterMarks} Marks` },
    { label: 'Quiz score', value: `${assessment.quizMarks} Marks` },
    { label: 'Practical score', value: `${assessment.practicalMarks} Marks` },
    { label: 'Viva score', value: `${assessment.vivaMarks} Marks` },
    { label: 'Bonus points awarded', value: `${assessment.bonusMarks} Marks` },
    { label: 'Penalty points deducted', value: `${assessment.penalty} Marks` },
    { label: 'Total Internals', value: `${assessment.totalInternalMarks} / ${assessment.maxMarks}` },
    { label: 'Program', value: assessment.program },
    { label: 'Department', value: assessment.department },
    { label: 'Semester', value: assessment.semester },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <div className="h-12 w-12 rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center font-bold text-lg select-none">
          {assessment.studentName.charAt(0)}
          {assessment.courseCode.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {assessment.studentName} - {assessment.courseCode}
          </h4>
          <span
            className={cn(
              "inline-flex items-center self-start rounded-md px-2 py-0.5 mt-1 text-[10px] font-semibold ring-1 ring-inset uppercase tracking-wide",
              assessment.status === 'APPROVED' &&
                "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
              assessment.status === 'SUBMITTED' &&
                "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
              assessment.status === 'DRAFT' &&
                "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
            )}
          >
            {assessment.status}
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
              {detail.value || '0'}
            </span>
          </div>
        ))}
      </div>

      {/* Remarks */}
      {assessment.remarks && (
        <div className="flex flex-col gap-1.5 border-t border-zinc-100 dark:border-zinc-900 pt-4">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Assessment Remarks
          </span>
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
            {assessment.remarks}
          </p>
        </div>
      )}
    </div>
  );
}
