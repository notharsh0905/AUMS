import { api } from '@/services/api';
import { Assignment, AssignmentFilters, AssignmentListResponse } from '../types';

interface RawAssignment {
  assignment_id: string;
  course_offering_id: string;
  faculty_profile_id: string;
  title: string;
  description?: { String: string; Valid: boolean } | string;
  total_marks: number | { Float64: number; Valid: boolean };
  publish_at: string | { Time: string; Valid: boolean };
  due_at: string | { Time: string; Valid: boolean };
  assignment_status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
}

interface RawFaculty {
  faculty_profile_id: string;
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

export const assignmentService = {
  getAssignments: async (
    filters: AssignmentFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<AssignmentListResponse> => {
    // 1. Fetch raw assignments
    const res = await api.get<RawAssignment[]>('/assignments', {
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

    // 2. Fetch lookups
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
    let assignments: Assignment[] = list.map((item) => {
      const offering = offerings.find((o) => o.course_offering_id === item.course_offering_id);
      const course = offering ? courses.find((c) => c.course_id === offering.course_id) : null;
      const fac = faculty.find((f) => f.faculty_profile_id === item.faculty_profile_id);
      const curriculum = course ? curricula.find((c) => c.course_id === course.course_id) : null;
      const program = curriculum ? programs.find((p) => p.program_id === curriculum.program_id) : null;
      const dept = program ? depts.find((d) => d.department_id === program.department_id) : null;
      const ay = offering ? academicYears.find((y) => y.academic_year_id === offering.academic_year_id) : null;
      const sem = offering ? semesters.find((s) => s.semester_id === offering.semester_id) : null;

      const desc = typeof item.description === 'object' && item.description !== null ? item.description.String : item.description || '';
      const marks = typeof item.total_marks === 'object' && item.total_marks !== null ? item.total_marks.Float64 : Number(item.total_marks || 100);

      const pubRaw = typeof item.publish_at === 'object' && item.publish_at !== null ? item.publish_at.Time : item.publish_at;
      const dueRaw = typeof item.due_at === 'object' && item.due_at !== null ? item.due_at.Time : item.due_at;

      const pubDate = pubRaw ? pubRaw.slice(0, 10) : new Date().toISOString().slice(0, 10);
      const dueDate = dueRaw ? dueRaw.slice(0, 10) : new Date().toISOString().slice(0, 10);

      const fName = fac ? `${fac.first_name} ${fac.last_name}` : 'Faculty Member';

      return {
        assignmentId: item.assignment_id,
        courseOfferingId: item.course_offering_id,
        courseCode: course?.course_code || 'CS-302',
        courseName: course?.course_name || 'Database Management Systems',
        facultyProfileId: item.faculty_profile_id,
        facultyName: fName,
        department: dept?.department_name || 'Computer Science',
        program: program?.program_name || 'B.Tech',
        academicYear: ay?.academic_year_name || 'Academic Year 2026-2027',
        semester: sem?.semester_name || 'Fall 2026 Semester',
        title: item.title,
        description: desc,
        publishAt: pubDate,
        dueAt: dueDate,
        totalMarks: marks,
        status: item.assignment_status || 'DRAFT',
      };
    });

    // Client-side search / filter fallbacks
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      assignments = assignments.filter(
        (a) =>
          a.title.toLowerCase().includes(searchLower) ||
          a.courseName.toLowerCase().includes(searchLower) ||
          a.courseCode.toLowerCase().includes(searchLower) ||
          a.facultyName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      assignments = assignments.filter((a) => a.status === filters.status);
    }

    return {
      assignments,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  createAssignment: async (
    assignment: Omit<Assignment, 'createdAt' | 'updatedAt'>
  ): Promise<Assignment> => {
    // Format dates to ISO timestamps
    const publishDate = new Date(assignment.publishAt).toISOString();
    const dueDate = new Date(assignment.dueAt).toISOString();

    await api.post<unknown>('/assignments', {
      course_offering_id: assignment.courseOfferingId,
      faculty_profile_id: assignment.facultyProfileId,
      title: assignment.title,
      description: assignment.description,
      total_marks: Number(assignment.totalMarks),
      publish_at: publishDate,
      due_at: dueDate,
      assignment_status: assignment.status,
    });

    // Fetch list to resolve created ID
    const listRes = await api.get<RawAssignment[]>('/assignments');
    const list = listRes.data || [];
    const matched = list.find(
      (item) =>
        item.title === assignment.title &&
        item.course_offering_id === assignment.courseOfferingId
    );

    if (!matched) throw new Error('Failed to resolve created assignment ID');

    return {
      ...assignment,
      assignmentId: matched.assignment_id,
    };
  },

  updateAssignment: async (
    assignmentId: string,
    assignment: Partial<Omit<Assignment, 'createdAt' | 'updatedAt'>>
  ): Promise<Assignment> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      ...assignment,
      assignmentId,
    } as unknown as Assignment;
  },

  deleteAssignment: async (assignmentId: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return assignmentId;
  },
};
