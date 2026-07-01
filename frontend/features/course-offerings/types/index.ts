export interface CourseOffering {
  courseOfferingId: string;
  courseId: string;
  courseCode: string;       // resolved
  courseName: string;       // resolved
  program: string;          // resolved
  department: string;       // resolved
  academicYearId: string;
  academicYear: string;     // resolved
  semesterId: string;
  semester: string;         // resolved semester_name
  section: string;
  maxCapacity: number;
  status: string;           // PLANNED, ACTIVE, COMPLETED, CANCELLED
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseOfferingFilters {
  academicYear?: string;
  semester?: string;
  status?: string;
  search?: string;
}

export interface CourseOfferingListResponse {
  courseOfferings: CourseOffering[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
