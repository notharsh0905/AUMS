import { z } from 'zod';

export const programResultFormSchema = z.object({
  enrollmentId: z.string().uuid('Invalid Student Enrollment').min(1, 'Student selection is required'),
  cgpa: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 0 && num <= 10.0;
  }, {
    message: 'CGPA must be between 0.0 and 10.0',
  }),
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
  degreeCompleted: z.boolean(),
  completionDate: z.string().optional(),
  resultStatus: z.enum(['DRAFT', 'PUBLISHED', 'WITHHELD', 'REVISED'], {
    message: 'Result status selection is required',
  }),
  publishedAt: z.string().optional(),
}).refine((data) => Number(data.earnedCredits) <= Number(data.totalCredits), {
  message: 'Earned credits cannot exceed total credits',
  path: ['earnedCredits'],
});

export type ProgramResultFormValues = z.infer<typeof programResultFormSchema>;
