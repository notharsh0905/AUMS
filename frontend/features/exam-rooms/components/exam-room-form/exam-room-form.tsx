"use client";

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { examRoomFormSchema, ExamRoomFormValues } from '../../schemas';
import { ExamRoom } from '../../types';
import { FormInput, FormSelect, FormSwitch } from '@/components/shared/form-components';
import { Button } from '@/components/ui/button';
import { STATUS_OPTIONS, ROOM_TYPE_OPTIONS } from '../../constants';
import { api } from '@/services/api';

interface ExamRoomFormProps {
  initialData?: ExamRoom | null;
  onSubmit: (values: Omit<ExamRoom, 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  isSubmitting?: boolean;
}

interface RawExamRoom {
  institution_id: string;
}

export function ExamRoomForm({ initialData, onSubmit, isSubmitting = false }: ExamRoomFormProps) {
  const isEdit = !!initialData;
  const [resolvedInstitutionId, setResolvedInstitutionId] = useState(
    initialData?.institutionId || '00000000-0000-0000-0000-000000000000'
  );

  const methods = useForm<ExamRoomFormValues>({
    resolver: zodResolver(examRoomFormSchema),
    defaultValues: {
      building: initialData?.building || '',
      roomNumber: initialData?.roomNumber || '',
      roomName: initialData?.roomName || '',
      floor: initialData?.floor !== undefined ? initialData.floor : 0,
      block: initialData?.block || '',
      capacity: initialData?.capacity || 30,
      roomType: initialData?.roomType || 'CLASSROOM',
      status: initialData?.status || 'ACTIVE',
      hasProjector: initialData?.hasProjector || false,
      hasAc: initialData?.hasAc || false,
      wheelchairAccessible: initialData?.wheelchairAccessible || false,
      institutionId: initialData?.institutionId || '00000000-0000-0000-0000-000000000000',
    },
  });

  // Load existing exam rooms to find a valid institution_id currently in use
  useEffect(() => {
    if (isEdit) {
      return;
    }

    api.get<RawExamRoom[]>('/exam-rooms')
      .then((res) => {
        const list = res.data || [];
        if (list.length > 0 && list[0].institution_id) {
          setResolvedInstitutionId(list[0].institution_id);
          methods.setValue('institutionId', list[0].institution_id);
        }
      })
      .catch((err) => console.warn('Failed to load existing exam rooms for default institution_id:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  // Keep form value in sync when resolvedInstitutionId changes asynchronously
  useEffect(() => {
    if (!isEdit && resolvedInstitutionId !== '00000000-0000-0000-0000-000000000000') {
      methods.setValue('institutionId', resolvedInstitutionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedInstitutionId, isEdit]);

  const handleFormSubmit = async (values: ExamRoomFormValues) => {
    await onSubmit({
      ...values,
      floor: Number(values.floor),
      capacity: Number(values.capacity),
      examRoomId: initialData?.examRoomId || '',
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="building"
            label="Building"
            placeholder="e.g. Science Block, Ramanujan Hall"
            required
          />
          <FormInput
            name="roomNumber"
            label="Room Number"
            placeholder="e.g. 101, LH-02"
            required
            disabled={isEdit}
          />
          <FormInput
            name="roomName"
            label="Room Name"
            placeholder="e.g. Room 101, Lecture Hall 2"
            required
          />
          <FormInput
            name="floor"
            label="Floor"
            type="number"
            placeholder="e.g. 0 for Ground, 1 for First"
            required
          />
          <FormInput
            name="block"
            label="Block / Wing"
            placeholder="e.g. A-Block, West Wing"
          />
          <FormInput
            name="capacity"
            label="Seating Capacity"
            type="number"
            placeholder="e.g. 40"
            required
          />
          <FormSelect
            name="roomType"
            label="Room Type"
            options={ROOM_TYPE_OPTIONS}
            required
          />
          <FormSelect
            name="status"
            label="Status"
            options={STATUS_OPTIONS}
            required
          />
        </div>

        <div className="flex flex-col gap-1 border-t border-zinc-100 dark:border-zinc-900 pt-3">
          <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
            Amenities & Accessibility
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <FormSwitch
              name="hasProjector"
              label="Projector"
              description="Has audio-visual projector setup"
            />
            <FormSwitch
              name="hasAc"
              label="Air Conditioning"
              description="Equipped with functional AC cooling"
            />
            <FormSwitch
              name="wheelchairAccessible"
              label="Wheelchair Access"
              description="Accessible for disabled students"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-zinc-100 dark:border-zinc-900 pt-3">
          <FormInput
            name="institutionId"
            label="Institution ID"
            placeholder="e.g. UUID format"
            required
            description="UUID of the educational institution. Pre-resolved from existing database structures."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold h-10 px-6 border-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Exam Room'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
