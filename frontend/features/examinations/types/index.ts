export interface Examination {
  examId: string;
  courseOfferingId: string;
  examName: string;
  examCode: string;
  examType: 'MID_SEMESTER' | 'END_SEMESTER' | 'PRACTICAL' | 'VIVA' | 'IMPROVEMENT' | 'SUPPLEMENTARY';
  totalMarks: number;
  passingMarks: number;
  status: 'DRAFT' | 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  description?: string;

  // resolved fields
  courseCode: string;
  courseName: string;
  facultyName: string;
  program: string;
  department: string;
  semester: string;
  academicYear: string;

  // schedule fields
  roomId?: string;
  examDate?: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  duration?: string; // e.g. "3 Hours"
  instructions?: string;
}

export interface ExamFilters {
  status?: string;
  search?: string;
}

export interface ExamListResponse {
  exams: Examination[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
