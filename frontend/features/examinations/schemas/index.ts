import { z } from 'zod';

export const examFormSchema = z.object({
  examName: z.string().min(1, 'Exam Name is required'),
  courseOfferingId: z.string().min(1, 'Course Offering is required'),
  examType: z.enum(['MID_SEMESTER', 'END_SEMESTER', 'PRACTICAL', 'VIVA', 'IMPROVEMENT', 'SUPPLEMENTARY']).default('MID_SEMESTER'),
  totalMarks: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: 'Max marks must be greater than 0',
  }),
  passingMarks: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: 'Passing marks must be greater than 0',
  }),
  examDate: z.string().min(1, 'Exam Date is required'),
  startTime: z.string().min(1, 'Start Time is required'),
  endTime: z.string().min(1, 'End Time is required'),
  status: z.enum(['DRAFT', 'SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']).default('DRAFT'),
  description: z.string().optional(),
}).refine((data) => Number(data.passingMarks) <= Number(data.totalMarks), {
  message: 'Passing marks cannot exceed total marks',
  path: ['passingMarks'],
});

export type ExamFormValues = z.infer<typeof examFormSchema>;
