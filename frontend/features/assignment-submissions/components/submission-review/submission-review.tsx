"use client";

import React from 'react';
import { useForm, FormProvider, Resolver, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gradingFormSchema, GradingFormValues } from '../../schemas';
import { AssignmentSubmission } from '../../types';
import { FormInput } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SubmissionReviewProps {
  submission: AssignmentSubmission;
  onSubmit: (marks: number, feedback: string) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function SubmissionReview({ submission, onSubmit, isSubmitting = false }: SubmissionReviewProps) {
  const methods = useForm<GradingFormValues>({
    resolver: zodResolver(gradingFormSchema) as unknown as Resolver<GradingFormValues, unknown>,
    defaultValues: {
      marksAwarded: submission.marksAwarded !== undefined ? submission.marksAwarded : 0,
      feedback: submission.feedback || '',
    } as unknown as DefaultValues<GradingFormValues>,
  });

  const handleGradingSubmit = async (values: GradingFormValues) => {
    await onSubmit(Number(values.marksAwarded), values.feedback);
  };

  const details = [
    { label: 'Assignment Title', value: submission.assignmentTitle },
    { label: 'Maximum Marks', value: `${submission.maximumMarks} Points` },
    { label: 'Due Date', value: submission.dueDate },
    { label: 'Student Name', value: `${submission.studentName} (${submission.rollNumber})` },
    { label: 'Submission Date', value: submission.submittedAt },
    { label: 'Attachment Name', value: submission.attachmentName || 'assignment_submission.pdf' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Block */}
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
          Review & Grade Submission
        </h4>
        <p className="text-xs text-zinc-550 mt-1">
          Evaluate submission, award points, and add review feedback.
        </p>
      </div>

      {/* Review details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-5">
        {details.map((detail) => (
          <div key={detail.label} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {detail.label}
            </span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {detail.value}
            </span>
          </div>
        ))}

        {/* Late indicator badge */}
        <div className="flex flex-col gap-1 md:col-span-2 mt-2">
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Submission Delay Status
          </span>
          <span
            className={cn(
              "inline-flex items-center self-start rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
              submission.isLate
                ? "bg-red-50 text-red-750 dark:bg-red-500/10 dark:text-red-400"
                : "bg-emerald-50 text-emerald-755 dark:bg-emerald-500/10 dark:text-emerald-400"
            )}
          >
            {submission.isLate ? 'Late Submission' : 'On Time'}
          </span>
        </div>
      </div>

      {/* Form Fields */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleGradingSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4">
            <FormInput
              name="marksAwarded"
              label={`Marks Awarded (Max: ${submission.maximumMarks})`}
              type="number"
              required
            />
            <FormInput
              name="feedback"
              label="Evaluation Feedback"
              placeholder="Good work! The query formatting is clean..."
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
            >
              {isSubmitting ? 'Submitting Grade...' : 'Save Grade'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
