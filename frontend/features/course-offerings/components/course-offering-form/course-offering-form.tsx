"use client";

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, Resolver, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseOfferingFormSchema, CourseOfferingFormValues } from '../../schemas';
import { CourseOffering } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { STATUS_OPTIONS } from '../../constants';

interface CourseOfferingFormProps {
  initialData?: CourseOffering | null;
  onSubmit: (values: Omit<CourseOffering, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function CourseOfferingForm({ initialData, onSubmit, isSubmitting = false }: CourseOfferingFormProps) {
  const isEdit = !!initialData;
  const [courses, setCourses] = useState<{ label: string; value: string }[]>([]);
  const [academicYears, setAcademicYears] = useState<{ label: string; value: string }[]>([]);
  const [semestersList, setSemestersList] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load courses
    api.get<{ course_id: string; course_code: string; course_name: string }[]>('/courses')
      .then((res) => {
        const list = res.data || [];
        setCourses(list.map((c) => ({ label: `[${c.course_code}] ${c.course_name}`, value: c.course_id })));
      })
      .catch(() => {});

    // Load academic years
    api.get<{ academic_year_id: string; academic_year_name: string }[]>('/academic-years')
      .then((res) => {
        const list = res.data || [];
        setAcademicYears(list.map((y) => ({ label: y.academic_year_name, value: y.academic_year_id })));
      })
      .catch(() => {});

    // Load semesters
    api.get<{ semester_id: string; semester_name: string }[]>('/semesters')
      .then((res) => {
        const list = res.data || [];
        setSemestersList(list.map((s) => ({ label: s.semester_name, value: s.semester_id })));
      })
      .catch(() => {});
  }, []);

  const methods = useForm<CourseOfferingFormValues>({
    resolver: zodResolver(courseOfferingFormSchema) as unknown as Resolver<CourseOfferingFormValues, unknown>,
    defaultValues: {
      courseId: initialData?.courseId || '',
      academicYearId: initialData?.academicYearId || '',
      semesterId: initialData?.semesterId || '',
      section: initialData?.section || '',
      maxCapacity: initialData?.maxCapacity || 60,
      status: (initialData?.status as unknown as 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED') || 'PLANNED',
    } as unknown as DefaultValues<CourseOfferingFormValues>,
  });

  const handleFormSubmit = async (values: CourseOfferingFormValues) => {
    const courseObj = courses.find((c) => c.value === values.courseId);
    const ayObj = academicYears.find((y) => y.value === values.academicYearId);
    const semObj = semestersList.find((s) => s.value === values.semesterId);

    await onSubmit({
      ...values,
      maxCapacity: Number(values.maxCapacity),
      courseCode: courseObj?.label.split('] ')[0].replace('[', '') || 'CS-301',
      courseName: courseObj?.label.split('] ')[1] || 'Software Engineering',
      academicYear: ayObj?.label || 'Academic Year 2026-2027',
      semester: semObj?.label || 'Fall 2026 Semester',
      program: 'B.Tech',
      department: 'Computer Science',
      courseOfferingId: initialData?.courseOfferingId || '',
    } as Omit<CourseOffering, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            name="courseId"
            label="Course"
            options={courses}
            required
            disabled={isEdit}
          />
          <FormSelect
            name="academicYearId"
            label="Academic Year"
            options={academicYears}
            required
            disabled={isEdit}
          />
          <FormSelect
            name="semesterId"
            label="Semester"
            options={semestersList}
            required
            disabled={isEdit}
          />
          <FormInput
            name="section"
            label="Section"
            placeholder="e.g. A"
            required
          />
          <FormInput
            name="maxCapacity"
            label="Maximum Capacity"
            type="number"
            placeholder="e.g. 60"
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
            {isSubmitting ? 'Saving...' : 'Save Offering'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
