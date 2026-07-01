import { z } from 'zod';

export const transcriptQuerySchema = z.object({
  studentId: z.string().uuid('Invalid Student ID format'),
});

export type TranscriptQueryValues = z.infer<typeof transcriptQuerySchema>;
