"use client";

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, Resolver, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { attendanceFormSchema, AttendanceFormValues } from '../../schemas';
import { AttendanceSession } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { SESSION_STATUS_OPTIONS } from '../../constants';

interface AttendanceFormProps {
  initialData?: AttendanceSession | null;
  onSubmit: (values: Omit<AttendanceSession, 'createdAt' | 'updatedAt' | 'students' | 'totalStudents' | 'present' | 'absent' | 'percentage'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

interface RawTimetableEntry {
  timetable_entry_id: string;
  course_offering_id: string;
  faculty_profile_id: string;
  entry_type: string;
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

interface RawFaculty {
  faculty_profile_id: string;
  first_name: string;
  last_name: string;
}

export function AttendanceForm({ initialData, onSubmit, isSubmitting = false }: AttendanceFormProps) {
  const [entries, setEntries] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load timetable slots
    Promise.all([
      api.get<RawTimetableEntry[]>('/timetable-entries').catch(() => ({ data: [] })),
      api.get<RawCourseOffering[]>('/course-offerings').catch(() => ({ data: [] })),
      api.get<RawCourse[]>('/courses').catch(() => ({ data: [] })),
      api.get<RawSemester[]>('/semesters').catch(() => ({ data: [] })),
      api.get<RawFaculty[]>('/faculty').catch(() => ({ data: [] })),
    ])
      .then(([entRes, offRes, coursesRes, semRes, facRes]) => {
        const list = entRes.data || [];
        const offerings = offRes.data || [];
        const courses = coursesRes.data || [];
        const semesters = semRes.data || [];
        const faculty = facRes.data || [];

        setEntries(
          list.map((item) => {
            const offeringObj = offerings.find((o) => o.course_offering_id === item.course_offering_id);
            const courseObj = offeringObj ? courses.find((c) => c.course_id === offeringObj.course_id) : null;
            const semObj = offeringObj ? semesters.find((s) => s.semester_id === offeringObj.semester_id) : null;
            const facObj = faculty.find((f) => f.faculty_profile_id === item.faculty_profile_id);

            const labelStr = `[${courseObj?.course_code || 'CS-302'}] ${
              courseObj?.course_name || 'DBMS'
            } - Sec ${offeringObj?.section || 'A'} - ${facObj ? `${facObj.first_name} ${facObj.last_name}` : 'TBD'} (${
              semObj?.semester_name || 'Fall 2026'
            })`;

            return { label: labelStr, value: item.timetable_entry_id };
          })
        );
      })
      .catch(() => {});
  }, []);

  const methods = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema) as unknown as Resolver<AttendanceFormValues, unknown>,
    defaultValues: {
      timetableEntryId: initialData?.timetableEntryId || '',
      date: initialData?.date || new Date().toISOString().slice(0, 10),
      status: initialData?.status || 'SCHEDULED',
      remarks: initialData?.remarks || '',
    } as unknown as DefaultValues<AttendanceFormValues>,
  });

  const handleFormSubmit = async (values: AttendanceFormValues) => {
    const matched = entries.find((e) => e.value === values.timetableEntryId);

    const cCode = matched?.label.split('] ')[0].replace('[', '') || 'CS-302';
    const cName = matched?.label.split(' - ')[0].split('] ')[1] || 'Database Management Systems';
    const sec = matched?.label.split(' - Sec ')[1]?.split(' - ')[0] || 'A';
    const facName = matched?.label.split(' - Sec ')[1]?.split(' - ')[1]?.split(' (')[0] || 'Dr. Alan Turing';
    const sem = matched?.label.split(' (')[1]?.replace(')', '') || 'Fall 2026 Semester';

    await onSubmit({
      ...values,
      courseCode: cCode,
      courseName: cName,
      facultyName: facName,
      section: sec,
      semester: sem,
      program: 'B.Tech',
      department: 'Computer Science',
      attendanceSessionId: initialData?.attendanceSessionId || '',
    } as Omit<AttendanceSession, 'createdAt' | 'updatedAt' | 'students' | 'totalStudents' | 'present' | 'absent' | 'percentage'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            name="timetableEntryId"
            label="Timetable Entry / Slot"
            options={entries}
            required
          />
          <FormInput
            name="date"
            label="Session Date"
            type="date"
            required
          />
          <FormSelect
            name="status"
            label="Session Status"
            options={SESSION_STATUS_OPTIONS}
            required
          />
          <FormInput
            name="remarks"
            label="Remarks (Optional)"
            placeholder="Class session remarks..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Create Session'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
