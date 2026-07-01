"use client";

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { departmentFormSchema, DepartmentFormValues } from '../../schemas';
import { Department } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { STATUS_OPTIONS, SCHOOL_OPTIONS } from '../../constants';

interface DepartmentFormProps {
  initialData?: Department | null;
  onSubmit: (values: Omit<Department, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function DepartmentForm({ initialData, onSubmit, isSubmitting = false }: DepartmentFormProps) {
  const isEdit = !!initialData;
  const [schools, setSchools] = useState<{ label: string; value: string }[]>(SCHOOL_OPTIONS);

  useEffect(() => {
    api.get<{ school_name: string; school_id: string }[]>('/schools')
      .then((res) => {
        const list = res.data || [];
        if (list.length > 0) {
          setSchools(list.map((s) => ({ label: s.school_name, value: s.school_name })));
        }
      })
      .catch((err) => console.warn('Failed to load schools for dropdown, using default:', err));
  }, []);

  const methods = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      departmentCode: initialData?.departmentCode || '',
      departmentName: initialData?.departmentName || '',
      school: initialData?.school || '',
      description: initialData?.description || '',
      status: initialData?.status || 'active',
    },
  });

  const handleFormSubmit = async (values: DepartmentFormValues) => {
    await onSubmit({
      ...values,
      departmentId: initialData?.departmentId || '',
      schoolId: initialData?.schoolId || '',
    } as Omit<Department, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="departmentCode"
            label="Department Code"
            placeholder="e.g. CSE"
            required
            disabled={isEdit}
          />
          <FormInput
            name="departmentName"
            label="Department Name"
            placeholder="e.g. Computer Science & Engineering"
            required
          />
          <FormSelect name="school" label="School" options={schools} required />
          <FormSelect name="status" label="Status" options={STATUS_OPTIONS} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <FormInput
            name="description"
            label="Description"
            placeholder="e.g. Department responsible for teaching software engineering curriculum"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Department'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
