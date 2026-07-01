export interface Department {
  departmentId: string;
  schoolId: string;
  departmentCode: string;
  departmentName: string;
  description: string;
  school: string; // school_name resolved
  hod?: string;   // simulated HOD fallback
  status: 'active' | 'inactive'; // simulated status fallback
  createdAt?: string;
  updatedAt?: string;
}

export interface DepartmentFilters {
  school?: string;
  status?: string;
  search?: string;
}

export interface DepartmentListResponse {
  departments: Department[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
