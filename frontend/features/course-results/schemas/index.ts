import { z } from 'zod';

export const courseResultFormSchema = z.object({
  enrollmentId: z.string().uuid('Invalid Student Enrollment').min(1, 'Student selection is required'),
  courseOfferingId: z.string().uuid('Invalid Course Offering').min(1, 'Course Offering selection is required'),
  internalMarks: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }, {
    message: 'Internal marks must be 0 or higher',
  }),
  externalMarks: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }, {
    message: 'External marks must be 0 or higher',
  }),
  totalMarks: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, {
    message: 'Maximum possible marks must be greater than 0',
  }),
  resultStatus: z.enum(['DRAFT', 'PUBLISHED', 'WITHHELD', 'REVISED'], {
    message: 'Result status selection is required',
  }),
  publishedAt: z.string().optional(),
});

export type CourseResultFormValues = z.infer<typeof courseResultFormSchema>;
