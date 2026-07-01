"use client";

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { semesterResultFormSchema, SemesterResultFormValues } from '../../schemas';
import { SemesterResult } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { RESULT_STATUS_OPTIONS } from '../../constants';
import { Award, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SemesterResultFormProps {
  initialData?: SemesterResult | null;
  studentOptions: { label: string; value: string }[];
  semesterOptions: { label: string; value: string }[];
  onSubmit: (values: Omit<SemesterResult, 'semesterResultId' | 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

const getAcademicStanding = (sgpa: number): string => {
  if (sgpa >= 8.5) return 'First Class with Distinction';
  if (sgpa >= 6.5) return 'First Class';
  if (sgpa >= 5.0) return 'Second Class';
  if (sgpa >= 4.0) return 'Pass Class';
  return 'Academic Probation';
};

export function SemesterResultForm({
  initialData,
  studentOptions,
  semesterOptions,
  onSubmit,
  isSubmitting = false,
}: SemesterResultFormProps) {
  const isEdit = !!initialData;

  const methods = useForm<SemesterResultFormValues>({
    resolver: zodResolver(semesterResultFormSchema),
    defaultValues: {
      enrollmentId: initialData?.enrollmentId || '',
      semesterId: initialData?.semesterId || '',
      totalCredits: initialData?.totalCredits !== undefined ? initialData.totalCredits : 0,
      earnedCredits: initialData?.earnedCredits !== undefined ? initialData.earnedCredits : 0,
      sgpa: initialData?.sgpa !== undefined ? initialData.sgpa : 0.0,
      resultStatus: initialData?.resultStatus || 'DRAFT',
      publishedAt: initialData?.publishedAt
        ? new Date(initialData.publishedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    },
  });

  const totalCreditsVal = methods.watch('totalCredits');
  const earnedCreditsVal = methods.watch('earnedCredits');
  const sgpaVal = methods.watch('sgpa');
  const statusVal = methods.watch('resultStatus');

  const totalCredsNum = Number(totalCreditsVal || 0);
  const earnedCredsNum = Number(earnedCreditsVal || 0);
  const sgpaNum = Number(sgpaVal || 0.0);

  const backlogCredits = Math.max(0, totalCredsNum - earnedCredsNum);
  const calculatedStanding = getAcademicStanding(sgpaNum);

  const handleFormSubmit = async (values: SemesterResultFormValues) => {
    await onSubmit({
      enrollmentId: values.enrollmentId,
      semesterId: values.semesterId,
      totalCredits: Number(values.totalCredits),
      earnedCredits: Number(values.earnedCredits),
      sgpa: Number(values.sgpa),
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
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Academic Term</span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {initialData?.semesterName} ({initialData?.programCode})
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
            <FormSelect
              name="semesterId"
              label="Select Academic Semester"
              options={semesterOptions}
              required
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            name="totalCredits"
            label="Total Term Credits"
            type="number"
            placeholder="e.g. 20"
            required
          />
          <FormInput
            name="earnedCredits"
            label="Earned Term Credits"
            type="number"
            placeholder="e.g. 20"
            required
          />
          <FormInput
            name="sgpa"
            label="Semester SGPA"
            type="number"
            step="0.01"
            placeholder="e.g. 8.50"
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

        {/* Live Academic Summary Widget */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/40">
          <h5 className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            <Award className="h-4 w-4 text-zinc-500" />
            <span>Academic Performance Index</span>
          </h5>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center divide-x divide-zinc-200 dark:divide-zinc-800">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-zinc-500">Academic Standing</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {calculatedStanding}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-zinc-500">Credits Progression</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {earnedCredsNum} / {totalCredsNum} Credits
              </span>
            </div>

            <div className="flex flex-col gap-0.5 justify-center items-center">
              {backlogCredits > 0 ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30 text-xs font-semibold text-yellow-750 dark:text-yellow-450 uppercase">
                  <AlertTriangle className="h-3.5 w-3.5" /> {backlogCredits} Backlog Cr
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-xs font-semibold text-emerald-700 dark:text-emerald-450 uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" /> Clean Record
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
            {isSubmitting ? 'Saving Result...' : 'Save Semester Result'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
