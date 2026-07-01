"use client";

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, Resolver, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationFormSchema, RegistrationFormValues } from '../../schemas';
import { StudentCourseRegistration } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { STATUS_OPTIONS } from '../../constants';

interface RegistrationFormProps {
  initialData?: StudentCourseRegistration | null;
  onSubmit: (values: Omit<StudentCourseRegistration, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
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

export function RegistrationForm({ initialData, onSubmit, isSubmitting = false }: RegistrationFormProps) {
  const isEdit = !!initialData;
  const [students, setStudents] = useState<{ label: string; value: string }[]>([]);
  const [offerings, setOfferings] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load student enrollments with labels resolved
    Promise.all([
      api.get<RawEnrollment[]>('/student-enrollments').catch(() => ({ data: [] })),
      api.get<RawStudent[]>('/students').catch(() => ({ data: [] })),
    ])
      .then(([enrollRes, studRes]) => {
        const enrolls = enrollRes.data || [];
        const studs = studRes.data || [];

        setStudents(
          enrolls.map((item) => {
            const student = studs.find((s) => s.student_profile_id === item.student_profile_id);
            const labelStr = student
              ? `${student.first_name} ${student.last_name} (${student.roll_number})`
              : `Enrollment: ${item.enrollment_number}`;

            return { label: labelStr, value: item.enrollment_id };
          })
        );
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

  const methods = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema) as unknown as Resolver<RegistrationFormValues, unknown>,
    defaultValues: {
      enrollmentId: initialData?.enrollmentId || '',
      courseOfferingId: initialData?.courseOfferingId || '',
      registrationStatus: initialData?.registrationStatus || 'REGISTERED',
      registeredAt: initialData?.registeredAt || '',
    } as unknown as DefaultValues<RegistrationFormValues>,
  });

  const handleFormSubmit = async (values: RegistrationFormValues) => {
    const studObj = students.find((s) => s.value === values.enrollmentId);
    const offObj = offerings.find((o) => o.value === values.courseOfferingId);

    const sName = studObj?.label.split(' (')[0] || 'Student Profile';
    const roll = studObj?.label.split(' (')[1]?.replace(')', '') || '2026CS101';

    await onSubmit({
      ...values,
      studentName: sName,
      rollNumber: roll,
      studentId: 'STU-100',
      courseCode: offObj?.label.split('] ')[0].replace('[', '') || 'CS-301',
      courseName: offObj?.label.split(' - ')[0].split('] ')[1] || 'Software Engineering',
      facultyName: 'TBD',
      semester: offObj?.label.split(' (')[1]?.replace(')', '') || 'Fall 2026 Semester',
      program: 'B.Tech',
      department: 'Computer Science',
      academicYear: 'Academic Year 2026-2027',
      studentCourseRegistrationId: initialData?.studentCourseRegistrationId || '',
    } as Omit<StudentCourseRegistration, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            name="enrollmentId"
            label="Student"
            options={students}
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
          <FormSelect
            name="registrationStatus"
            label="Registration Status"
            options={STATUS_OPTIONS}
            required
          />
          <FormInput
            name="registeredAt"
            label="Registration Date"
            type="date"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Register Student'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
