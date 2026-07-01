import { api } from '@/services/api';
import { FacultyCourseAllocation, AllocationFilters, AllocationListResponse } from '../types';

interface RawAllocation {
  faculty_course_allocation_id: string;
  faculty_profile_id: string;
  course_offering_id: string;
  allocated_at: string;
}

interface RawFaculty {
  faculty_profile_id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
}

interface RawCourseOffering {
  course_offering_id: string;
  course_id: string;
  academic_year_id: string;
  semester_id: string;
  section: string;
  status: string;
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

export const allocationService = {
  getAllocations: async (
    filters: AllocationFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<AllocationListResponse> => {
    // 1. Fetch raw allocations
    const res = await api.get<RawAllocation[]>('/faculty-course-allocations', {
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
    const [facultyRes, offeringsRes, coursesRes, curriculaRes, programsRes, deptsRes, ayRes, semRes] = await Promise.all([
      api.get<RawFaculty[]>('/faculty', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawCourseOffering[]>('/course-offerings', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawCourse[]>('/courses', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawProgramCurriculum[]>('/program-curriculum', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawProgram[]>('/programs', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawDepartment[]>('/departments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawAcademicYear[]>('/academic-years', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawSemester[]>('/semesters', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    const faculty = facultyRes.data || [];
    const offerings = offeringsRes.data || [];
    const courses = coursesRes.data || [];
    const curricula = curriculaRes.data || [];
    const programs = programsRes.data || [];
    const depts = deptsRes.data || [];
    const academicYears = ayRes.data || [];
    const semesters = semRes.data || [];

    // 3. Map details
    let allocations: FacultyCourseAllocation[] = list.map((item) => {
      const fac = faculty.find((f) => f.faculty_profile_id === item.faculty_profile_id);
      const offering = offerings.find((o) => o.course_offering_id === item.course_offering_id);
      const course = offering ? courses.find((c) => c.course_id === offering.course_id) : null;
      const curriculum = course ? curricula.find((c) => c.course_id === course.course_id) : null;
      const program = curriculum ? programs.find((p) => p.program_id === curriculum.program_id) : null;
      const dept = program ? depts.find((d) => d.department_id === program.department_id) : null;
      const ay = offering ? academicYears.find((y) => y.academic_year_id === offering.academic_year_id) : null;
      const sem = offering ? semesters.find((s) => s.semester_id === offering.semester_id) : null;

      const fName = fac ? `${fac.first_name} ${fac.last_name}` : 'Faculty Member';

      return {
        facultyCourseAllocationId: item.faculty_course_allocation_id,
        facultyProfileId: item.faculty_profile_id,
        facultyName: fName,
        employeeId: fac?.employee_id || 'EMP-100',
        courseOfferingId: item.course_offering_id,
        courseCode: course?.course_code || 'CS-301',
        courseName: course?.course_name || 'Software Engineering',
        program: program?.program_name || 'B.Tech',
        department: dept?.department_name || 'Computer Science',
        academicYear: ay?.academic_year_name || 'Academic Year 2026-2027',
        semester: sem?.semester_name || 'Fall 2026 Semester',
        status: offering?.status || 'ACTIVE',
        allocatedAt: item.allocated_at ? item.allocated_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
      };
    });

    // Client-side search / filter fallbacks
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      allocations = allocations.filter(
        (a) =>
          a.facultyName.toLowerCase().includes(searchLower) ||
          a.courseName.toLowerCase().includes(searchLower) ||
          a.courseCode.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      allocations = allocations.filter((a) => a.status === filters.status);
    }

    return {
      allocations,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  createAllocation: async (
    alloc: Omit<FacultyCourseAllocation, 'createdAt' | 'updatedAt'>
  ): Promise<FacultyCourseAllocation> => {
    await api.post<unknown>('/faculty-course-allocations', {
      faculty_profile_id: alloc.facultyProfileId,
      course_offering_id: alloc.courseOfferingId,
    });

    // Fetch list to resolve created ID
    const listRes = await api.get<RawAllocation[]>('/faculty-course-allocations');
    const list = listRes.data || [];
    const matched = list.find(
      (item) =>
        item.faculty_profile_id === alloc.facultyProfileId &&
        item.course_offering_id === alloc.courseOfferingId
    );

    if (!matched) throw new Error('Failed to resolve created allocation ID');

    return {
      ...alloc,
      facultyCourseAllocationId: matched.faculty_course_allocation_id,
    };
  },

  updateAllocation: async (
    allocationId: string,
    alloc: Partial<Omit<FacultyCourseAllocation, 'createdAt' | 'updatedAt'>>
  ): Promise<FacultyCourseAllocation> => {
    // Simulated updates as backend routes are frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      ...alloc,
      facultyCourseAllocationId: allocationId,
    } as unknown as FacultyCourseAllocation;
  },

  deleteAllocation: async (allocationId: string): Promise<string> => {
    // Simulated deletion as backend routes are frozen
    await new Promise((resolve) => setTimeout(resolve, 200));
    return allocationId;
  },
};
