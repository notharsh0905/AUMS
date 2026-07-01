"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider, Resolver, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assignmentFormSchema, AssignmentFormValues } from '../../schemas';
import { Assignment } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { STATUS_OPTIONS } from '../../constants';

interface AssignmentFormProps {
  initialData?: Assignment | null;
  onSubmit: (values: Omit<Assignment, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

interface RawFaculty {
  faculty_profile_id: string;
  first_name: string;
  last_name: string;
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

export function AssignmentForm({ initialData, onSubmit, isSubmitting = false }: AssignmentFormProps) {
  const [faculty, setFaculty] = useState<{ label: string; value: string }[]>([]);
  const [offerings, setOfferings] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load faculty
    api.get<RawFaculty[]>('/faculty')
      .then((res) => {
        const list = res.data || [];
        setFaculty(list.map((f) => ({ label: `${f.first_name} ${f.last_name}`, value: f.faculty_profile_id })));
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
            const labelStr = `[${courseObj?.course_code || 'CS-302'}] ${
              courseObj?.course_name || 'DBMS'
            } - Sec ${item.section || 'A'} (${semObj?.semester_name || 'Fall 2026 Semester'})`;

            return { label: labelStr, value: item.course_offering_id };
          })
        );
      })
      .catch(() => {});
  }, []);

  const defaultValues = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      title: initialData?.title || '',
      description: initialData?.description || '',
      courseOfferingId: initialData?.courseOfferingId || '',
      facultyProfileId: initialData?.facultyProfileId || '',
      publishAt: initialData?.publishAt || today.toISOString().slice(0, 10),
      dueAt: initialData?.dueAt || nextWeek.toISOString().slice(0, 10),
      totalMarks: initialData?.totalMarks || 100,
      status: initialData?.status || 'DRAFT',
    };
  }, [initialData]);

  const methods = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema) as unknown as Resolver<AssignmentFormValues, unknown>,
    defaultValues: defaultValues as unknown as DefaultValues<AssignmentFormValues>,
  });

  const handleFormSubmit = async (values: AssignmentFormValues) => {
    const facObj = faculty.find((f) => f.value === values.facultyProfileId);
    const offObj = offerings.find((o) => o.value === values.courseOfferingId);

    const fName = facObj?.label || 'Faculty Member';
    const cCode = offObj?.label.split('] ')[0].replace('[', '') || 'CS-302';
    const cName = offObj?.label.split(' - ')[0].split('] ')[1] || 'DBMS';
    const sem = offObj?.label.split(' (')[1]?.replace(')', '') || 'Fall 2026 Semester';

    await onSubmit({
      ...values,
      totalMarks: Number(values.totalMarks),
      facultyName: fName,
      courseCode: cCode,
      courseName: cName,
      semester: sem,
      program: 'B.Tech',
      department: 'Computer Science',
      academicYear: 'Academic Year 2026-2027',
      assignmentId: initialData?.assignmentId || '',
    } as Omit<Assignment, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="title"
            label="Assignment Title"
            placeholder="Introduction to SQL Queries"
            required
          />
          <FormSelect
            name="courseOfferingId"
            label="Course Offering"
            options={offerings}
            required
          />
          <FormSelect
            name="facultyProfileId"
            label="Faculty Coordinator"
            options={faculty}
            required
          />
          <FormInput
            name="totalMarks"
            label="Max Marks"
            type="number"
            required
          />
          <FormInput
            name="publishAt"
            label="Publish Date"
            type="date"
            required
          />
          <FormInput
            name="dueAt"
            label="Due Date"
            type="date"
            required
          />
          <FormSelect
            name="status"
            label="Status"
            options={STATUS_OPTIONS}
            required
          />
          <FormInput
            name="description"
            label="Task Description"
            placeholder="Write assignment details..."
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Assignment'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
