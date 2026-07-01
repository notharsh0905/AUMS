import { z } from 'zod';

export const timetableFormSchema = z.object({
  courseOfferingId: z.string().min(1, 'Course Offering is required'),
  facultyProfileId: z.string().min(1, 'Faculty Profile is required'),
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  startTime: z.string().min(1, 'Start Time is required'),
  endTime: z.string().min(1, 'End Time is required'),
  classroom: z.string().min(1, 'Classroom is required'),
  building: z.string().min(1, 'Building is required'),
  maxCapacity: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: 'Capacity must be greater than 0',
  }),
  entryType: z.enum(['LECTURE', 'LAB', 'TUTORIAL', 'SEMINAR', 'WORKSHOP']).default('LECTURE'),
  status: z.enum(['ACTIVE', 'PLANNED', 'COMPLETED', 'CANCELLED']).default('ACTIVE'),
}).refine((data) => data.endTime > data.startTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export type TimetableFormValues = z.infer<typeof timetableFormSchema>;
