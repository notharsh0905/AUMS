export interface RawExamAttempt {
  exam_attempt_id: string;
  exam_registration_id: string;
  attempt_number: number;
  marks_obtained: number;
  evaluator_id: string;
  evaluated_at: string;
  remarks: string;
  created_at: string;
  updated_at: string;
}

export interface ExamAttempt {
  examAttemptId: string;
  examRegistrationId: string;
  attemptNumber: number;
  marksObtained: number;
  evaluatorId: string;
  evaluatedAt: string;
  remarks: string;
  createdAt?: string;
  updatedAt?: string;

  // Joined lookups
  studentName?: string;
  rollNumber?: string;
  studentEmail?: string;
  examName?: string;
  examType?: string;
  examDate?: string;
  courseCode?: string;
  courseName?: string;
  maxMarks?: number;
  passingMarks?: number;
  evaluatorName?: string;

  // Computed & split fields
  isPass?: boolean;
  internalMarks?: number;
  externalMarks?: number;
}

export interface ExamAttemptFilters {
  examId?: string;
  registrationId?: string;
  enrollmentId?: string;
  status?: string;
  search?: string;
}

export interface ExamAttemptListResponse {
  attempts: ExamAttempt[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
