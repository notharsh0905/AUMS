"use client";

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { programFormSchema, ProgramFormValues } from '../../schemas';
import { Program } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { STATUS_OPTIONS, DEGREE_TYPE_OPTIONS, DURATION_UNIT_OPTIONS } from '../../constants';

interface ProgramFormProps {
  initialData?: Program | null;
  onSubmit: (values: Omit<Program, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function ProgramForm({ initialData, onSubmit, isSubmitting = false }: ProgramFormProps) {
  const isEdit = !!initialData;
  const [departments, setDepartments] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    api.get<{ department_name: string; department_id: string }[]>('/departments')
      .then((res) => {
        const list = res.data || [];
        setDepartments(list.map((d) => ({ label: d.department_name, value: d.department_name })));
      })
      .catch((err) => console.warn('Failed to load departments for program form:', err));
  }, []);

  const methods = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema) as unknown as Resolver<ProgramFormValues, unknown>,
    defaultValues: {
      programCode: initialData?.programCode || '',
      programName: initialData?.programName || '',
      department: initialData?.department || '',
      degreeType: initialData?.degreeType || 'UNDERGRADUATE',
      durationValue: initialData?.durationValue || 4,
      durationUnit: initialData?.durationUnit || 'YEARS',
      totalSemesters: initialData?.totalSemesters || 8,
      status: initialData?.status || 'active',
    },
  });

  const handleFormSubmit = async (values: ProgramFormValues) => {
    await onSubmit({
      ...values,
      durationValue: Number(values.durationValue),
      totalSemesters: Number(values.totalSemesters),
      programId: initialData?.programId || '',
      departmentId: initialData?.departmentId || '',
    } as Omit<Program, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="programCode"
            label="Program Code"
            placeholder="e.g. BTECH-CSE"
            required
            disabled={isEdit}
          />
          <FormInput
            name="programName"
            label="Program Name"
            placeholder="e.g. Bachelor of Technology in CSE"
            required
          />
          <FormSelect name="department" label="Department" options={departments} required />
          <FormSelect name="degreeType" label="Degree Type" options={DEGREE_TYPE_OPTIONS} required />
          <FormInput
            name="durationValue"
            label="Duration Value"
            type="number"
            placeholder="e.g. 4"
            required
          />
          <FormSelect name="durationUnit" label="Duration Unit" options={DURATION_UNIT_OPTIONS} required />
          <FormInput
            name="totalSemesters"
            label="Total Semesters"
            type="number"
            placeholder="e.g. 8"
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
            {isSubmitting ? 'Saving...' : 'Save Program'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
