import { z } from 'zod';

export const examRoomFormSchema = z.object({
  building: z.string().min(1, 'Building is required'),
  roomNumber: z.string().min(1, 'Room number is required'),
  roomName: z.string().min(1, 'Room name is required'),
  floor: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }, {
    message: 'Floor must be 0 or higher',
  }),
  block: z.string().optional(),
  capacity: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 1;
  }, {
    message: 'Capacity must be at least 1',
  }),
  roomType: z.string().min(1, 'Room type is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE'], {
    message: 'Status is required',
  }),
  hasProjector: z.boolean(),
  hasAc: z.boolean(),
  wheelchairAccessible: z.boolean(),
  institutionId: z.string().uuid('Invalid Institution ID format').min(1, 'Institution ID is required'),
});

export type ExamRoomFormValues = z.infer<typeof examRoomFormSchema>;
