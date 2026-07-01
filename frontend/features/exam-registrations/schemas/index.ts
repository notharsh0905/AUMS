import { z } from 'zod';

export const examRegistrationFormSchema = z.object({
  examId: z.string().uuid('Invalid Exam ID').min(1, 'Exam selection is required'),
  enrollmentId: z.string().uuid('Invalid Student Enrollment').min(1, 'Student selection is required'),
  registrationStatus: z.enum(['REGISTERED', 'ABSENT', 'DISQUALIFIED'], {
    message: 'Status selection is required',
  }),
});

export type ExamRegistrationFormValues = z.infer<typeof examRegistrationFormSchema>;
