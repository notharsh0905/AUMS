export interface StudentCourseRegistration {
  studentCourseRegistrationId: string;
  enrollmentId: string;
  studentId: string;         // resolved student_id/employee code format
  rollNumber: string;        // resolved roll number
  studentName: string;       // resolved name
  courseOfferingId: string;
  courseCode: string;        // resolved
  courseName: string;        // resolved
  facultyName: string;       // resolved from faculty allocations mapping
  program: string;           // resolved
  department: string;        // resolved
  academicYear: string;      // resolved
  semester: string;          // resolved
  registrationStatus: 'REGISTERED' | 'DROPPED' | 'COMPLETED' | 'FAILED';
  registeredAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegistrationFilters {
  status?: string;
  search?: string;
}

export interface RegistrationListResponse {
  registrations: StudentCourseRegistration[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
