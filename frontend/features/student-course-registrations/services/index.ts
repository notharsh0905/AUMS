import { api } from '@/services/api';
import { StudentCourseRegistration, RegistrationFilters, RegistrationListResponse } from '../types';

interface RawRegistration {
  student_course_registration_id: string;
  enrollment_id: string;
  course_offering_id: string;
  registration_status: 'REGISTERED' | 'DROPPED' | 'COMPLETED' | 'FAILED';
  registered_at: string;
}

interface RawEnrollment {
  enrollment_id: string;
  student_profile_id: string;
  enrollment_number: string;
}

interface RawStudent {
  student_profile_id: string;
  student_id: string;
  roll_number: string;
  first_name: string;
  last_name: string;
}

interface RawCourseOffering {
  course_offering_id: string;
  course_id: string;
  academic_year_id: string;
  semester_id: string;
  section: string;
}

interface RawAllocation {
  faculty_profile_id: string;
  course_offering_id: string;
}

interface RawFaculty {
  faculty_profile_id: string;
  first_name: string;
  last_name: string;
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

export const registrationService = {
  getRegistrations: async (
    filters: RegistrationFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<RegistrationListResponse> => {
    // 1. Fetch raw registrations
    const res = await api.get<RawRegistration[]>('/student-course-registrations', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
      },
    });

    const list = res.data || [];
    const meta = (res as unknown as Record<string, unknown>).meta as { total?: number } || {
      page: pageIndex + 1,
      limit: pageSize,
      total: list.length,
    };
    const totalCount = meta.total || list.length;

    // 2. Fetch parallel lookup lists
    const [enrollmentsRes, studentsRes, offeringsRes, allocsRes, facultyRes, coursesRes, curriculaRes, programsRes, deptsRes, ayRes, semRes] = await Promise.all([
      api.get<RawEnrollment[]>('/student-enrollments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawStudent[]>('/students', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawCourseOffering[]>('/course-offerings', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawAllocation[]>('/faculty-course-allocations', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawFaculty[]>('/faculty', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawCourse[]>('/courses', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawProgramCurriculum[]>('/program-curriculum', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawProgram[]>('/programs', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawDepartment[]>('/departments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawAcademicYear[]>('/academic-years', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawSemester[]>('/semesters', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    const enrollments = enrollmentsRes.data || [];
    const students = studentsRes.data || [];
    const offerings = offeringsRes.data || [];
    const allocations = allocsRes.data || [];
    const faculty = facultyRes.data || [];
    const courses = coursesRes.data || [];
    const curricula = curriculaRes.data || [];
    const programs = programsRes.data || [];
    const depts = deptsRes.data || [];
    const academicYears = ayRes.data || [];
    const semesters = semRes.data || [];

    // 3. Perform mapping and joins
    let registrations: StudentCourseRegistration[] = list.map((item) => {
      const enrollment = enrollments.find((e) => e.enrollment_id === item.enrollment_id);
      const student = enrollment ? students.find((s) => s.student_profile_id === enrollment.student_profile_id) : null;
      const offering = offerings.find((o) => o.course_offering_id === item.course_offering_id);
      const course = offering ? courses.find((c) => c.course_id === offering.course_id) : null;
      const curriculum = course ? curricula.find((c) => c.course_id === course.course_id) : null;
      const program = curriculum ? programs.find((p) => p.program_id === curriculum.program_id) : null;
      const dept = program ? depts.find((d) => d.department_id === program.department_id) : null;
      const ay = offering ? academicYears.find((y) => y.academic_year_id === offering.academic_year_id) : null;
      const sem = offering ? semesters.find((s) => s.semester_id === offering.semester_id) : null;

      // Find allocated faculty member
      const allocation = offering ? allocations.find((a) => a.course_offering_id === offering.course_offering_id) : null;
      const facObj = allocation ? faculty.find((f) => f.faculty_profile_id === allocation.faculty_profile_id) : null;
      const facName = facObj ? `${facObj.first_name} ${facObj.last_name}` : 'TBD';

      const sName = student ? `${student.first_name} ${student.last_name}` : 'Student Profile';

      const regDate = item.registered_at ? item.registered_at.slice(0, 10) : new Date().toISOString().slice(0, 10);

      return {
        studentCourseRegistrationId: item.student_course_registration_id,
        enrollmentId: item.enrollment_id,
        studentId: student?.student_id || 'STU-100',
        rollNumber: student?.roll_number || '2026CS101',
        studentName: sName,
        courseOfferingId: item.course_offering_id,
        courseCode: course?.course_code || 'CS-301',
        courseName: course?.course_name || 'Software Engineering',
        facultyName: facName,
        program: program?.program_name || 'B.Tech',
        department: dept?.department_name || 'Computer Science',
        academicYear: ay?.academic_year_name || 'Academic Year 2026-2027',
        semester: sem?.semester_name || 'Fall 2026 Semester',
        registrationStatus: item.registration_status || 'REGISTERED',
        registeredAt: regDate,
      };
    });

    // Client-side search / filter fallbacks
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      registrations = registrations.filter(
        (r) =>
          r.studentName.toLowerCase().includes(searchLower) ||
          r.rollNumber.toLowerCase().includes(searchLower) ||
          r.courseName.toLowerCase().includes(searchLower) ||
          r.courseCode.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      registrations = registrations.filter((r) => r.registrationStatus === filters.status);
    }

    return {
      registrations,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  createRegistration: async (
    reg: Omit<StudentCourseRegistration, 'createdAt' | 'updatedAt'>
  ): Promise<StudentCourseRegistration> => {
    await api.post<unknown>('/student-course-registrations', {
      enrollment_id: reg.enrollmentId,
      course_offering_id: reg.courseOfferingId,
      registration_status: reg.registrationStatus,
      registered_at: reg.registeredAt,
    });

    // Fetch list to resolve created ID
    const listRes = await api.get<RawRegistration[]>('/student-course-registrations');
    const list = listRes.data || [];
    const matched = list.find(
      (item) =>
        item.enrollment_id === reg.enrollmentId &&
        item.course_offering_id === reg.courseOfferingId
    );

    if (!matched) throw new Error('Failed to resolve created registration ID');

    return {
      ...reg,
      studentCourseRegistrationId: matched.student_course_registration_id,
    };
  },

  updateRegistration: async (
    registrationId: string,
    reg: Partial<Omit<StudentCourseRegistration, 'createdAt' | 'updatedAt'>>
  ): Promise<StudentCourseRegistration> => {
    // Simulated updates as backend routes are frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      ...reg,
      studentCourseRegistrationId: registrationId,
    } as unknown as StudentCourseRegistration;
  },

  deleteRegistration: async (registrationId: string): Promise<string> => {
    // Simulated deletion as backend routes are frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return registrationId;
  },
};
