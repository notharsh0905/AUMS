import { z } from 'zod';

export const courseOfferingFormSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  academicYearId: z.string().min(1, 'Academic Year is required'),
  semesterId: z.string().min(1, 'Semester is required'),
  section: z.string().min(1, 'Section is required'),
  maxCapacity: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: 'Capacity must be greater than 0',
  }),
  status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED']).default('PLANNED'),
});

export type CourseOfferingFormValues = z.infer<typeof courseOfferingFormSchema>;
