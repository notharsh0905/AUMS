export interface StudentAttendanceRow {
  enrollmentId: string;
  rollNumber: string;
  studentName: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

export interface AttendanceSession {
  attendanceSessionId: string; // matches classSessionId / attendance record group
  timetableEntryId: string;
  date: string;                // YYYY-MM-DD
  courseCode: string;
  courseName: string;
  facultyName: string;
  program: string;
  department: string;
  semester: string;
  section: string;
  totalStudents: number;
  present: number;
  absent: number;
  percentage: number;
  status: 'COMPLETED' | 'SCHEDULED' | 'CANCELLED';
  remarks?: string;
  students: StudentAttendanceRow[];
}

export interface AttendanceFilters {
  status?: string;
  search?: string;
}

export interface AttendanceListResponse {
  sessions: AttendanceSession[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
