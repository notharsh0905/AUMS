"use client";

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentFormSchema, StudentFormValues } from '../../schemas';
import { Student } from '../../types';
import { FormInput, FormSelect, FormDatePicker } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import {
  DEPARTMENT_OPTIONS,
  PROGRAM_OPTIONS,
  STATUS_OPTIONS,
  GENDER_OPTIONS,
} from '../../constants';

interface StudentFormProps {
  initialData?: Student | null;
  onSubmit: (values: Omit<Student, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

const SEMESTER_OPTIONS = [
  { label: 'Semester 1', value: '1' },
  { label: 'Semester 2', value: '2' },
  { label: 'Semester 3', value: '3' },
  { label: 'Semester 4', value: '4' },
  { label: 'Semester 5', value: '5' },
  { label: 'Semester 6', value: '6' },
  { label: 'Semester 7', value: '7' },
  { label: 'Semester 8', value: '8' },
];

export function StudentForm({ initialData, onSubmit, isSubmitting = false }: StudentFormProps) {
  const isEdit = !!initialData;

  const methods = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      studentId: initialData?.studentId || '',
      rollNumber: initialData?.rollNumber || '',
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      gender: initialData?.gender || '',
      dateOfBirth: initialData?.dateOfBirth ? initialData.dateOfBirth.slice(0, 10) : '',
      department: initialData?.department || '',
      program: initialData?.program || '',
      semester: initialData?.semester ? String(initialData.semester) : '',
      admissionDate: initialData?.admissionDate ? initialData.admissionDate.slice(0, 10) : '',
      status: initialData?.status || 'active',
    },
  });

  const handleFormSubmit = async (values: StudentFormValues) => {
    await onSubmit({
      ...values,
      semester: Number(values.semester),
    } as Omit<Student, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="studentId"
            label="Student ID"
            placeholder="e.g. stud-101"
            required
            disabled={isEdit}
          />
          <FormInput
            name="rollNumber"
            label="Roll Number"
            placeholder="e.g. CS2023101"
            required
            disabled={isEdit}
          />
          <FormInput name="firstName" label="First Name" placeholder="Jane" required />
          <FormInput name="lastName" label="Last Name" placeholder="Doe" required />
          <FormInput name="email" label="Email Address" type="email" placeholder="jane.doe@aums.edu" required />
          <FormInput name="phone" label="Phone Number" placeholder="9876543210" required />
          <FormSelect name="gender" label="Gender" options={GENDER_OPTIONS} required />
          <FormDatePicker name="dateOfBirth" label="Date of Birth" required />
          <FormSelect name="department" label="Department" options={DEPARTMENT_OPTIONS} required />
          <FormSelect name="program" label="Program" options={PROGRAM_OPTIONS} required />
          <FormSelect name="semester" label="Semester" options={SEMESTER_OPTIONS} required />
          <FormDatePicker name="admissionDate" label="Admission Date" required />
          <FormSelect name="status" label="Status" options={STATUS_OPTIONS} required />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Student'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
