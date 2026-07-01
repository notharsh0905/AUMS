import { z } from 'zod';

export const semesterFormSchema = z.object({
  semesterName: z.string().min(1, 'Semester Name is required'),
  semesterNumber: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: 'Semester Number must be at least 1',
  }),
  academicYearId: z.string().min(1, 'Academic Year is required'),
  startDate: z.string().min(1, 'Start Date is required'),
  endDate: z.string().min(1, 'End Date is required'),
  status: z.enum(['active', 'inactive']).default('active'),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type SemesterFormValues = z.infer<typeof semesterFormSchema>;
