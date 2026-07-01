"use client";

import React from 'react';
import { useForm, FormProvider, Resolver, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { academicYearFormSchema, AcademicYearFormValues } from '../../schemas';
import { AcademicYear } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { STATUS_OPTIONS } from '../../constants';

interface AcademicYearFormProps {
  initialData?: AcademicYear | null;
  onSubmit: (values: Omit<AcademicYear, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function AcademicYearForm({ initialData, onSubmit, isSubmitting = false }: AcademicYearFormProps) {
  const isEdit = !!initialData;

  const methods = useForm<AcademicYearFormValues>({
    resolver: zodResolver(academicYearFormSchema) as unknown as Resolver<AcademicYearFormValues, unknown>,
    defaultValues: {
      academicYearName: initialData?.academicYearName || '',
      code: initialData?.code || '',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      isCurrent: initialData?.isCurrent ? 'true' : 'false',
      status: initialData?.status || 'active',
    } as unknown as DefaultValues<AcademicYearFormValues>,
  });

  const handleFormSubmit = async (values: AcademicYearFormValues) => {
    await onSubmit({
      ...values,
      isCurrent: values.isCurrent === 'true' || values.isCurrent === true,
      academicYearId: initialData?.academicYearId || '',
    } as Omit<AcademicYear, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="academicYearName"
            label="Academic Year Name"
            placeholder="e.g. Academic Year 2026-2027"
            required
            disabled={isEdit}
          />
          <FormInput
            name="code"
            label="Code"
            placeholder="e.g. AY2026-27"
            required
          />
          <FormInput
            name="startDate"
            label="Start Date"
            type="date"
            required
          />
          <FormInput
            name="endDate"
            label="End Date"
            type="date"
            required
          />
          <FormSelect
            name="isCurrent"
            label="Is Current Academic Year"
            options={[
              { label: 'No', value: 'false' },
              { label: 'Yes', value: 'true' },
            ]}
            required
          />
          <FormSelect name="status" label="Status" options={STATUS_OPTIONS} required />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Academic Year'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
