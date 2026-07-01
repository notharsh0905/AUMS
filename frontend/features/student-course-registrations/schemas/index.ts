import { z } from 'zod';

export const registrationFormSchema = z.object({
  enrollmentId: z.string().min(1, 'Student Enrollment profile is required'),
  courseOfferingId: z.string().min(1, 'Course Offering is required'),
  registrationStatus: z.enum(['REGISTERED', 'DROPPED', 'COMPLETED', 'FAILED']).default('REGISTERED'),
  registeredAt: z.string().min(1, 'Registration Date is required'),
});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
