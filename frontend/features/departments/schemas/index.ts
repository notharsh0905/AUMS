import { z } from 'zod';

export const departmentFormSchema = z.object({
  departmentCode: z.string().min(1, 'Department Code is required'),
  departmentName: z.string().min(1, 'Department Name is required'),
  school: z.string().min(1, 'School selection is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive'], {
    message: 'Status selection is required',
  }),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;
