import { z } from 'zod';

export const allocationFormSchema = z.object({
  facultyProfileId: z.string().min(1, 'Faculty Profile is required'),
  courseOfferingId: z.string().min(1, 'Course Offering is required'),
});

export type AllocationFormValues = z.infer<typeof allocationFormSchema>;
