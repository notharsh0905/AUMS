import { z } from 'zod';

export const facultyFormSchema = z.object({
  employeeCode: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15, 'Phone cannot exceed 15 digits'),
  department: z.string().min(1, 'Department selection is required'),
  designation: z.string().min(1, 'Designation selection is required'),
  employmentType: z.string().min(1, 'Employment Type selection is required'),
  joiningDate: z.string().min(1, 'Joining Date is required'),
  status: z.enum(['active', 'on_leave', 'suspended', 'retired', 'resigned'], {
    message: 'Status selection is required',
  }),
  yearsOfExperience: z.string().optional(),
  officeLocation: z.string().optional(),
  bio: z.string().optional(),
});

export type FacultyFormValues = z.infer<typeof facultyFormSchema>;
