"use client";

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseResultFormSchema, CourseResultFormValues } from '../../schemas';
import { CourseResult } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { RESULT_STATUS_OPTIONS } from '../../constants';
import { mapGradeAndScale } from '../../services';
import { Award, CheckCircle, ShieldAlert } from 'lucide-react';

interface CourseResultFormProps {
  initialData?: CourseResult | null;
  studentOptions: { label: string; value: string }[];
  courseOfferingOptions: { label: string; value: string }[];
  onSubmit: (values: Omit<CourseResult, 'courseResultId' | 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function CourseResultForm({
  initialData,
  studentOptions,
  courseOfferingOptions,
  onSubmit,
  isSubmitting = false,
}: CourseResultFormProps) {
  const isEdit = !!initialData;

  const methods = useForm<CourseResultFormValues>({
    resolver: zodResolver(courseResultFormSchema),
    defaultValues: {
      enrollmentId: initialData?.enrollmentId || '',
      courseOfferingId: initialData?.courseOfferingId || '',
      internalMarks: initialData?.internalMarks !== undefined ? initialData.internalMarks : 0,
      externalMarks: initialData?.externalMarks !== undefined ? initialData.externalMarks : 0,
      totalMarks: initialData?.totalMarks !== undefined ? initialData.totalMarks : 100,
      resultStatus: initialData?.resultStatus || 'DRAFT',
      publishedAt: initialData?.publishedAt
        ? new Date(initialData.publishedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    },
  });

  const internalVal = methods.watch('internalMarks');
  const externalVal = methods.watch('externalMarks');
  const totalMarksVal = methods.watch('totalMarks');
  const statusVal = methods.watch('resultStatus');

  const internalNum = Number(internalVal || 0);
  const externalNum = Number(externalVal || 0);
  const totalMarksNum = Number(totalMarksVal || 100);

  const calculatedObtained = internalNum + externalNum;
  const calculatedPercentage = totalMarksNum > 0 ? (calculatedObtained / totalMarksNum) * 100 : 0;
  const finalPercentage = Math.min(100, Math.max(0, calculatedPercentage));

  const { gradeCode, gradePoint, isPass, gradeScaleId } = mapGradeAndScale(finalPercentage);

  const handleFormSubmit = async (values: CourseResultFormValues) => {
    if (calculatedObtained > totalMarksNum) {
      methods.setError('externalMarks', {
        message: `Marks obtained (${calculatedObtained}) cannot exceed maximum possible marks (${totalMarksNum})`,
      });
      return;
    }

    await onSubmit({
      enrollmentId: values.enrollmentId,
      courseOfferingId: values.courseOfferingId,
      totalMarks: totalMarksNum,
      marksObtained: calculatedObtained,
      percentage: Number(finalPercentage.toFixed(2)),
      gradeScaleId,
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
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Course / Section</span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {initialData?.courseCode} - {initialData?.courseName} ({initialData?.semesterName})
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
              name="courseOfferingId"
              label="Select Course Offering"
              options={courseOfferingOptions}
              required
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            name="internalMarks"
            label="Internal Marks"
            type="number"
            placeholder="e.g. 30"
            required
          />
          <FormInput
            name="externalMarks"
            label="External Marks"
            type="number"
            placeholder="e.g. 55"
            required
          />
          <FormInput
            name="totalMarks"
            label="Maximum Marks Limit"
            type="number"
            placeholder="e.g. 100"
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

        {/* Live Academic Assessment Summary */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/40">
          <h5 className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            <Award className="h-4 w-4 text-zinc-500" />
            <span>Automatic Grade & Performance Calculation</span>
          </h5>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-zinc-200 dark:divide-zinc-800">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-zinc-500">Total Score</span>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {calculatedObtained} <span className="text-xs text-zinc-400">/ {totalMarksNum}</span>
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-zinc-500">Percentage</span>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {finalPercentage.toFixed(2)}%
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-zinc-500">Grade Points</span>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {gradeCode} ({gradePoint.toFixed(1)})
              </span>
            </div>

            <div className="flex flex-col gap-0.5 justify-center items-center">
              {isPass ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-450 uppercase">
                  <CheckCircle className="h-3.5 w-3.5" /> Pass
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 uppercase">
                  <ShieldAlert className="h-3.5 w-3.5" /> Fail
                </span>
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
            {isSubmitting ? 'Saving Result...' : 'Save Course Result'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
