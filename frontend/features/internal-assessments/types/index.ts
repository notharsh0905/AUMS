export interface InternalAssessment {
  assessmentId: string;
  enrollmentId: string;
  studentName: string;
  rollNumber: string;
  courseOfferingId: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  program: string;
  department: string;
  semester: string;
  academicYear: string;
  attendancePercentage: number; // computed
  attendanceMarks: number;      // computed (out of 5)
  assignmentMarks: number;      // computed (out of 10)
  quizMarks: number;            // input
  practicalMarks: number;       // input
  vivaMarks: number;            // input
  midSemesterMarks: number;     // input
  bonusMarks: number;           // input
  penalty: number;              // input
  totalInternalMarks: number;   // computed
  maxMarks: number;             // max points (e.g. 50)
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentFilters {
  status?: string;
  search?: string;
}

export interface AssessmentListResponse {
  assessments: InternalAssessment[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
