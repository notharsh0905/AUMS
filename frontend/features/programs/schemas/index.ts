import { z } from 'zod';

export const programFormSchema = z.object({
  programCode: z.string().min(1, 'Program Code is required'),
  programName: z.string().min(1, 'Program Name is required'),
  department: z.string().min(1, 'Department selection is required'),
  degreeType: z.string().min(1, 'Degree Type is required'),
  durationValue: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: 'Duration must be at least 1',
  }),
  durationUnit: z.string().min(1, 'Duration unit is required'),
  totalSemesters: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: 'Total semesters must be at least 1',
  }),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type ProgramFormValues = z.infer<typeof programFormSchema>;
