"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider, Resolver, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assessmentFormSchema, AssessmentFormValues } from '../../schemas';
import { InternalAssessment } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { STATUS_OPTIONS } from '../../constants';

interface AssessmentFormProps {
  initialData?: InternalAssessment | null;
  onSubmit: (values: Omit<InternalAssessment, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

interface RawCourseOffering {
  course_offering_id: string;
  course_id: string;
  section: string;
}

interface RawCourse {
  course_id: string;
  course_code: string;
  course_name: string;
}

interface RawEnrollment {
  enrollment_id: string;
  student_profile_id: string;
  enrollment_number: string;
}

interface RawStudent {
  student_profile_id: string;
  first_name: string;
  last_name: string;
  roll_number: string;
}

export function AssessmentForm({ initialData, onSubmit, isSubmitting = false }: AssessmentFormProps) {
  const [offerings, setOfferings] = useState<{ label: string; value: string }[]>([]);
  const [students, setStudents] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load offerings
    Promise.all([
      api.get<RawCourseOffering[]>('/course-offerings').catch(() => ({ data: [] })),
      api.get<RawCourse[]>('/courses').catch(() => ({ data: [] })),
    ])
      .then(([offRes, coursesRes]) => {
        const offs = offRes.data || [];
        const courses = coursesRes.data || [];
        setOfferings(
          offs.map((o) => {
            const cObj = courses.find((c) => c.course_id === o.course_id);
            return {
              label: `[${cObj?.course_code || 'CS-302'}] ${cObj?.course_name || 'DBMS'} - Sec ${o.section}`,
              value: o.course_offering_id,
            };
          })
        );
      })
      .catch(() => {});

    // Load students
    Promise.all([
      api.get<RawEnrollment[]>('/student-enrollments').catch(() => ({ data: [] })),
      api.get<RawStudent[]>('/students').catch(() => ({ data: [] })),
    ])
      .then(([enrollRes, studRes]) => {
        const enrolls = enrollRes.data || [];
        const studs = studRes.data || [];
        setStudents(
          enrolls.map((e) => {
            const sObj = studs.find((s) => s.student_profile_id === e.student_profile_id);
            return {
              label: sObj ? `${sObj.first_name} ${sObj.last_name} (${sObj.roll_number})` : `Enrollment: ${e.enrollment_number}`,
              value: e.enrollment_id,
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  const defaultValues = useMemo(() => {
    return {
      courseOfferingId: initialData?.courseOfferingId || '',
      enrollmentId: initialData?.enrollmentId || '',
      quizMarks: initialData?.quizMarks !== undefined ? initialData.quizMarks : 0,
      practicalMarks: initialData?.practicalMarks !== undefined ? initialData.practicalMarks : 0,
      vivaMarks: initialData?.vivaMarks !== undefined ? initialData.vivaMarks : 0,
      midSemesterMarks: initialData?.midSemesterMarks !== undefined ? initialData.midSemesterMarks : 0,
      bonusMarks: initialData?.bonusMarks !== undefined ? initialData.bonusMarks : 0,
      penalty: initialData?.penalty !== undefined ? initialData.penalty : 0,
      maxMarks: initialData?.maxMarks !== undefined ? initialData.maxMarks : 50,
      status: initialData?.status || 'DRAFT',
      remarks: initialData?.remarks || '',
    };
  }, [initialData]);

  const methods = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentFormSchema) as unknown as Resolver<AssessmentFormValues, unknown>,
    defaultValues: defaultValues as unknown as DefaultValues<AssessmentFormValues>,
  });

  const handleFormSubmit = async (values: AssessmentFormValues) => {
    const offObj = offerings.find((o) => o.value === values.courseOfferingId);
    const studObj = students.find((s) => s.value === values.enrollmentId);

    const sName = studObj?.label.split(' (')[0] || 'Student';
    const roll = studObj?.label.split(' (')[1]?.replace(')', '') || '2026CS101';
    const cCode = offObj?.label.split('] ')[0].replace('[', '') || 'CS-302';
    const cName = offObj?.label.split(' - ')[0].split('] ')[1] || 'DBMS';

    // Auto-resolve attendance and assignment scores default placeholders
    const attendancePercentage = initialData?.attendancePercentage || 85;
    const attendanceMarks = initialData?.attendanceMarks || 4;
    const assignmentMarks = initialData?.assignmentMarks || 8.5;

    const total =
      attendanceMarks +
      assignmentMarks +
      Number(values.quizMarks) +
      Number(values.practicalMarks) +
      Number(values.vivaMarks) +
      Number(values.midSemesterMarks) +
      Number(values.bonusMarks) -
      Number(values.penalty);

    await onSubmit({
      ...values,
      quizMarks: Number(values.quizMarks),
      practicalMarks: Number(values.practicalMarks),
      vivaMarks: Number(values.vivaMarks),
      midSemesterMarks: Number(values.midSemesterMarks),
      bonusMarks: Number(values.bonusMarks),
      penalty: Number(values.penalty),
      maxMarks: Number(values.maxMarks),
      attendancePercentage,
      attendanceMarks,
      assignmentMarks,
      totalInternalMarks: total,
      studentName: sName,
      rollNumber: roll,
      courseCode: cCode,
      courseName: cName,
      facultyName: 'Dr. Alan Turing',
      program: 'B.Tech',
      department: 'Computer Science',
      semester: 'Fall 2026 Semester',
      academicYear: 'Academic Year 2026-2027',
      assessmentId: initialData?.assessmentId || '',
    } as Omit<InternalAssessment, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            name="courseOfferingId"
            label="Course Offering"
            options={offerings}
            required
            disabled={!!initialData}
          />
          <FormSelect
            name="enrollmentId"
            label="Student"
            options={students}
            required
            disabled={!!initialData}
          />
          <FormInput
            name="midSemesterMarks"
            label="Mid Semester Exam (out of 20)"
            type="number"
            required
          />
          <FormInput
            name="quizMarks"
            label="Quiz Marks (out of 10)"
            type="number"
            required
          />
          <FormInput
            name="practicalMarks"
            label="Practical Marks"
            type="number"
            required
          />
          <FormInput
            name="vivaMarks"
            label="Viva Voce Marks"
            type="number"
            required
          />
          <FormInput
            name="bonusMarks"
            label="Bonus Marks"
            type="number"
            required
          />
          <FormInput
            name="penalty"
            label="Penalty Marks Deducted"
            type="number"
            required
          />
          <FormInput
            name="maxMarks"
            label="Maximum Internals (out of 50)"
            type="number"
            required
          />
          <FormSelect
            name="status"
            label="Status"
            options={STATUS_OPTIONS}
            required
          />
          <FormInput
            name="remarks"
            label="Remarks (Optional)"
            placeholder="Special consideration remarks..."
            className="md:col-span-2"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Marks'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
