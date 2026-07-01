import { z } from 'zod';

export const courseFormSchema = z.object({
  courseCode: z.string().min(1, 'Course Code is required'),
  courseName: z.string().min(1, 'Course Name is required'),
  credits: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: 'Credits must be greater than 0',
  }),
  contactHours: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: 'Contact hours must be greater than 0',
  }),
  department: z.string().min(1, 'Department is required'),
  program: z.string().min(1, 'Program is required'),
  semester: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: 'Semester must be at least 1',
  }),
  courseType: z.string().min(1, 'Course Type is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
