export interface RawCourseResult {
  course_result_id: string;
  enrollment_id: string;
  course_offering_id: string;
  total_marks: number;
  marks_obtained: number;
  percentage: number;
  grade_scale_id: string;
  result_status: 'DRAFT' | 'PUBLISHED' | 'WITHHELD' | 'REVISED';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseResult {
  courseResultId: string;
  enrollmentId: string;
  courseOfferingId: string;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  gradeScaleId: string;
  resultStatus: 'DRAFT' | 'PUBLISHED' | 'WITHHELD' | 'REVISED';
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;

  // Joined lookups
  studentName?: string;
  rollNumber?: string;
  studentEmail?: string;
  courseCode?: string;
  courseName?: string;
  credits?: number;
  semesterName?: string;
  semesterId?: string;

  // Calculated fields
  gradeCode?: string;
  gradePoint?: number;
  isPass?: boolean;
  internalMarks?: number;
  externalMarks?: number;
}

export interface CourseResultFilters {
  enrollmentId?: string;
  courseOfferingId?: string;
  status?: string;
  semesterId?: string;
  search?: string;
}

export interface CourseResultListResponse {
  results: CourseResult[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
