export interface RawExamRegistration {
  exam_registration_id: string;
  exam_id: string;
  enrollment_id: string;
  registration_status: string;
  registered_at: string;
  created_at: string;
  updated_at: string;
}

export interface ExamRegistration {
  examRegistrationId: string;
  examId: string;
  enrollmentId: string;
  registrationStatus: 'REGISTERED' | 'ABSENT' | 'DISQUALIFIED';
  registeredAt: string;
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
}

export interface ExamRegistrationFilters {
  examId?: string;
  enrollmentId?: string;
  status?: string;
  search?: string;
}

export interface ExamRegistrationListResponse {
  registrations: ExamRegistration[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
