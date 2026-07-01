export interface TimetableSlot {
  timetableSlotId: string;
  courseOfferingId: string;
  courseCode: string;
  courseName: string;
  facultyProfileId: string;
  facultyName: string;
  department: string;
  program: string;
  academicYear: string;
  semester: string;
  dayOfWeek: string;       // MONDAY, TUESDAY, etc.
  startTime: string;       // HH:MM
  endTime: string;         // HH:MM
  classroom: string;       // Room 101, etc.
  building: string;        // Block A, etc.
  section: string;
  maxCapacity: number;
  status: string;          // ACTIVE, PLANNED, etc.
  entryType: 'LECTURE' | 'LAB' | 'TUTORIAL' | 'SEMINAR' | 'WORKSHOP';
  createdAt?: string;
  updatedAt?: string;
}

export interface TimetableFilters {
  dayOfWeek?: string;
  status?: string;
  search?: string;
}

export interface TimetableListResponse {
  slots: TimetableSlot[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
}
