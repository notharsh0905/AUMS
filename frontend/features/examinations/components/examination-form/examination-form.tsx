"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider, Resolver, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { examFormSchema, ExamFormValues } from '../../schemas';
import { Examination } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { EXAM_TYPE_OPTIONS, STATUS_OPTIONS } from '../../constants';

interface ExamFormProps {
  initialData?: Examination | null;
  onSubmit: (values: Omit<Examination, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

interface RawCourseOffering {
  course_offering_id: string;
  course_id: string;
  section: string;
  semester_id: string;
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

export function ExamForm({ initialData, onSubmit, isSubmitting = false }: ExamFormProps) {
  const [offerings, setOfferings] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load offerings with names resolved
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
    return {
      examName: initialData?.examName || '',
      courseOfferingId: initialData?.courseOfferingId || '',
      examType: initialData?.examType || 'MID_SEMESTER',
      totalMarks: initialData?.totalMarks || 100,
      passingMarks: initialData?.passingMarks || 40,
      examDate: initialData?.examDate || today.toISOString().slice(0, 10),
      startTime: initialData?.startTime || '09:00',
      endTime: initialData?.endTime || '12:00',
      status: initialData?.status || 'DRAFT',
      description: initialData?.description || '',
    };
  }, [initialData]);

  const methods = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema) as unknown as Resolver<ExamFormValues, unknown>,
    defaultValues: defaultValues as unknown as DefaultValues<ExamFormValues>,
  });

  const handleFormSubmit = async (values: ExamFormValues) => {
    const offObj = offerings.find((o) => o.value === values.courseOfferingId);
    const cCode = offObj?.label.split('] ')[0].replace('[', '') || 'CS-302';
    const cName = offObj?.label.split(' - ')[0].split('] ')[1] || 'DBMS';
    const sem = offObj?.label.split(' (')[1]?.replace(')', '') || 'Fall 2026 Semester';

    const startH = Number(values.startTime.split(':')[0]);
    const endH = Number(values.endTime.split(':')[0]);
    const dur = `${endH - startH} Hours`;

    await onSubmit({
      ...values,
      totalMarks: Number(values.totalMarks),
      passingMarks: Number(values.passingMarks),
      examCode: `${cCode}-EX`,
      courseCode: cCode,
      courseName: cName,
      facultyName: 'Dr. Alan Turing',
      program: 'B.Tech',
      department: 'Computer Science',
      semester: sem,
      academicYear: 'Academic Year 2026-2027',
      duration: dur,
      instructions: values.description || 'Bring admit cards. Calculators are restricted.',
      examId: initialData?.examId || '',
    } as Omit<Examination, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="examName"
            label="Exam Name"
            placeholder="End Semester Theory Paper"
            required
          />
          <FormSelect
            name="courseOfferingId"
            label="Course Offering"
            options={offerings}
            required
          />
          <FormSelect
            name="examType"
            label="Exam Type"
            options={EXAM_TYPE_OPTIONS}
            required
          />
          <FormSelect
            name="status"
            label="Exam Status"
            options={STATUS_OPTIONS}
            required
          />
          <FormInput
            name="totalMarks"
            label="Maximum Marks"
            type="number"
            required
          />
          <FormInput
            name="passingMarks"
            label="Passing Marks"
            type="number"
            required
          />
          <FormInput
            name="examDate"
            label="Exam Date"
            type="date"
            required
          />
          <FormInput
            name="startTime"
            label="Start Time"
            type="time"
            required
          />
          <FormInput
            name="endTime"
            label="End Time"
            type="time"
            required
          />
          <FormInput
            name="description"
            label="Instructions / Description"
            placeholder="Enter instructions..."
            className="md:col-span-2"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Exam'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
