import { z } from 'zod';

export const attendanceFormSchema = z.object({
  timetableEntryId: z.string().min(1, 'Timetable Entry is required'),
  date: z.string().min(1, 'Session Date is required'),
  status: z.enum(['COMPLETED', 'SCHEDULED', 'CANCELLED']).default('SCHEDULED'),
  remarks: z.string().optional(),
});

export type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;
