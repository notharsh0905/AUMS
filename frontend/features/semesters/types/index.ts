export interface Semester {
  semesterId: string;
  academicYearId: string;
  academicYear: string;   // resolved academic_year_name
  semesterNumber: number;
  semesterName: string;
  startDate: string;      // YYYY-MM-DD
  endDate: string;        // YYYY-MM-DD
  status: 'active' | 'inactive'; // simulated mapping from dates
  createdAt?: string;
  updatedAt?: string;
}

export interface SemesterFilters {
  academicYear?: string;
  status?: string;
  search?: string;
}

export interface SemesterListResponse {
  semesters: Semester[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
