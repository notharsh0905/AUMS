import { z } from 'zod';

export const academicYearFormSchema = z.object({
  academicYearName: z.string().min(1, 'Academic Year Name is required'),
  code: z.string().min(1, 'Code is required'),
  startDate: z.string().min(1, 'Start Date is required'),
  endDate: z.string().min(1, 'End Date is required'),
  isCurrent: z.union([z.string(), z.boolean()]).default(false),
  status: z.enum(['active', 'inactive']).default('active'),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type AcademicYearFormValues = z.infer<typeof academicYearFormSchema>;
