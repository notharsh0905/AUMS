export interface RawProgramResult {
  program_result_id: string;
  enrollment_id: string;
  cgpa: number;
  total_credits: number;
  earned_credits: number;
  credits_remaining: number;
  overall_percentage: number;
  degree_classification: string;
  graduation_eligibility: string;
  academic_standing: string;
  degree_completed: boolean;
  completion_date?: string;
  result_status: 'DRAFT' | 'PUBLISHED' | 'WITHHELD' | 'REVISED';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgramResult {
  programResultId: string;
  enrollmentId: string;
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  creditsRemaining: number;
  overallPercentage: number;
  degreeClassification: string;
  graduationEligibility: string;
  academicStanding: string;
  degreeCompleted: boolean;
  completionDate?: string;
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
  batch?: string;
}

export interface ProgramResultFilters {
  enrollmentId?: string;
  programId?: string;
  status?: string;
  batch?: string;
  search?: string;
}

export interface ProgramResultListResponse {
  results: ProgramResult[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
