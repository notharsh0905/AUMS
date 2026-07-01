export interface Course {
  courseId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  contactHours: number;
  description: string;
  courseType: string;
  department: string;     // resolved department_name
  program: string;        // resolved program_name
  semester: number;       // resolved semester_number
  status: 'active' | 'inactive'; // simulated status fallback
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseFilters {
  department?: string;
  program?: string;
  semester?: string;
  courseType?: string;
  status?: string;
  search?: string;
}

export interface CourseListResponse {
  courses: Course[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
