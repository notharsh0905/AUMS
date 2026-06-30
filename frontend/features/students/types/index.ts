export type StudentStatus = 'active' | 'inactive' | 'suspended' | 'graduated';

export interface Student {
  studentId: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  department: string;
  semester: number;
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
