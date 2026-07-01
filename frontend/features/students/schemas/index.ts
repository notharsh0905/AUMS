import { z } from 'zod';

export const studentFormSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  rollNumber: z.string().min(1, 'Roll Number is required'),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15, 'Phone cannot exceed 15 digits'),
  gender: z.string().min(1, 'Gender selection is required'),
  dateOfBirth: z.string().min(1, 'Date of Birth is required'),
  department: z.string().min(1, 'Department selection is required'),
  program: z.string().min(1, 'Program selection is required'),
  semester: z.string().min(1, 'Semester selection is required'),
  admissionDate: z.string().min(1, 'Admission Date is required'),
  status: z.enum(['active', 'inactive', 'suspended', 'graduated'], {
    message: 'Status selection is required',
  }),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
