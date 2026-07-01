"use client";

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { programResultFormSchema, ProgramResultFormValues } from '../../schemas';
import { ProgramResult } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { RESULT_STATUS_OPTIONS } from '../../constants';
import { Award, ShieldCheck, HelpCircle } from 'lucide-react';

interface ProgramResultFormProps {
  initialData?: ProgramResult | null;
  studentOptions: { label: string; value: string }[];
  onSubmit: (values: Omit<ProgramResult, 'programResultId' | 'createdAt' | 'updatedAt' | 'creditsRemaining' | 'overallPercentage' | 'degreeClassification' | 'graduationEligibility' | 'academicStanding'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

const getAcademicStanding = (cgpa: number): string => {
  if (cgpa >= 8.5) return 'Distinction Class';
  if (cgpa >= 6.5) return 'First Class';
  if (cgpa >= 5.0) return 'Second Class';
  return 'Probationary Class';
};

export function ProgramResultForm({
  initialData,
  studentOptions,
  onSubmit,
  isSubmitting = false,
}: ProgramResultFormProps) {
  const isEdit = !!initialData;

  const methods = useForm<ProgramResultFormValues>({
    resolver: zodResolver(programResultFormSchema),
    defaultValues: {
      enrollmentId: initialData?.enrollmentId || '',
      cgpa: initialData?.cgpa !== undefined ? initialData.cgpa : 0.0,
      totalCredits: initialData?.totalCredits !== undefined ? initialData.totalCredits : 0,
      earnedCredits: initialData?.earnedCredits !== undefined ? initialData.earnedCredits : 0,
      degreeCompleted: initialData?.degreeCompleted || false,
      completionDate: initialData?.completionDate
        ? new Date(initialData.completionDate).toISOString().split('T')[0]
        : '',
      resultStatus: initialData?.resultStatus || 'DRAFT',
      publishedAt: initialData?.publishedAt
        ? new Date(initialData.publishedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    },
  });

  const totalCreditsVal = methods.watch('totalCredits');
  const earnedCreditsVal = methods.watch('earnedCredits');
  const cgpaVal = methods.watch('cgpa');
  const statusVal = methods.watch('resultStatus');
  const degreeCompletedVal = methods.watch('degreeCompleted');

  const totalCredsNum = Number(totalCreditsVal || 0);
  const earnedCredsNum = Number(earnedCreditsVal || 0);
  const cgpaNum = Number(cgpaVal || 0.0);

  const remainingCredits = Math.max(0, totalCredsNum - earnedCredsNum);
  const isEligible = earnedCredsNum >= totalCredsNum && totalCredsNum > 0;
  const computedStanding = getAcademicStanding(cgpaNum);

  const handleFormSubmit = async (values: ProgramResultFormValues) => {
    await onSubmit({
      enrollmentId: values.enrollmentId,
      cgpa: Number(values.cgpa),
      totalCredits: Number(values.totalCredits),
      earnedCredits: Number(values.earnedCredits),
      degreeCompleted: values.degreeCompleted,
      completionDate: values.completionDate || undefined,
      resultStatus: values.resultStatus,
      publishedAt: values.resultStatus === 'PUBLISHED' ? new Date().toISOString() : undefined,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        {isEdit ? (
          <div className="flex flex-col gap-3.5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Candidate</span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {initialData?.studentName} ({initialData?.rollNumber})
              </span>
            </div>
            <div className="flex flex-col gap-0.5 border-t border-zinc-105 dark:border-zinc-800 pt-2.5">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Degree / Batch</span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {initialData?.programName} ({initialData?.batch})
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <FormSelect
              name="enrollmentId"
              label="Select Student / Enrollment"
              options={studentOptions}
              required
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            name="totalCredits"
            label="Required Program Credits"
            type="number"
            placeholder="e.g. 120"
            required
          />
          <FormInput
            name="earnedCredits"
            label="Earned Program Credits"
            type="number"
            placeholder="e.g. 120"
            required
          />
          <FormInput
            name="cgpa"
            label="Cumulative CGPA"
            type="number"
            step="0.01"
            placeholder="e.g. 8.75"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            name="resultStatus"
            label="Publication Status"
            options={RESULT_STATUS_OPTIONS}
            required
          />
          {statusVal === 'PUBLISHED' && (
            <FormInput
              name="publishedAt"
              label="Publication Date"
              type="date"
              required
            />
          )}
        </div>

        {/* Graduation Dates & Complete Flags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-4 border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-xl">
          <div className="flex items-center gap-3.5 pl-1.5">
            <input
              type="checkbox"
              id="degreeCompleted"
              className="h-4.5 w-4.5 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-900 cursor-pointer"
              checked={degreeCompletedVal}
              onChange={(e) => methods.setValue('degreeCompleted', e.target.checked)}
            />
            <div className="flex flex-col gap-0.5">
              <label htmlFor="degreeCompleted" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                Mark Degree Completed
              </label>
              <span className="text-[11px] text-zinc-400">Enable when final degree certification requirements are satisfied.</span>
            </div>
          </div>

          {degreeCompletedVal && (
            <FormInput
              name="completionDate"
              label="Degree Completion Date"
              type="date"
              required
            />
          )}
        </div>

        {/* Live Academic Assessment Summary */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/40">
          <h5 className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            <Award className="h-4 w-4 text-zinc-500" />
            <span>Cumulative Degree Assessment</span>
          </h5>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-zinc-200 dark:divide-zinc-800">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-zinc-500">Academic Stand</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {computedStanding}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-zinc-500">Overall Score %</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {(cgpaNum * 9.5).toFixed(1)}%
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-zinc-500">Credits Remaining</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {remainingCredits} Credits
              </span>
            </div>

            <div className="flex flex-col gap-0.5 justify-center items-center">
              {isEligible ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-xs font-semibold text-emerald-700 dark:text-emerald-450 uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" /> Eligible
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-500 uppercase">
                  <HelpCircle className="h-3.5 w-3.5" /> Incomplete
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving Result...' : 'Save Program Result'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
