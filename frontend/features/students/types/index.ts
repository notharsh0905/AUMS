export type StudentStatus = 'active' | 'inactive' | 'suspended' | 'graduated';

export interface Student {
  studentId: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  department: string;
  program: string;
  semester: number;
  admissionDate: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFilters {
  status?: string;
  department?: string;
  program?: string;
  search?: string;
}

export interface StudentListResponse {
  students: Student[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
