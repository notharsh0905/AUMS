"use client";

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { marksEntryFormSchema, MarksEntryFormValues } from '../../schemas';
import { ExamAttempt } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { formatRemarksField } from '../../services';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';

interface MarksEntryFormProps {
  initialData?: ExamAttempt | null;
  evaluatorOptions: { label: string; value: string }[];
  registrationOptions: {
    label: string;
    value: string;
    examId: string;
    maxMarks: number;
    passingMarks: number;
  }[];
  onSubmit: (values: Omit<ExamAttempt, 'examAttemptId' | 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function MarksEntryForm({
  initialData,
  evaluatorOptions,
  registrationOptions,
  onSubmit,
  isSubmitting = false,
}: MarksEntryFormProps) {
  const isEdit = !!initialData;

  const methods = useForm<MarksEntryFormValues>({
    resolver: zodResolver(marksEntryFormSchema),
    defaultValues: {
      examRegistrationId: initialData?.examRegistrationId || '',
      attemptNumber: initialData?.attemptNumber !== undefined ? initialData.attemptNumber : 1,
      internalMarks: initialData?.internalMarks !== undefined ? initialData.internalMarks : 0,
      externalMarks: initialData?.externalMarks !== undefined ? initialData.externalMarks : 0,
      evaluatorId: initialData?.evaluatorId || '',
      evaluatedAt: initialData?.evaluatedAt
        ? new Date(initialData.evaluatedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      remarks: initialData?.remarks || '',
    },
  });

  const selectedRegId = methods.watch('examRegistrationId');
  const internalVal = methods.watch('internalMarks');
  const externalVal = methods.watch('externalMarks');

  const [maxMarks, setMaxMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(40);

  // Update thresholds based on selected registration
  useEffect(() => {
    if (isEdit && initialData) {
      setMaxMarks(initialData.maxMarks || 100);
      setPassingMarks(initialData.passingMarks || 40);
      return;
    }

    if (selectedRegId) {
      const match = registrationOptions.find((r) => r.value === selectedRegId);
      if (match) {
        setMaxMarks(match.maxMarks);
        setPassingMarks(match.passingMarks);
      }
    }
  }, [selectedRegId, registrationOptions, isEdit, initialData]);

  // Compute total and pass status dynamically
  const internalNum = Number(internalVal || 0);
  const externalNum = Number(externalVal || 0);
  const calculatedTotal = internalNum + externalNum;
  const isPass = calculatedTotal >= passingMarks;

  const handleFormSubmit = async (values: MarksEntryFormValues) => {
    if (calculatedTotal > maxMarks) {
      methods.setError('externalMarks', {
        message: `Total Marks (${calculatedTotal}) cannot exceed maximum allowed marks (${maxMarks})`,
      });
      return;
    }

    const formattedRemarks = formatRemarksField(
      Number(values.internalMarks),
      Number(values.externalMarks),
      values.remarks || ''
    );

    await onSubmit({
      examRegistrationId: values.examRegistrationId,
      attemptNumber: Number(values.attemptNumber),
      marksObtained: calculatedTotal,
      evaluatorId: values.evaluatorId,
      evaluatedAt: new Date(values.evaluatedAt).toISOString(),
      remarks: formattedRemarks,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        {isEdit ? (
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Candidate</span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {initialData?.studentName} ({initialData?.rollNumber})
              </span>
            </div>
            <div className="flex flex-col gap-0.5 border-t border-zinc-100 dark:border-zinc-850 pt-2">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Exam</span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {initialData?.examName} ({initialData?.courseCode})
              </span>
            </div>
          </div>
        ) : (
          <FormSelect
            name="examRegistrationId"
            label="Select Registered Candidate"
            options={registrationOptions}
            required
          />
        )}

        {/* Dynamic Exam Threshold Banner */}
        {selectedRegId && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-blue-150 bg-blue-50/20 dark:border-blue-900/30 dark:bg-blue-950/10 text-xs text-blue-800 dark:text-blue-400">
            <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <div className="flex gap-4">
              <span><strong>Max Marks:</strong> {maxMarks}</span>
              <span><strong>Passing Marks:</strong> {passingMarks}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="attemptNumber"
            label="Attempt Number"
            type="number"
            placeholder="e.g. 1"
            required
            disabled={isEdit}
          />
          <FormSelect
            name="evaluatorId"
            label="Evaluator / Faculty"
            options={evaluatorOptions}
            required
          />
          <FormInput
            name="internalMarks"
            label="Internal Assessment Marks"
            type="number"
            placeholder="e.g. 15"
            required
          />
          <FormInput
            name="externalMarks"
            label="External Exam Marks"
            type="number"
            placeholder="e.g. 35"
            required
          />
          <FormInput
            name="evaluatedAt"
            label="Evaluation Date"
            type="date"
            required
          />
        </div>

        {/* Real-time Total Marks & Pass/Fail Calculations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex flex-col justify-center">
            <span className="text-xs text-zinc-500 font-medium">Calculated Total Marks</span>
            <span className={cn(
              "text-2xl font-bold mt-1",
              calculatedTotal > maxMarks ? "text-red-500" : "text-zinc-900 dark:text-zinc-50"
            )}>
              {calculatedTotal} <span className="text-sm font-normal text-zinc-400">/ {maxMarks}</span>
            </span>
          </div>

          <div className="flex items-center md:justify-end">
            {isPass ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-900/30 text-sm font-semibold select-none">
                <CheckCircle className="h-4 w-4" />
                <span>STATUS: PASS</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30 text-sm font-semibold select-none">
                <ShieldAlert className="h-4 w-4" />
                <span>STATUS: FAIL</span>
              </div>
            )}
          </div>
        </div>

        <FormInput
          name="remarks"
          label="Additional Remarks"
          placeholder="e.g. Evaluated in central office, recheck code 4A"
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving Marks...' : 'Save Marks'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
