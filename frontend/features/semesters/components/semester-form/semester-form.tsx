"use client";

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, Resolver, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { semesterFormSchema, SemesterFormValues } from '../../schemas';
import { Semester } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { STATUS_OPTIONS, SEMESTER_NUMBER_OPTIONS } from '../../constants';

interface SemesterFormProps {
  initialData?: Semester | null;
  onSubmit: (values: Omit<Semester, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function SemesterForm({ initialData, onSubmit, isSubmitting = false }: SemesterFormProps) {
  const isEdit = !!initialData;
  const [academicYears, setAcademicYears] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load Academic Years
    api.get<{ academic_year_id: string; academic_year_name: string }[]>('/academic-years')
      .then((res) => {
        const list = res.data || [];
        setAcademicYears(list.map((item) => ({ label: item.academic_year_name, value: item.academic_year_id })));
      })
      .catch((err) => console.warn('Failed to load academic years for semester form:', err));
  }, []);

  const methods = useForm<SemesterFormValues>({
    resolver: zodResolver(semesterFormSchema) as unknown as Resolver<SemesterFormValues, unknown>,
    defaultValues: {
      semesterName: initialData?.semesterName || '',
      semesterNumber: initialData?.semesterNumber ? String(initialData.semesterNumber) : '1',
      academicYearId: initialData?.academicYearId || '',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      status: initialData?.status || 'active',
    } as unknown as DefaultValues<SemesterFormValues>,
  });

  const handleFormSubmit = async (values: SemesterFormValues) => {
    await onSubmit({
      ...values,
      semesterNumber: Number(values.semesterNumber),
      semesterId: initialData?.semesterId || '',
    } as Omit<Semester, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="semesterName"
            label="Semester Name"
            placeholder="e.g. Fall 2026 Semester"
            required
            disabled={isEdit}
          />
          <FormSelect
            name="semesterNumber"
            label="Semester Number"
            options={SEMESTER_NUMBER_OPTIONS}
            required
          />
          <FormSelect
            name="academicYearId"
            label="Academic Year"
            options={academicYears}
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
          <FormSelect name="status" label="Status" options={STATUS_OPTIONS} required />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Semester'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
