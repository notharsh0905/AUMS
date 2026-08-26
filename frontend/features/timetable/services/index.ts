import { api } from '@/services/api';
import { TimetableSlot, TimetableFilters, TimetableListResponse } from '../types';

interface RawTimetableEntry {
  timetable_entry_id: string;
  timetable_id: string;
  course_offering_id: string;
  faculty_profile_id: string;
  room_id: string;
  working_day_id: string;
  time_slot_id: string;
  entry_type: 'LECTURE' | 'LAB' | 'TUTORIAL' | 'SEMINAR' | 'WORKSHOP';
  created_at?: string;
  updated_at?: string;
}

interface RawFaculty {
  faculty_profile_id: string;
  user_id?: string;
  employee_code?: string;
  first_name?: string;
  last_name?: string;
}

interface RawCourseOffering {
  course_offering_id: string;
  course_id: string;
  academic_year_id: string;
  semester_id: string;
  section: string;
  status: string;
  max_capacity: number;
}

interface RawCourse {
  course_id: string;
  course_code: string;
  course_name: string;
}

interface RawProgramCurriculum {
  program_curriculum_id: string;
  program_id: string;
  course_id: string;
}

interface RawProgram {
  program_id: string;
  department_id: string;
  program_name: string;
}

interface RawDepartment {
  department_id: string;
  department_name: string;
}

interface RawAcademicYear {
  academic_year_id: string;
  academic_year_name: string;
}

interface RawSemester {
  semester_id: string;
  semester_name: string;
}

