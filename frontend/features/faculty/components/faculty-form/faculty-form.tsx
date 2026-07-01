"use client";

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { facultyFormSchema, FacultyFormValues } from '../../schemas';
import { Faculty } from '../../types';
import { FormInput, FormSelect, FormDatePicker } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import {
  DEPARTMENT_OPTIONS,
  DESIGNATION_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  STATUS_OPTIONS,
} from '../../constants';

interface FacultyFormProps {
  initialData?: Faculty | null;
  onSubmit: (values: Omit<Faculty, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function FacultyForm({ initialData, onSubmit, isSubmitting = false }: FacultyFormProps) {
  const isEdit = !!initialData;

  const methods = useForm<FacultyFormValues>({
    resolver: zodResolver(facultyFormSchema),
    defaultValues: {
      employeeCode: initialData?.employeeCode || '',
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      department: initialData?.department || '',
      designation: initialData?.designation || '',
      employmentType: initialData?.employmentType || '',
      joiningDate: initialData?.joiningDate ? initialData.joiningDate.slice(0, 10) : '',
      status: (initialData?.status as 'active' | 'on_leave' | 'suspended' | 'retired' | 'resigned') || 'active',
      yearsOfExperience: initialData?.yearsOfExperience || '',
      officeLocation: initialData?.officeLocation || '',
      bio: initialData?.bio || '',
    },
  });

  const handleFormSubmit = async (values: FacultyFormValues) => {
    await onSubmit({
      ...values,
      facultyId: initialData?.facultyId || '',
    } as Omit<Faculty, 'createdAt' | 'updatedAt'>);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="employeeCode"
            label="Employee ID"
            placeholder="e.g. EMP1001"
            required
            disabled={isEdit}
          />
          <FormInput name="firstName" label="First Name" placeholder="John" required />
          <FormInput name="lastName" label="Last Name" placeholder="Smith" required />
          <FormInput
            name="email"
            label="Email Address"
            type="email"
            placeholder="smith@aums.edu"
            required
          />
          <FormInput name="phone" label="Phone Number" placeholder="9876543210" required />
          <FormSelect name="department" label="Department" options={DEPARTMENT_OPTIONS} required />
          <FormSelect
            name="designation"
            label="Designation"
            options={DESIGNATION_OPTIONS}
            required
          />
          <FormSelect
            name="employmentType"
            label="Employment Type"
            options={EMPLOYMENT_TYPE_OPTIONS}
            required
          />
          <FormDatePicker name="joiningDate" label="Joining Date" required />
          <FormSelect name="status" label="Status" options={STATUS_OPTIONS} required />
          <FormInput
            name="yearsOfExperience"
            label="Years of Experience"
            placeholder="e.g. 5"
            type="number"
          />
          <FormInput name="officeLocation" label="Office Location" placeholder="e.g. Block A, Room 204" />
        </div>

        <div className="flex flex-col gap-1.5">
          <FormInput name="bio" label="Short Bio" placeholder="Tell us about research interests..." />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Faculty'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
