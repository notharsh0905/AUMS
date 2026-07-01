"use client";

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, Resolver, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { timetableFormSchema, TimetableFormValues } from '../../schemas';
import { TimetableSlot } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { DAY_OPTIONS, ENTRY_TYPE_OPTIONS, STATUS_OPTIONS } from '../../constants';

interface TimetableFormProps {
  initialData?: TimetableSlot | null;
  onSubmit: (values: Omit<TimetableSlot, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
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

export function TimetableForm({ initialData, onSubmit, isSubmitting = false }: TimetableFormProps) {
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

  const methods = useForm<TimetableFormValues>({
    resolver: zodResolver(timetableFormSchema) as unknown as Resolver<TimetableFormValues, unknown>,
    defaultValues: {
      courseOfferingId: initialData?.courseOfferingId || '',
      facultyProfileId: initialData?.facultyProfileId || '',
      dayOfWeek: initialData?.dayOfWeek || 'MONDAY',
      startTime: initialData?.startTime || '09:00',
      endTime: initialData?.endTime || '10:30',
      classroom: initialData?.classroom || 'Room 101',
      building: initialData?.building || 'Block A',
      maxCapacity: initialData?.maxCapacity || 60,
      entryType: initialData?.entryType || 'LECTURE',
      status: initialData?.status || 'ACTIVE',
    } as unknown as DefaultValues<TimetableFormValues>,
  });

  const handleFormSubmit = async (values: TimetableFormValues) => {
    const facObj = faculty.find((f) => f.value === values.facultyProfileId);
    const offObj = offerings.find((o) => o.value === values.courseOfferingId);

    const fName = facObj?.label || 'Faculty Member';
    const cCode = offObj?.label.split('] ')[0].replace('[', '') || 'CS-302';
    const cName = offObj?.label.split(' - ')[0].split('] ')[1] || 'DBMS';
    const sec = offObj?.label.split(' - Sec ')[1]?.split(' (')[0] || 'A';
    const sem = offObj?.label.split(' (')[1]?.replace(')', '') || 'Fall 2026 Semester';

    await onSubmit({
      ...values,
      maxCapacity: Number(values.maxCapacity),
      facultyName: fName,
      courseCode: cCode,
      courseName: cName,
      section: sec,
      semester: sem,
      program: 'B.Tech',
      department: 'Computer Science',
      academicYear: 'Academic Year 2026-2027',
      timetableSlotId: initialData?.timetableSlotId || '',
    } as Omit<TimetableSlot, 'createdAt' | 'updatedAt'>);
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
          />
          <FormSelect
            name="facultyProfileId"
            label="Faculty"
            options={faculty}
            required
          />
          <FormSelect
            name="dayOfWeek"
            label="Day of Week"
            options={DAY_OPTIONS}
            required
          />
          <FormSelect
            name="entryType"
            label="Entry Type"
            options={ENTRY_TYPE_OPTIONS}
            required
          />
          <FormInput
            name="startTime"
            label="Start Time"
            type={"time" as unknown as 'text'}
            required
          />
          <FormInput
            name="endTime"
            label="End Time"
            type={"time" as unknown as 'text'}
            required
          />
          <FormInput
            name="classroom"
            label="Classroom / Room"
            placeholder="Room 201"
            required
          />
          <FormInput
            name="building"
            label="Building"
            placeholder="Block A"
            required
          />
          <FormInput
            name="maxCapacity"
            label="Capacity"
            type="number"
            required
          />
          <FormSelect
            name="status"
            label="Status"
            options={STATUS_OPTIONS}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Slot'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
