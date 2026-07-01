import { api } from '@/services/api';
import {
  RawSemesterResult,
  SemesterResult,
  SemesterResultFilters,
  SemesterResultListResponse,
} from '../types';

interface SimpleEnrollment {
  enrollment_id: string;
  student_profile_id: string;
  program_id: string;
  enrollment_number: string;
}

interface SimpleStudent {
  student_profile_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface SimpleProgram {
  program_id: string;
  program_code: string;
  program_name: string;
}

interface SimpleSemester {
  semester_id: string;
  semester_name: string;
}

interface SimpleCourseResult {
  enrollment_id: string;
  course_offering_id: string;
  percentage: number;
}

interface SimpleCourseOffering {
  course_offering_id: string;
  semester_id: string;
}

const getAcademicStanding = (sgpa: number): string => {
  if (sgpa >= 8.5) return 'Distinction';
  if (sgpa >= 6.5) return 'First Class';
  if (sgpa >= 5.0) return 'Second Class';
  if (sgpa >= 4.0) return 'Pass Class';
  return 'Probation';
};

const mapResult = (
  raw: RawSemesterResult,
  enrollments: SimpleEnrollment[],
  students: SimpleStudent[],
  programs: SimpleProgram[],
  semesters: SimpleSemester[],
  courseResults: SimpleCourseResult[],
  offerings: SimpleCourseOffering[]
): SemesterResult => {
  const enrollment = enrollments.find((e) => e.enrollment_id === raw.enrollment_id);
  const student = enrollment
    ? students.find((s) => s.student_profile_id === enrollment.student_profile_id)
    : null;
  const program = enrollment ? programs.find((p) => p.program_id === enrollment.program_id) : null;
  const semester = semesters.find((s) => s.semester_id === raw.semester_id);

  // Dynamic backlog count calculation: count how many failed courses this student had in this semester
  let backlogCount = 0;
  if (enrollment && raw.semester_id) {
    const studentCourseResults = courseResults.filter((cr) => cr.enrollment_id === raw.enrollment_id);
    const semesterCourseResults = studentCourseResults.filter((cr) => {
      const offering = offerings.find((o) => o.course_offering_id === cr.course_offering_id);
      return offering && offering.semester_id === raw.semester_id;
    });
    // A course result is considered a fail if percentage is below 40%
    backlogCount = semesterCourseResults.filter((cr) => cr.percentage < 40.0).length;
  }

  // Fallback calculation if no courses are resolved
  if (backlogCount === 0 && raw.earned_credits < raw.total_credits) {
    backlogCount = Math.max(1, Math.round((raw.total_credits - raw.earned_credits) / 3));
  }

  const standing = getAcademicStanding(raw.sgpa);
  const first = student?.first_name || '';
  const last = student?.last_name || '';

  return {
    semesterResultId: raw.semester_result_id,
    enrollmentId: raw.enrollment_id,
    semesterId: raw.semester_id,
    totalCredits: Number(raw.total_credits),
    earnedCredits: Number(raw.earned_credits),
    sgpa: Number(raw.sgpa),
    resultStatus: raw.result_status,
    publishedAt: raw.published_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,

    studentName: first || last ? `${first} ${last}`.trim() : 'N/A',
    rollNumber: enrollment?.enrollment_number || 'N/A',
    studentEmail: student?.email || 'N/A',
    programCode: program?.program_code || 'N/A',
    programName: program?.program_name || 'N/A',
    programId: enrollment?.program_id,
    semesterName: semester?.semester_name || 'N/A',

    backlogCount,
    academicStanding: standing,
  };
};

export const semesterResultService = {
  getSemesterResults: async (
    filters: SemesterResultFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<SemesterResultListResponse> => {
    // 1. Fetch raw semester results
    const res = await api.get<RawSemesterResult[]>('/semester-results', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
        enrollment_id: filters.enrollmentId || undefined,
        semester_id: filters.semesterId || undefined,
        status: filters.status || undefined,
      },
    });

    const list = res.data || [];
    const meta = (res as unknown as Record<string, unknown>).meta as { total?: number } || {
      page: pageIndex + 1,
      limit: pageSize,
      total: list.length,
    };
    const totalCount = meta.total || list.length;

    // 2. Fetch lookups in parallel
    const [enrollmentsRes, studentsRes, programsRes, semestersRes, courseResultsRes, offeringsRes] =
      await Promise.all([
        api.get<SimpleEnrollment[]>('/student-enrollments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
        api.get<SimpleStudent[]>('/students', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
        api.get<SimpleProgram[]>('/programs', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
        api.get<SimpleSemester[]>('/semesters', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
        api.get<SimpleCourseResult[]>('/course-results', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
        api.get<SimpleCourseOffering[]>('/course-offerings', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      ]);

    const enrollments = enrollmentsRes.data || [];
    const students = studentsRes.data || [];
    const programs = programsRes.data || [];
    const semesters = semestersRes.data || [];
    const courseResults = courseResultsRes.data || [];
    const offerings = offeringsRes.data || [];

    // 3. Map & Join lookups
    let results = list.map((item) =>
      mapResult(item, enrollments, students, programs, semesters, courseResults, offerings)
    );

    // Client-side search filters fallback
    if (filters.search) {
      const sLower = filters.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.studentName?.toLowerCase().includes(sLower) ||
          r.rollNumber?.toLowerCase().includes(sLower) ||
          r.programName?.toLowerCase().includes(sLower) ||
          r.semesterName?.toLowerCase().includes(sLower)
      );
    }

    if (filters.programId) {
      results = results.filter((r) => r.programId === filters.programId);
    }

    return {
      results,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  getSemesterResult: async (id: string): Promise<SemesterResult> => {
    const res = await api.get<RawSemesterResult>(`/semester-results/${id}`);
    const item = res.data;
    if (!item) {
      throw new Error('Semester result details not found');
    }

    // Load joins for this single result
    const [enrollmentsRes, studentsRes, programsRes, semestersRes, courseResultsRes, offeringsRes] =
      await Promise.all([
        api.get<SimpleEnrollment[]>('/student-enrollments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
        api.get<SimpleStudent[]>('/students', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
        api.get<SimpleProgram[]>('/programs', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
        api.get<SimpleSemester[]>('/semesters', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
        api.get<SimpleCourseResult[]>('/course-results', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
        api.get<SimpleCourseOffering[]>('/course-offerings', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      ]);

    return mapResult(
      item,
      enrollmentsRes.data || [],
      studentsRes.data || [],
      programsRes.data || [],
      semestersRes.data || [],
      courseResultsRes.data || [],
      offeringsRes.data || []
    );
  },

  createSemesterResult: async (
    res: Omit<SemesterResult, 'semesterResultId' | 'createdAt' | 'updatedAt'>
  ): Promise<SemesterResult> => {
    const apiRes = await api.post<RawSemesterResult>('/semester-results', {
      enrollment_id: res.enrollmentId,
      semester_id: res.semesterId,
      total_credits: Number(res.totalCredits),
      earned_credits: Number(res.earnedCredits),
      sgpa: Number(res.sgpa),
      result_status: res.resultStatus,
      published_at: res.publishedAt ? new Date(res.publishedAt).toISOString() : undefined,
    });
    if (!apiRes.data) {
      throw new Error('Failed to create semester result record');
    }
    return {
      semesterResultId: apiRes.data.semester_result_id,
      enrollmentId: apiRes.data.enrollment_id,
      semesterId: apiRes.data.semester_id,
      totalCredits: apiRes.data.total_credits,
      earnedCredits: apiRes.data.earned_credits,
      sgpa: apiRes.data.sgpa,
      resultStatus: apiRes.data.result_status,
      publishedAt: apiRes.data.published_at,
    };
  },

  updateSemesterResult: async (
    id: string,
    res: Partial<Omit<SemesterResult, 'semesterResultId' | 'createdAt' | 'updatedAt'>>
  ): Promise<SemesterResult> => {
    const apiRes = await api.put<RawSemesterResult>(`/semester-results/${id}`, {
      total_credits: res.totalCredits !== undefined ? Number(res.totalCredits) : undefined,
      earned_credits: res.earnedCredits !== undefined ? Number(res.earnedCredits) : undefined,
      sgpa: res.sgpa !== undefined ? Number(res.sgpa) : undefined,
      result_status: res.resultStatus,
      published_at: res.publishedAt ? new Date(res.publishedAt).toISOString() : undefined,
    });
    if (!apiRes.data) {
      throw new Error('Failed to update semester result record');
    }
    return {
      semesterResultId: apiRes.data.semester_result_id,
      enrollmentId: apiRes.data.enrollment_id,
      semesterId: apiRes.data.semester_id,
      totalCredits: apiRes.data.total_credits,
      earnedCredits: apiRes.data.earned_credits,
      sgpa: apiRes.data.sgpa,
      resultStatus: apiRes.data.result_status,
      publishedAt: apiRes.data.published_at,
    };
  },

  deleteSemesterResult: async (id: string): Promise<string> => {
    await api.delete(`/semester-results/${id}`);
    return id;
  },
};
