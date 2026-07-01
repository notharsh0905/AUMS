import { z } from 'zod';

export const assignmentFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  courseOfferingId: z.string().min(1, 'Course Offering is required'),
  facultyProfileId: z.string().min(1, 'Faculty Profile is required'),
  publishAt: z.string().min(1, 'Publish date is required'),
  dueAt: z.string().min(1, 'Due date is required'),
  totalMarks: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: 'Max marks must be greater than 0',
  }),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).default('DRAFT'),
}).refine((data) => data.dueAt > data.publishAt, {
  message: 'Due date must be after publish date',
  path: ['dueAt'],
});

export type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;
