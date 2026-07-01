"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider, Resolver, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submissionFormSchema, SubmissionFormValues } from '../../schemas';
import { AssignmentSubmission } from '../../types';
import { FormInput, FormSelect } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';

interface SubmissionFormProps {
  initialData?: AssignmentSubmission | null;
  onSubmit: (values: Omit<AssignmentSubmission, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

interface RawAssignment {
  assignment_id: string;
  title: string;
  total_marks: number | { Float64: number; Valid: boolean };
  due_at: string | { Time: string; Valid: boolean };
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

export function SubmissionForm({ initialData, onSubmit, isSubmitting = false }: SubmissionFormProps) {
  const [assignments, setAssignments] = useState<{ label: string; value: string }[]>([]);
  const [students, setStudents] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load assignments
    api.get<RawAssignment[]>('/assignments')
      .then((res) => {
        const list = res.data || [];
        setAssignments(list.map((a) => ({ label: a.title, value: a.assignment_id })));
      })
      .catch(() => {});

    // Load student enrollments
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
  }, []);

  const defaultValues = useMemo(() => {
    const today = new Date();
    return {
      assignmentId: initialData?.assignmentId || '',
      enrollmentId: initialData?.enrollmentId || '',
      submissionStatus: initialData?.submissionStatus || 'SUBMITTED',
      submittedAt: initialData?.submittedAt || today.toISOString().slice(0, 10),
      remarks: initialData?.remarks || '',
    };
  }, [initialData]);

  const methods = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema) as unknown as Resolver<SubmissionFormValues, unknown>,
    defaultValues: defaultValues as unknown as DefaultValues<SubmissionFormValues>,
  });

  const handleFormSubmit = async (values: SubmissionFormValues) => {
    const assignObj = assignments.find((a) => a.value === values.assignmentId);
    const studObj = students.find((s) => s.value === values.enrollmentId);

    const sName = studObj?.label.split(' (')[0] || 'Student';
    const roll = studObj?.label.split(' (')[1]?.replace(')', '') || '2026CS101';

    await onSubmit({
      ...values,
      assignmentTitle: assignObj?.label || 'Course Assignment',
      studentName: sName,
      rollNumber: roll,
      dueDate: new Date().toISOString().slice(0, 10),
      maximumMarks: 100,
      facultyName: 'Dr. Alan Turing',
      program: 'B.Tech',
      department: 'Computer Science',
      semester: 'Fall 2026 Semester',
      academicYear: 'Academic Year 2026-2027',
      isLate: false,
      attachmentName: 'submitted_file.pdf',
      assignmentSubmissionId: initialData?.assignmentSubmissionId || '',
    } as Omit<AssignmentSubmission, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4">
          <FormSelect
            name="assignmentId"
            label="Assignment"
            options={assignments}
            required
          />
          <FormSelect
            name="enrollmentId"
            label="Student"
            options={students}
            required
          />
          <FormInput
            name="submittedAt"
            label="Submission Date"
            type="date"
            required
          />
          <FormInput
            name="remarks"
            label="Remarks (Optional)"
            placeholder="Submission notes..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Submit Assignment'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
