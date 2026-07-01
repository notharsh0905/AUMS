import { z } from 'zod';

export const assessmentFormSchema = z.object({
  courseOfferingId: z.string().min(1, 'Course Offering is required'),
  enrollmentId: z.string().min(1, 'Student is required'),
  quizMarks: z.union([z.string(), z.number()]).default(0),
  practicalMarks: z.union([z.string(), z.number()]).default(0),
  vivaMarks: z.union([z.string(), z.number()]).default(0),
  midSemesterMarks: z.union([z.string(), z.number()]).default(0),
  bonusMarks: z.union([z.string(), z.number()]).default(0),
  penalty: z.union([z.string(), z.number()]).default(0),
  maxMarks: z.union([z.string(), z.number()]).default(50),
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED']).default('DRAFT'),
  remarks: z.string().optional(),
});

export type AssessmentFormValues = z.infer<typeof assessmentFormSchema>;
