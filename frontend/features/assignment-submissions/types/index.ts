export interface AssignmentSubmission {
  assignmentSubmissionId: string;
  assignmentId: string;
  assignmentTitle: string;   // resolved
  dueDate: string;           // resolved
  maximumMarks: number;      // resolved
  enrollmentId: string;
  studentName: string;       // resolved
  rollNumber: string;        // resolved
  facultyName: string;       // resolved
  program: string;           // resolved
  department: string;        // resolved
  academicYear: string;      // resolved
  semester: string;          // resolved
  submissionStatus: 'SUBMITTED' | 'GRADED' | 'LATE' | 'PENDING';
  submittedAt: string;       // YYYY-MM-DD
  marksAwarded?: number;     // graded marks
  feedback?: string;         // graded feedback
  attachmentName?: string;   // submitted attachment name
  isLate: boolean;           // late indicator
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubmissionFilters {
  status?: string;
  search?: string;
}

export interface SubmissionListResponse {
  submissions: AssignmentSubmission[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
