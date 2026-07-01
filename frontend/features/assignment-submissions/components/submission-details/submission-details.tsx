"use client";

import React from 'react';
import { AssignmentSubmission } from '../../types';
import { cn } from '@/lib/utils';

interface SubmissionDetailsProps {
  submission: AssignmentSubmission;
}

export function SubmissionDetails({ submission }: SubmissionDetailsProps) {
  const details = [
    { label: 'Submission ID', value: submission.assignmentSubmissionId },
    { label: 'Assignment Name', value: submission.assignmentTitle },
    { label: 'Student Name', value: submission.studentName },
    { label: 'Roll Number', value: submission.rollNumber },
    { label: 'Faculty Coordinator', value: submission.facultyName },
    { label: 'Marks Awarded', value: submission.marksAwarded !== undefined ? `${submission.marksAwarded} / ${submission.maximumMarks}` : `Not Graded (Max: ${submission.maximumMarks})` },
    { label: 'Due Date', value: submission.dueDate },
    { label: 'Submission Date', value: submission.submittedAt },
    { label: 'Attachment File', value: submission.attachmentName || 'N/A' },
    { label: 'Late Indicator', value: submission.isLate ? 'LATE SUBMISSION' : 'ON TIME' },
    { label: 'Program', value: submission.program },
    { label: 'Department', value: submission.department },
    { label: 'Semester', value: submission.semester },
    { label: 'Academic Year', value: submission.academicYear },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <div className="h-12 w-12 rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center font-bold text-lg select-none">
          {submission.studentName.charAt(0)}
          {submission.assignmentTitle.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {submission.studentName} - {submission.assignmentTitle}
          </h4>
          <span
            className={cn(
              "inline-flex items-center self-start rounded-md px-2 py-0.5 mt-1 text-[10px] font-semibold ring-1 ring-inset uppercase tracking-wide",
              submission.submissionStatus === 'GRADED' &&
                "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
              submission.submissionStatus === 'SUBMITTED' &&
                "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
              submission.submissionStatus === 'LATE' &&
                "bg-red-50 text-red-750 ring-red-500/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
              submission.submissionStatus === 'PENDING' &&
                "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
            )}
          >
            {submission.submissionStatus}
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
            <span
              className={cn(
                "text-sm font-medium text-zinc-800 dark:text-zinc-200",
                detail.label === 'Late Indicator' && submission.isLate && "text-red-650 font-bold",
                detail.label === 'Late Indicator' && !submission.isLate && "text-emerald-650 font-bold"
              )}
            >
              {detail.value || 'N/A'}
            </span>
          </div>
        ))}
      </div>

      {/* Feedback & Remarks */}
      {submission.feedback && (
        <div className="flex flex-col gap-1.5 border-t border-zinc-100 dark:border-zinc-900 pt-4">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Evaluator Feedback
          </span>
          <p className="text-sm font-medium text-zinc-850 dark:text-zinc-200 leading-relaxed italic bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-900">
            &ldquo;{submission.feedback}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
