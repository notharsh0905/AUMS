import { api } from '@/services/api';
import {
  RawExamAttempt,
  ExamAttempt,
  ExamAttemptFilters,
  ExamAttemptListResponse,
} from '../types';

interface SimpleExam {
  exam_id: string;
  exam_name?: string;
  exam_type?: string;
  exam_date?: string;
  course_code?: string;
  course_name?: string;
  total_marks?: number | { Float64: number; Valid: boolean };
  passing_marks?: number | { Float64: number; Valid: boolean };
}

interface SimpleRegistration {
  exam_registration_id: string;
  exam_id: string;
  enrollment_id: string;
  registration_status: string;
}

interface SimpleEnrollment {
  enrollment_id: string;
  student_profile_id: string;
  enrollment_number: string;
}

interface SimpleStudent {
  student_profile_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface SimpleFaculty {
  faculty_profile_id: string;
  first_name: string;
  last_name: string;
}

const parseRemarksField = (remarksStr: string = '') => {
  const match = remarksStr.match(/^\[Internal:\s*([\d.]+),\s*External:\s*([\d.]+)\]\s*(.*)$/);
  if (match) {
    return {
      internalMarks: Number(match[1]),
      externalMarks: Number(match[2]),
      remarks: match[3],
    };
  }
  return {
    internalMarks: undefined,
    externalMarks: undefined,
    remarks: remarksStr,
  };
};

export const formatRemarksField = (internal: number, external: number, remarks: string) => {
  return `[Internal: ${internal}, External: ${external}] ${remarks}`.trim();
};

const mapAttempt = (
  raw: RawExamAttempt,
  registrations: SimpleRegistration[],
  exams: SimpleExam[],
  enrollments: SimpleEnrollment[],
  students: SimpleStudent[],
  faculty: SimpleFaculty[]
): ExamAttempt => {
  const registration = registrations.find((r) => r.exam_registration_id === raw.exam_registration_id);
  const exam = registration ? exams.find((e) => e.exam_id === registration.exam_id) : null;
  const enrollment = registration ? enrollments.find((en) => en.enrollment_id === registration.enrollment_id) : null;
  const student = enrollment ? students.find((s) => s.student_profile_id === enrollment.student_profile_id) : null;
  const evalObj = faculty.find((f) => f.faculty_profile_id === raw.evaluator_id);

  const max = exam ? (typeof exam.total_marks === 'object' && exam.total_marks !== null ? exam.total_marks.Float64 : Number(exam.total_marks || 100)) : 100;
  const passThreshold = exam ? (typeof exam.passing_marks === 'object' && exam.passing_marks !== null ? exam.passing_marks.Float64 : Number(exam.passing_marks || 40)) : 40;

  const isPass = raw.marks_obtained >= passThreshold;
  const { internalMarks, externalMarks, remarks } = parseRemarksField(raw.remarks);

  const studentFirst = student?.first_name || '';
  const studentLast = student?.last_name || '';

  const evalFirst = evalObj?.first_name || '';
  const evalLast = evalObj?.last_name || '';

  return {
    examAttemptId: raw.exam_attempt_id,
    examRegistrationId: raw.exam_registration_id,
    attemptNumber: raw.attempt_number,
    marksObtained: raw.marks_obtained,
    evaluatorId: raw.evaluator_id,
    evaluatedAt: raw.evaluated_at,
    remarks,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,

    studentName: studentFirst || studentLast ? `${studentFirst} ${studentLast}`.trim() : 'N/A',
    rollNumber: enrollment?.enrollment_number || 'N/A',
    studentEmail: student?.email || 'N/A',
    examName: exam?.exam_name || 'N/A',
    examType: exam?.exam_type || 'N/A',
    examDate: exam?.exam_date || 'N/A',
    courseCode: exam?.course_code || 'N/A',
    courseName: exam?.course_name || 'N/A',
    maxMarks: max,
    passingMarks: passThreshold,
    evaluatorName: evalFirst || evalLast ? `${evalFirst} ${evalLast}`.trim() : 'N/A',
    isPass,
    internalMarks,
    externalMarks,
  };
};

export const examAttemptService = {
  getExamAttempts: async (
    filters: ExamAttemptFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<ExamAttemptListResponse> => {
    // 1. Fetch raw attempts
    const res = await api.get<RawExamAttempt[]>('/exam-attempts', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
        exam_id: filters.examId || undefined,
        exam_registration_id: filters.registrationId || undefined,
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
    const [regsRes, examsRes, enrollmentsRes, studentsRes, facultyRes] = await Promise.all([
      api.get<SimpleRegistration[]>('/exam-registrations', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleExam[]>('/exams', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleEnrollment[]>('/student-enrollments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleStudent[]>('/students', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleFaculty[]>('/faculty', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    const registrations = regsRes.data || [];
    const exams = examsRes.data || [];
    const enrollments = enrollmentsRes.data || [];
    const students = studentsRes.data || [];
    const faculty = facultyRes.data || [];

    // 3. Map & Join lookups
    let attempts = list.map((item) =>
      mapAttempt(item, registrations, exams, enrollments, students, faculty)
    );

    // Client-side search filters fallback
    if (filters.search) {
      const sLower = filters.search.toLowerCase();
      attempts = attempts.filter(
        (a) =>
          a.studentName?.toLowerCase().includes(sLower) ||
          a.rollNumber?.toLowerCase().includes(sLower) ||
          a.examName?.toLowerCase().includes(sLower) ||
          a.courseCode?.toLowerCase().includes(sLower)
      );
    }

    return {
      attempts,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  getExamAttempt: async (id: string): Promise<ExamAttempt> => {
    const res = await api.get<RawExamAttempt>(`/exam-attempts/${id}`);
    const item = res.data;
    if (!item) {
      throw new Error('Attempt details not found');
    }

    // Load joins for this single attempt
    const [regsRes, examsRes, enrollmentsRes, studentsRes, facultyRes] = await Promise.all([
      api.get<SimpleRegistration[]>('/exam-registrations', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleExam[]>('/exams', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleEnrollment[]>('/student-enrollments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleStudent[]>('/students', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleFaculty[]>('/faculty', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    return mapAttempt(
      item,
      regsRes.data || [],
      examsRes.data || [],
      enrollmentsRes.data || [],
      studentsRes.data || [],
      facultyRes.data || []
    );
  },

  createExamAttempt: async (
    attempt: Omit<ExamAttempt, 'examAttemptId' | 'createdAt' | 'updatedAt'>
  ): Promise<ExamAttempt> => {
    const res = await api.post<RawExamAttempt>('/exam-attempts', {
      exam_registration_id: attempt.examRegistrationId,
      attempt_number: Number(attempt.attemptNumber),
      marks_obtained: Number(attempt.marksObtained),
      evaluator_id: attempt.evaluatorId,
      evaluated_at: new Date(attempt.evaluatedAt).toISOString(),
      remarks: attempt.remarks,
    });
    if (!res.data) {
      throw new Error('Failed to record attempt marks');
    }
    // Return dummy mapped, state will refetch anyway
    return {
      examAttemptId: res.data.exam_attempt_id,
      examRegistrationId: res.data.exam_registration_id,
      attemptNumber: res.data.attempt_number,
      marksObtained: res.data.marks_obtained,
      evaluatorId: res.data.evaluator_id,
      evaluatedAt: res.data.evaluated_at,
      remarks: res.data.remarks,
    };
  },

  updateExamAttempt: async (
    id: string,
    attempt: Partial<Omit<ExamAttempt, 'examAttemptId' | 'createdAt' | 'updatedAt'>>
  ): Promise<ExamAttempt> => {
    const res = await api.put<RawExamAttempt>(`/exam-attempts/${id}`, {
      marks_obtained: attempt.marksObtained !== undefined ? Number(attempt.marksObtained) : undefined,
      evaluator_id: attempt.evaluatorId,
      evaluated_at: attempt.evaluatedAt ? new Date(attempt.evaluatedAt).toISOString() : undefined,
      remarks: attempt.remarks,
    });
    if (!res.data) {
      throw new Error('Failed to update attempt marks');
    }
    return {
      examAttemptId: res.data.exam_attempt_id,
      examRegistrationId: res.data.exam_registration_id,
      attemptNumber: res.data.attempt_number,
      marksObtained: res.data.marks_obtained,
      evaluatorId: res.data.evaluator_id,
      evaluatedAt: res.data.evaluated_at,
      remarks: res.data.remarks,
    };
  },

  deleteExamAttempt: async (id: string): Promise<string> => {
    await api.delete(`/exam-attempts/${id}`);
    return id;
  },
};
