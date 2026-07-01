"use client";

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { examRegistrationFormSchema, ExamRegistrationFormValues } from '../../schemas';
import { ExamRegistration } from '../../types';
import { FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { REGISTRATION_STATUS_OPTIONS } from '../../constants';

interface RegistrationFormProps {
  initialData?: ExamRegistration | null;
  examOptions: { label: string; value: string }[];
  studentOptions: { label: string; value: string }[];
  onSubmit: (values: ExamRegistrationFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function RegistrationForm({
  initialData,
  examOptions,
  studentOptions,
  onSubmit,
  isSubmitting = false,
}: RegistrationFormProps) {
  const isEdit = !!initialData;

  const methods = useForm<ExamRegistrationFormValues>({
    resolver: zodResolver(examRegistrationFormSchema),
    defaultValues: {
      examId: initialData?.examId || '',
      enrollmentId: initialData?.enrollmentId || '',
      registrationStatus: initialData?.registrationStatus || 'REGISTERED',
    },
  });

  const handleFormSubmit = async (values: ExamRegistrationFormValues) => {
    await onSubmit(values);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        {isEdit ? (
          <div className="flex flex-col gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Student Name / Roll Number
              </span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {initialData.studentName} ({initialData.rollNumber})
              </span>
            </div>
            <div className="flex flex-col gap-0.5 border-t border-zinc-100 dark:border-zinc-850 pt-2">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Exam / Course
              </span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {initialData.examName} ({initialData.courseCode})
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <FormSelect
              name="examId"
              label="Select Exam"
              options={examOptions}
              required
            />
            <FormSelect
              name="enrollmentId"
              label="Select Student / Enrollment"
              options={studentOptions}
              required
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <FormSelect
            name="registrationStatus"
            label="Registration Status"
            options={REGISTRATION_STATUS_OPTIONS}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Processing...' : isEdit ? 'Update Registration' : 'Register Student'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
