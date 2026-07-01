import { z } from 'zod';

export const submissionFormSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment is required'),
  enrollmentId: z.string().min(1, 'Student Enrollment is required'),
  submissionStatus: z.enum(['SUBMITTED', 'GRADED', 'LATE', 'PENDING']).default('SUBMITTED'),
  submittedAt: z.string().min(1, 'Submission Date is required'),
  remarks: z.string().optional(),
});

export const gradingFormSchema = z.object({
  marksAwarded: z.union([z.string(), z.number()]).refine((val) => Number(val) >= 0, {
    message: 'Marks awarded must be positive',
  }),
  feedback: z.string().min(1, 'Feedback text is required'),
});

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>;
export type GradingFormValues = z.infer<typeof gradingFormSchema>;
