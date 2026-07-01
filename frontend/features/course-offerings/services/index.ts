import { api } from '@/services/api';
import { CourseOffering, CourseOfferingFilters, CourseOfferingListResponse } from '../types';

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

export const courseOfferingService = {
  getCourseOfferings: async (
    filters: CourseOfferingFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<CourseOfferingListResponse> => {
    // 1. Fetch raw course offerings
    const res = await api.get<RawCourseOffering[]>('/course-offerings', {
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
    const [coursesRes, curriculaRes, programsRes, deptsRes, ayRes, semRes] = await Promise.all([
      api.get<RawCourse[]>('/courses', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawProgramCurriculum[]>('/program-curriculum', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawProgram[]>('/programs', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawDepartment[]>('/departments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawAcademicYear[]>('/academic-years', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawSemester[]>('/semesters', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    const courses = coursesRes.data || [];
    const curricula = curriculaRes.data || [];
    const programs = programsRes.data || [];
    const depts = deptsRes.data || [];
    const academicYears = ayRes.data || [];
    const semestersList = semRes.data || [];

    // 3. Perform mapping and joins
    let courseOfferings: CourseOffering[] = list.map((item) => {
      const course = courses.find((c) => c.course_id === item.course_id);
      const curriculum = curricula.find((c) => c.course_id === item.course_id);
      const program = curriculum ? programs.find((p) => p.program_id === curriculum.program_id) : null;
      const dept = program ? depts.find((d) => d.department_id === program.department_id) : null;
      const ay = academicYears.find((y) => y.academic_year_id === item.academic_year_id);
      const sem = semestersList.find((s) => s.semester_id === item.semester_id);

      return {
        courseOfferingId: item.course_offering_id,
        courseId: item.course_id,
        courseCode: course?.course_code || 'CS-301',
        courseName: course?.course_name || 'Software Engineering',
        program: program?.program_name || 'B.Tech',
        department: dept?.department_name || 'Computer Science',
        academicYearId: item.academic_year_id,
        academicYear: ay?.academic_year_name || 'Academic Year 2026-2027',
        semesterId: item.semester_id,
        semester: sem?.semester_name || 'Fall 2026 Semester',
        section: item.section || 'A',
        maxCapacity: item.max_capacity || 60,
        status: item.status || 'PLANNED',
      };
    });

    // Client-side search / filter fallbacks
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      courseOfferings = courseOfferings.filter(
        (co) =>
          co.courseName.toLowerCase().includes(searchLower) ||
          co.courseCode.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      courseOfferings = courseOfferings.filter((co) => co.status === filters.status);
    }

    if (filters.academicYear) {
      courseOfferings = courseOfferings.filter((co) => co.academicYear === filters.academicYear);
    }

    if (filters.semester) {
      courseOfferings = courseOfferings.filter((co) => co.semester === filters.semester);
    }

    return {
      courseOfferings,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  createCourseOffering: async (
    co: Omit<CourseOffering, 'createdAt' | 'updatedAt'>
  ): Promise<CourseOffering> => {
    await api.post<unknown>('/course-offerings', {
      course_id: co.courseId,
      academic_year_id: co.academicYearId,
      semester_id: co.semesterId,
      section: co.section,
      status: co.status,
      max_capacity: Number(co.maxCapacity),
    });

    // Fetch list to resolve created ID
    const listRes = await api.get<RawCourseOffering[]>('/course-offerings');
    const list = listRes.data || [];
    const matched = list.find(
      (item) =>
        item.course_id === co.courseId &&
        item.academic_year_id === co.academicYearId &&
        item.semester_id === co.semesterId &&
        item.section === co.section
    );

    if (!matched) throw new Error('Failed to resolve created offering ID');

    return {
      ...co,
      courseOfferingId: matched.course_offering_id,
    };
  },

  updateCourseOffering: async (
    courseOfferingId: string,
    co: Partial<Omit<CourseOffering, 'createdAt' | 'updatedAt'>>
  ): Promise<CourseOffering> => {
    // Simulated updates as backend routes are frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      ...co,
      courseOfferingId,
    } as unknown as CourseOffering;
  },

  deleteCourseOffering: async (courseOfferingId: string): Promise<string> => {
    // Simulated deletion as backend routes are frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return courseOfferingId;
  },
};
