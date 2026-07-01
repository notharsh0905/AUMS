export interface RawSemesterResult {
  semester_result_id: string;
  enrollment_id: string;
  semester_id: string;
  total_credits: number;
  earned_credits: number;
  sgpa: number;
  result_status: 'DRAFT' | 'PUBLISHED' | 'WITHHELD' | 'REVISED';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SemesterResult {
  semesterResultId: string;
  enrollmentId: string;
  semesterId: string;
  totalCredits: number;
  earnedCredits: number;
  sgpa: number;
  resultStatus: 'DRAFT' | 'PUBLISHED' | 'WITHHELD' | 'REVISED';
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;

  // Joined lookups
  studentName?: string;
  rollNumber?: string;
  studentEmail?: string;
  programCode?: string;
  programName?: string;
  programId?: string;
  semesterName?: string;

  // Calculated fields
  backlogCount?: number;
  academicStanding?: string;
}

export interface SemesterResultFilters {
  enrollmentId?: string;
  semesterId?: string;
  status?: string;
  programId?: string;
  search?: string;
}

export interface SemesterResultListResponse {
  results: SemesterResult[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
