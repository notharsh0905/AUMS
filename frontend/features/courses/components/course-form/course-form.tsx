"use client";

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseFormSchema, CourseFormValues } from '../../schemas';
import { Course } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { STATUS_OPTIONS, COURSE_TYPE_OPTIONS, SEMESTER_OPTIONS } from '../../constants';

interface CourseFormProps {
  initialData?: Course | null;
  onSubmit: (values: Omit<Course, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function CourseForm({ initialData, onSubmit, isSubmitting = false }: CourseFormProps) {
  const isEdit = !!initialData;
  const [departments, setDepartments] = useState<{ label: string; value: string }[]>([]);
  const [programs, setPrograms] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load Departments
    api.get<{ department_name: string; department_id: string }[]>('/departments')
      .then((res) => {
        const list = res.data || [];
        setDepartments(list.map((d) => ({ label: d.department_name, value: d.department_name })));
      })
      .catch((err) => console.warn('Failed to load departments for course form:', err));

    // Load Programs
    api.get<{ program_name: string; program_id: string }[]>('/programs')
      .then((res) => {
        const list = res.data || [];
        setPrograms(list.map((p) => ({ label: p.program_name, value: p.program_name })));
      })
      .catch((err) => console.warn('Failed to load programs for course form:', err));
  }, []);

  const methods = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema) as unknown as Resolver<CourseFormValues, unknown>,
    defaultValues: {
      courseCode: initialData?.courseCode || '',
      courseName: initialData?.courseName || '',
      credits: initialData?.credits || 3,
      contactHours: initialData?.contactHours || 45,
      department: initialData?.department || '',
      program: initialData?.program || '',
      semester: initialData?.semester ? String(initialData.semester) : '1',
      courseType: initialData?.courseType || 'CORE',
      description: initialData?.description || '',
      status: initialData?.status || 'active',
    },
  });

  const handleFormSubmit = async (values: CourseFormValues) => {
    await onSubmit({
      ...values,
      credits: Number(values.credits),
      contactHours: Number(values.contactHours),
      semester: Number(values.semester),
      courseId: initialData?.courseId || '',
    } as Omit<Course, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="courseCode"
            label="Course Code"
            placeholder="e.g. CSE-302"
            required
            disabled={isEdit}
          />
          <FormInput
            name="courseName"
            label="Course Name"
            placeholder="e.g. Database Management Systems"
            required
          />
          <FormInput
            name="credits"
            label="Credits"
            type="number"
            placeholder="e.g. 3"
            required
          />
          <FormInput
            name="contactHours"
            label="Contact Hours"
            type="number"
            placeholder="e.g. 45"
            required
          />
          <FormSelect name="department" label="Department" options={departments} required />
          <FormSelect name="program" label="Program" options={programs} required />
          <FormSelect name="semester" label="Semester" options={SEMESTER_OPTIONS} required />
          <FormSelect name="courseType" label="Course Type" options={COURSE_TYPE_OPTIONS} required />
          <FormSelect name="status" label="Status" options={STATUS_OPTIONS} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <FormInput
            name="description"
            label="Description"
            placeholder="e.g. Overview of relational algebra, database design, normalization, and SQL language queries"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Course'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
