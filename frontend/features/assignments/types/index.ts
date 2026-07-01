export interface Assignment {
  assignmentId: string;
  courseOfferingId: string;
  courseCode: string;       // resolved
  courseName: string;       // resolved
  facultyProfileId: string;
  facultyName: string;      // resolved
  department: string;       // resolved
  program: string;          // resolved
  academicYear: string;     // resolved
  semester: string;         // resolved
  title: string;
  description: string;
  publishAt: string;
  dueAt: string;
  totalMarks: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignmentFilters {
  status?: string;
  search?: string;
}

export interface AssignmentListResponse {
  assignments: Assignment[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
