import { api } from '@/services/api';
import { Course, CourseFilters, CourseListResponse } from '../types';

interface RawCourse {
  course_id: string;
  course_code: string;
  course_name: string;
  course_type: string;
  credits: string | number;
  contact_hours: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface RawProgramCurriculum {
  program_curriculum_id: string;
  program_id: string;
  course_id: string;
  semester_number: number;
  is_mandatory: boolean;
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

export const courseService = {
  getCourses: async (
    filters: CourseFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<CourseListResponse> => {
    // 1. Fetch raw courses
    const res = await api.get<RawCourse[]>('/courses', {
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

    // 2. Fetch parallel entities to resolve program curriculum joins
    const [curriculaRes, programsRes, deptsRes] = await Promise.all([
      api.get<RawProgramCurriculum[]>('/program-curriculum', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawProgram[]>('/programs', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawDepartment[]>('/departments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    const curricula = curriculaRes.data || [];
    const programsList = programsRes.data || [];
    const depts = deptsRes.data || [];

    // 3. Perform client-side DTO mapping and joins
    let courses: Course[] = list.map((item) => {
      // Find matching curriculum mapping
      const mapping = curricula.find((c) => c.course_id === item.course_id);
      const programItem = mapping ? programsList.find((p) => p.program_id === mapping.program_id) : null;
      const deptItem = programItem ? depts.find((d) => d.department_id === programItem.department_id) : null;

      // Extract credits string safely
      let creditsNum = 0;
      if (item.credits) {
        if (typeof item.credits === 'object') {
          creditsNum = Number((item.credits as unknown as Record<string, unknown>).String || (item.credits as unknown as Record<string, unknown>).Int || 0);
        } else {
          creditsNum = Number(item.credits);
        }
      }

      return {
        courseId: item.course_id,
        courseCode: item.course_code,
        courseName: item.course_name,
        credits: creditsNum,
        contactHours: item.contact_hours,
        description: item.description || '',
        courseType: item.course_type,
        department: deptItem?.department_name || 'Computer Science',
        program: programItem?.program_name || 'B.Tech',
        semester: mapping?.semester_number || 1,
        status: 'active',
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
      };
    });

    // Client-side search / filter fallbacks
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.courseName.toLowerCase().includes(searchLower) ||
          c.courseCode.toLowerCase().includes(searchLower)
      );
    }

    if (filters.department) {
      courses = courses.filter((c) => c.department === filters.department);
    }

    if (filters.program) {
      courses = courses.filter((c) => c.program === filters.program);
    }

    if (filters.semester) {
      courses = courses.filter((c) => String(c.semester) === filters.semester);
    }

    if (filters.courseType) {
      courses = courses.filter((c) => c.courseType === filters.courseType);
    }

    return {
      courses,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  createCourse: async (
    course: Omit<Course, 'createdAt' | 'updatedAt'>
  ): Promise<Course> => {
    // 1. Create Course profile
    await api.post<unknown>('/courses', {
      course_code: course.courseCode,
      course_name: course.courseName,
      course_type: course.courseType.toUpperCase(),
      credits: String(course.credits),
      contact_hours: Number(course.contactHours),
      description: course.description || '',
    });

    // 2. Fetch courses list to resolve newly created course_id
    const listRes = await api.get<RawCourse[]>('/courses');
    const list = listRes.data || [];
    const matched = list.find((c) => c.course_code === course.courseCode);

    if (!matched) throw new Error('Failed to resolve created course ID');
    const courseId = matched.course_id;

    // 3. Resolve program ID
    const programsRes = await api.get<RawProgram[]>('/programs').catch(() => ({ data: [] }));
    const programs = programsRes.data || [];
    let programItem = programs.find((p) => p.program_name === course.program);
    if (!programItem && programs.length > 0) {
      programItem = programs[0];
    }
    const programId = programItem?.program_id || '00000000-0000-0000-0000-000000000000';

    // 4. Create Program Curriculum entry mapping
    await api.post<unknown>('/program-curriculum', {
      program_id: programId,
      course_id: courseId,
      semester_number: Number(course.semester),
      is_mandatory: true,
    }).catch((err) => console.warn('Failed to register program curriculum mapping:', err));

    return {
      ...course,
      courseId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateCourse: async (
    courseId: string,
    course: Partial<Omit<Course, 'createdAt' | 'updatedAt'>>
  ): Promise<Course> => {
    // Simulated updates as backend routes are frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      ...course,
      courseId,
      updatedAt: new Date().toISOString(),
    } as unknown as Course;
  },

  deleteCourse: async (courseId: string): Promise<string> => {
    // Simulated deletion as backend routes are frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return courseId;
  },
};
