export interface FacultyCourseAllocation {
  facultyCourseAllocationId: string;
  facultyProfileId: string;
  facultyName: string;      // resolved
  employeeId: string;       // resolved
  courseOfferingId: string;
  courseCode: string;       // resolved
  courseName: string;       // resolved
  program: string;          // resolved
  department: string;       // resolved
  academicYear: string;     // resolved
  semester: string;         // resolved
  status: string;           // resolved status of course offering
  allocatedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AllocationFilters {
  status?: string;
  search?: string;
}

export interface AllocationListResponse {
  allocations: FacultyCourseAllocation[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
