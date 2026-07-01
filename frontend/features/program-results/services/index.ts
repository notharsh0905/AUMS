import { api } from '@/services/api';
import {
  RawProgramResult,
  ProgramResult,
  ProgramResultFilters,
  ProgramResultListResponse,
} from '../types';

interface SimpleEnrollment {
  enrollment_id: string;
  student_profile_id: string;
  program_id: string;
  academic_year_id: string;
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

interface SimpleAcademicYear {
  academic_year_id: string;
  academic_year_name: string;
}

const mapResult = (
  raw: RawProgramResult,
  enrollments: SimpleEnrollment[],
  students: SimpleStudent[],
  programs: SimpleProgram[],
  academicYears: SimpleAcademicYear[]
): ProgramResult => {
  const enrollment = enrollments.find((e) => e.enrollment_id === raw.enrollment_id);
  const student = enrollment
    ? students.find((s) => s.student_profile_id === enrollment.student_profile_id)
    : null;
  const program = enrollment ? programs.find((p) => p.program_id === enrollment.program_id) : null;
  const batchYear = enrollment ? academicYears.find((ay) => ay.academic_year_id === enrollment.academic_year_id) : null;

  const first = student?.first_name || '';
  const last = student?.last_name || '';

  return {
    programResultId: raw.program_result_id,
    enrollmentId: raw.enrollment_id,
    cgpa: Number(raw.cgpa),
    totalCredits: Number(raw.total_credits),
    earnedCredits: Number(raw.earned_credits),
    creditsRemaining: Number(raw.credits_remaining !== undefined ? raw.credits_remaining : (raw.total_credits - raw.earned_credits)),
    overallPercentage: Number(raw.overall_percentage !== undefined ? raw.overall_percentage : (raw.cgpa * 9.5)), // standard conversion fallback
    degreeClassification: raw.degree_classification || (raw.cgpa >= 8.5 ? 'First Class with Distinction' : raw.cgpa >= 6.5 ? 'First Class' : raw.cgpa >= 5.0 ? 'Second Class' : 'Pass Class'),
    graduationEligibility: raw.graduation_eligibility || (raw.earned_credits >= raw.total_credits ? 'ELIGIBLE' : 'INELIGIBLE'),
    academicStanding: raw.academic_standing || (raw.cgpa >= 5.0 ? 'GOOD_STANDING' : 'PROBATION'),
    degreeCompleted: raw.degree_completed,
    completionDate: raw.completion_date,
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
    batch: batchYear?.academic_year_name || 'N/A',
  };
};

export const programResultService = {
  getProgramResults: async (
    filters: ProgramResultFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<ProgramResultListResponse> => {
    // 1. Fetch raw program results
    const res = await api.get<RawProgramResult[]>('/program-results', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
        enrollment_id: filters.enrollmentId || undefined,
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
    const [enrollmentsRes, studentsRes, programsRes, academicYearsRes] = await Promise.all([
      api.get<SimpleEnrollment[]>('/student-enrollments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleStudent[]>('/students', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleProgram[]>('/programs', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleAcademicYear[]>('/academic-years', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    const enrollments = enrollmentsRes.data || [];
    const students = studentsRes.data || [];
    const programs = programsRes.data || [];
    const academicYears = academicYearsRes.data || [];

    // 3. Map & Join lookups
    let results = list.map((item) =>
      mapResult(item, enrollments, students, programs, academicYears)
    );

    // Client-side search filters fallback
    if (filters.search) {
      const sLower = filters.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.studentName?.toLowerCase().includes(sLower) ||
          r.rollNumber?.toLowerCase().includes(sLower) ||
          r.programName?.toLowerCase().includes(sLower) ||
          r.batch?.toLowerCase().includes(sLower)
      );
    }

    // Client-side program filtering
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

  getProgramResult: async (id: string): Promise<ProgramResult> => {
    const res = await api.get<RawProgramResult>(`/program-results/${id}`);
    const item = res.data;
    if (!item) {
      throw new Error('Program result details not found');
    }

    // Load joins for this single result
    const [enrollmentsRes, studentsRes, programsRes, academicYearsRes] = await Promise.all([
      api.get<SimpleEnrollment[]>('/student-enrollments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleStudent[]>('/students', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleProgram[]>('/programs', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleAcademicYear[]>('/academic-years', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    return mapResult(
      item,
      enrollmentsRes.data || [],
      studentsRes.data || [],
      programsRes.data || [],
      academicYearsRes.data || []
    );
  },

  createProgramResult: async (
    res: Omit<ProgramResult, 'programResultId' | 'createdAt' | 'updatedAt' | 'creditsRemaining' | 'overallPercentage' | 'degreeClassification' | 'graduationEligibility' | 'academicStanding'>
  ): Promise<ProgramResult> => {
    const apiRes = await api.post<RawProgramResult>('/program-results', {
      enrollment_id: res.enrollmentId,
      cgpa: Number(res.cgpa),
      total_credits: Number(res.totalCredits),
      earned_credits: Number(res.earnedCredits),
      degree_completed: res.degreeCompleted,
      completion_date: res.completionDate ? new Date(res.completionDate).toISOString().split('T')[0] : undefined,
      result_status: res.resultStatus,
      published_at: res.resultStatus === 'PUBLISHED' ? new Date().toISOString() : undefined,
    });
    if (!apiRes.data) {
      throw new Error('Failed to create program result record');
    }
    return {
      programResultId: apiRes.data.program_result_id,
      enrollmentId: apiRes.data.enrollment_id,
      cgpa: apiRes.data.cgpa,
      totalCredits: apiRes.data.total_credits,
      earnedCredits: apiRes.data.earned_credits,
      creditsRemaining: apiRes.data.credits_remaining,
      overallPercentage: apiRes.data.overall_percentage,
      degreeClassification: apiRes.data.degree_classification,
      graduationEligibility: apiRes.data.graduation_eligibility,
      academicStanding: apiRes.data.academic_standing,
      degreeCompleted: apiRes.data.degree_completed,
      completionDate: apiRes.data.completion_date,
      resultStatus: apiRes.data.result_status,
      publishedAt: apiRes.data.published_at,
    };
  },

  updateProgramResult: async (
    id: string,
    res: Partial<Omit<ProgramResult, 'programResultId' | 'createdAt' | 'updatedAt' | 'creditsRemaining' | 'overallPercentage' | 'degreeClassification' | 'graduationEligibility' | 'academicStanding'>>
  ): Promise<ProgramResult> => {
    const apiRes = await api.put<RawProgramResult>(`/program-results/${id}`, {
      cgpa: res.cgpa !== undefined ? Number(res.cgpa) : undefined,
      total_credits: res.totalCredits !== undefined ? Number(res.totalCredits) : undefined,
      earned_credits: res.earnedCredits !== undefined ? Number(res.earnedCredits) : undefined,
      degree_completed: res.degreeCompleted,
      completion_date: res.completionDate ? new Date(res.completionDate).toISOString().split('T')[0] : undefined,
      result_status: res.resultStatus,
      published_at: res.publishedAt ? new Date(res.publishedAt).toISOString() : undefined,
    });
    if (!apiRes.data) {
      throw new Error('Failed to update program result record');
    }
    return {
      programResultId: apiRes.data.program_result_id,
      enrollmentId: apiRes.data.enrollment_id,
      cgpa: apiRes.data.cgpa,
      totalCredits: apiRes.data.total_credits,
      earnedCredits: apiRes.data.earned_credits,
      creditsRemaining: apiRes.data.credits_remaining,
      overallPercentage: apiRes.data.overall_percentage,
      degreeClassification: apiRes.data.degree_classification,
      graduationEligibility: apiRes.data.graduation_eligibility,
      academicStanding: apiRes.data.academic_standing,
      degreeCompleted: apiRes.data.degree_completed,
      completionDate: apiRes.data.completion_date,
      resultStatus: apiRes.data.result_status,
      publishedAt: apiRes.data.published_at,
    };
  },

  deleteProgramResult: async (id: string): Promise<string> => {
    await api.delete(`/program-results/${id}`);
    return id;
  },
};
