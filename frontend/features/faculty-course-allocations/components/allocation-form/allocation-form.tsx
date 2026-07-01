"use client";

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, Resolver, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { allocationFormSchema, AllocationFormValues } from '../../schemas';
import { FacultyCourseAllocation } from '../../types';
import { FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';

interface AllocationFormProps {
  initialData?: FacultyCourseAllocation | null;
  onSubmit: (values: Omit<FacultyCourseAllocation, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

interface RawFaculty {
  faculty_profile_id: string;
  first_name: string;
  last_name: string;
  employee_id: string;
}

interface RawCourseOffering {
  course_offering_id: string;
  course_id: string;
  semester_id: string;
  section: string;
}

interface RawCourse {
  course_id: string;
  course_code: string;
  course_name: string;
}

interface RawSemester {
  semester_id: string;
  semester_name: string;
}

export function AllocationForm({ initialData, onSubmit, isSubmitting = false }: AllocationFormProps) {
  const isEdit = !!initialData;
  const [faculty, setFaculty] = useState<{ label: string; value: string }[]>([]);
  const [offerings, setOfferings] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load faculty profiles
    api.get<RawFaculty[]>('/faculty')
      .then((res) => {
        const list = res.data || [];
        setFaculty(list.map((f) => ({ label: `${f.first_name} ${f.last_name} (${f.employee_id})`, value: f.faculty_profile_id })));
      })
      .catch(() => {});

    // Load course offerings with labels resolved
    Promise.all([
      api.get<RawCourseOffering[]>('/course-offerings').catch(() => ({ data: [] })),
      api.get<RawCourse[]>('/courses').catch(() => ({ data: [] })),
      api.get<RawSemester[]>('/semesters').catch(() => ({ data: [] })),
    ])
      .then(([offRes, coursesRes, semRes]) => {
        const offs = offRes.data || [];
        const courses = coursesRes.data || [];
        const semesters = semRes.data || [];

        setOfferings(
          offs.map((item) => {
            const courseObj = courses.find((c) => c.course_id === item.course_id);
            const semObj = semesters.find((s) => s.semester_id === item.semester_id);
            const labelStr = `[${courseObj?.course_code || 'CS-301'}] ${
              courseObj?.course_name || 'Software Engineering'
            } - Sec ${item.section || 'A'} (${semObj?.semester_name || 'Fall 2026 Semester'})`;

            return { label: labelStr, value: item.course_offering_id };
          })
        );
      })
      .catch(() => {});
  }, []);

  const methods = useForm<AllocationFormValues>({
    resolver: zodResolver(allocationFormSchema) as unknown as Resolver<AllocationFormValues, unknown>,
    defaultValues: {
      facultyProfileId: initialData?.facultyProfileId || '',
      courseOfferingId: initialData?.courseOfferingId || '',
    } as unknown as DefaultValues<AllocationFormValues>,
  });

  const handleFormSubmit = async (values: AllocationFormValues) => {
    const facObj = faculty.find((f) => f.value === values.facultyProfileId);
    const offObj = offerings.find((o) => o.value === values.courseOfferingId);

    // Extract names cleanly
    const facName = facObj?.label.split(' (')[0] || 'Faculty Member';
    const empId = facObj?.label.split(' (')[1]?.replace(')', '') || 'EMP-100';

    await onSubmit({
      ...values,
      facultyName: facName,
      employeeId: empId,
      courseCode: offObj?.label.split('] ')[0].replace('[', '') || 'CS-301',
      courseName: offObj?.label.split(' - ')[0].split('] ')[1] || 'Software Engineering',
      section: offObj?.label.split(' - Sec ')[1]?.split(' (')[0] || 'A',
      semester: offObj?.label.split(' (')[1]?.replace(')', '') || 'Fall 2026 Semester',
      program: 'B.Tech',
      department: 'Computer Science',
      academicYear: 'Academic Year 2026-2027',
      status: 'ACTIVE',
      facultyCourseAllocationId: initialData?.facultyCourseAllocationId || '',
      allocatedAt: new Date().toISOString().slice(0, 10),
    } as Omit<FacultyCourseAllocation, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4">
          <FormSelect
            name="facultyProfileId"
            label="Faculty Member"
            options={faculty}
            required
            disabled={isEdit}
          />
          <FormSelect
            name="courseOfferingId"
            label="Course Offering"
            options={offerings}
            required
            disabled={isEdit}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Allocation'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
