import { z } from 'zod';

// Reusable validation schemas for the module (Create / Edit forms)
export const templateFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export type TemplateFormValues = z.infer<typeof templateFormSchema>;
