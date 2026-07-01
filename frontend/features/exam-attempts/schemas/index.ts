import { z } from 'zod';

export const marksEntryFormSchema = z.object({
  examRegistrationId: z.string().uuid('Invalid Exam Registration').min(1, 'Registration selection is required'),
  attemptNumber: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 1;
  }, {
    message: 'Attempt number must be at least 1',
  }),
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
  evaluatorId: z.string().uuid('Invalid Evaluator ID').min(1, 'Evaluator is required'),
  evaluatedAt: z.string().min(1, 'Evaluation date is required'),
  remarks: z.string().optional(),
});

export type MarksEntryFormValues = z.infer<typeof marksEntryFormSchema>;
