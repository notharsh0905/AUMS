export type FacultyStatus = 'active' | 'on_leave' | 'suspended' | 'retired' | 'resigned';
export type EmploymentType = 'full_time' | 'part_time' | 'visiting' | 'contract' | 'adjunct';
export type FacultyDesignation = 'lecturer' | 'assistant_professor' | 'associate_professor' | 'professor' | 'head_of_department' | 'dean' | 'director' | 'registrar';

export interface Faculty {
  facultyId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string; // department_id
  designation: string; // string or FacultyDesignation matching options
  employmentType: string; // string or EmploymentType matching options
  joiningDate: string;
  status: string; // string matching status enums
  yearsOfExperience?: string;
  officeLocation?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FacultyFilters {
  status?: string;
  department?: string;
  employmentType?: string;
  designation?: string;
  search?: string;
}

export interface FacultyListResponse {
  faculty: Faculty[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
