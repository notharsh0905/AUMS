import { z } from 'zod';

export const semesterResultFormSchema = z.object({
  enrollmentId: z.string().uuid('Invalid Student Enrollment').min(1, 'Student selection is required'),
  semesterId: z.string().uuid('Invalid Semester').min(1, 'Semester selection is required'),
  totalCredits: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }, {
    message: 'Total credits must be 0 or higher',
  }),
  earnedCredits: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }, {
    message: 'Earned credits must be 0 or higher',
  }),
  sgpa: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 0 && num <= 10.0;
  }, {
    message: 'SGPA must be between 0.0 and 10.0',
  }),
  resultStatus: z.enum(['DRAFT', 'PUBLISHED', 'WITHHELD', 'REVISED'], {
    message: 'Result status selection is required',
  }),
  publishedAt: z.string().optional(),
}).refine((data) => Number(data.earnedCredits) <= Number(data.totalCredits), {
  message: 'Earned credits cannot exceed total credits',
  path: ['earnedCredits'],
});

export type SemesterResultFormValues = z.infer<typeof semesterResultFormSchema>;
