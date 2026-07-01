export interface AcademicYear {
  academicYearId: string;
  academicYearName: string;
  code: string;           // resolved mapping from name (or name itself)
  startDate: string;      // YYYY-MM-DD
  endDate: string;        // YYYY-MM-DD
  isCurrent: boolean;
  status: 'active' | 'inactive'; // simulated mapping from isCurrent or today
  createdAt?: string;
  updatedAt?: string;
}

export interface AcademicYearFilters {
  status?: string;
  search?: string;
}

export interface AcademicYearListResponse {
  academicYears: AcademicYear[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
