export interface Program {
  programId: string;
  departmentId: string;
  programCode: string;
  programName: string;
  degreeType: string;
  durationValue: number;
  durationUnit: string;
  totalSemesters: number;
  department: string; // resolved department_name
  status: 'active' | 'inactive'; // simulated status fallback
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgramFilters {
  department?: string;
  status?: string;
  search?: string;
}

export interface ProgramListResponse {
  programs: Program[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