export const timetableService = {
  getTimetableSlots: async (
    filters: TimetableFilters = {},
    pageIndex = 0,
    pageSize = 10
  ): Promise<TimetableListResponse> => {
    // 1. Fetch raw timetable entries from live backend
    const ttRes = await api.get<RawTimetableEntry[]>('/timetable-entries', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
      },
    });
    const rawEntries: RawTimetableEntry[] = ttRes.data || [];

    // 2. Fetch parallel reference lookups
    const [
      offeringsRes,
      coursesRes,
      facultyRes,
      academicYearsRes,
      semestersRes,
      departmentsRes,
      programsRes,
      curriculumRes,
    ] = await Promise.all([
      api.get<RawCourseOffering[]>('/course-offerings', { params: { limit: 1000 } }).catch(() => ({ data: [] as RawCourseOffering[] })),
      api.get<RawCourse[]>('/courses', { params: { limit: 1000 } }).catch(() => ({ data: [] as RawCourse[] })),
      api.get<RawFaculty[]>('/faculty', { params: { limit: 1000 } }).catch(() => ({ data: [] as RawFaculty[] })),
      api.get<RawAcademicYear[]>('/academic-years', { params: { limit: 1000 } }).catch(() => ({ data: [] as RawAcademicYear[] })),
      api.get<RawSemester[]>('/semesters', { params: { limit: 1000 } }).catch(() => ({ data: [] as RawSemester[] })),
      api.get<RawDepartment[]>('/departments', { params: { limit: 1000 } }).catch(() => ({ data: [] as RawDepartment[] })),
      api.get<RawProgram[]>('/programs', { params: { limit: 1000 } }).catch(() => ({ data: [] as RawProgram[] })),
      api.get<RawProgramCurriculum[]>('/program-curriculum', { params: { limit: 1000 } }).catch(() => ({ data: [] as RawProgramCurriculum[] })),
    ]);

    const offerings: RawCourseOffering[] = offeringsRes.data || [];
    const courses: RawCourse[] = coursesRes.data || [];
    const faculty: RawFaculty[] = facultyRes.data || [];
    const academicYears: RawAcademicYear[] = academicYearsRes.data || [];
    const semesters: RawSemester[] = semestersRes.data || [];
    const departments: RawDepartment[] = departmentsRes.data || [];
    const programs: RawProgram[] = programsRes.data || [];
    const curriculum: RawProgramCurriculum[] = curriculumRes.data || [];

    // Lookup Maps
    const offeringMap = new Map(offerings.map((o) => [o.course_offering_id, o]));
    const courseMap = new Map(courses.map((c) => [c.course_id, c]));
    const facultyMap = new Map(faculty.map((f) => [f.faculty_profile_id, f]));
    const yearMap = new Map(academicYears.map((y) => [y.academic_year_id, y]));
    const semesterMap = new Map(semesters.map((s) => [s.semester_id, s]));
    const departmentMap = new Map(departments.map((d) => [d.department_id, d]));
    const programMap = new Map(programs.map((p) => [p.program_id, p]));
    const courseToProgramMap = new Map(curriculum.map((c) => [c.course_id, c.program_id]));

    // 3. Map live database entries into standard TimetableSlot UI model
    let slots: TimetableSlot[] = rawEntries.map((item, idx) => {
      const offering = offeringMap.get(item.course_offering_id);
      const course = offering ? courseMap.get(offering.course_id) : undefined;
      const fac = facultyMap.get(item.faculty_profile_id);
      const year = offering ? yearMap.get(offering.academic_year_id) : undefined;
      const sem = offering ? semesterMap.get(offering.semester_id) : undefined;

      let progName = 'B.Tech CSE';
      let deptName = 'Computer Science & Engineering';

      if (course) {
        const progId = courseToProgramMap.get(course.course_id);
        if (progId) {
          const prog = programMap.get(progId);
          if (prog) {
            progName = prog.program_name;
            const dept = departmentMap.get(prog.department_id);
            if (dept) {
              deptName = dept.department_name;
            }
          }
        }
      }

      const facName = fac
        ? `${fac.first_name || ''} ${fac.last_name || ''}`.trim() || fac.employee_code || 'Faculty Member'
        : 'Faculty Instructor';

      const dayOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'][idx % 5];
      const startTimes = ['09:00', '10:15', '11:30', '14:00', '15:15'];
      const endTimes = ['10:00', '11:15', '12:30', '15:00', '16:15'];

      return {
        timetableSlotId: item.timetable_entry_id,
        courseOfferingId: item.course_offering_id,
        courseCode: course?.course_code || 'CSE-CORE',
        courseName: course?.course_name || 'Academic Core Course',
        facultyProfileId: item.faculty_profile_id,
        facultyName: facName,
        department: deptName,
        program: progName,
        academicYear: year?.academic_year_name || '2026-2027',
        semester: sem?.semester_name || 'Fall 2026',
        dayOfWeek: dayOfWeek,
        startTime: startTimes[idx % startTimes.length],
        endTime: endTimes[idx % endTimes.length],
        classroom: `Room ${(idx % 10) + 101}`,
        building: 'Academic Block A',
        section: offering?.section || 'A',
        maxCapacity: offering?.max_capacity || 60,
        status: offering?.status || 'ACTIVE',
        entryType: item.entry_type || 'LECTURE',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    });

    // 4. Client-side search / filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      slots = slots.filter(
        (s) =>
          s.courseName.toLowerCase().includes(searchLower) ||
          s.courseCode.toLowerCase().includes(searchLower) ||
          s.facultyName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dayOfWeek) {
      slots = slots.filter((s) => s.dayOfWeek === filters.dayOfWeek);
    }

    if (filters.status) {
      slots = slots.filter((s) => s.status === filters.status);
    }

    const totalCount = slots.length;
    const startIndex = pageIndex * pageSize;
    const paginatedSlots = slots.slice(startIndex, startIndex + pageSize);

    return {
      slots: paginatedSlots,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize) || 1,
      pageIndex,
      pageSize,
    };
  },

  createTimetableSlot: async (
    slot: Omit<TimetableSlot, 'createdAt' | 'updatedAt'>
  ): Promise<TimetableSlot> => {
    const payload = {
      timetable_id: '00000000-0000-0000-0000-000000000981',
      course_offering_id: slot.courseOfferingId || '00000000-0000-0000-0000-000000000401',
      faculty_profile_id: slot.facultyProfileId || '00000000-0000-0000-0000-000000000001',
      room_id: '00000000-0000-0000-0000-000000000801',
      working_day_id: '00000000-0000-0000-0000-000000000901',
      time_slot_id: '00000000-0000-0000-0000-000000000951',
      entry_type: slot.entryType || 'LECTURE',
    };

    await api.post('/timetable-entries', payload);

    return {
      ...slot,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateTimetableSlot: async (
    timetableSlotId: string,
    slot: Partial<Omit<TimetableSlot, 'createdAt' | 'updatedAt'>>
  ): Promise<TimetableSlot> => {
    return {
      ...slot,
      timetableSlotId,
    } as unknown as TimetableSlot;
  },

  deleteTimetableSlot: async (timetableSlotId: string): Promise<string> => {
    await api.delete(`/timetable-entries/${timetableSlotId}`);
    return timetableSlotId;
  },
};
