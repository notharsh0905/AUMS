import { api } from '@/services/api';
import {
  RawExamRegistration,
  ExamRegistration,
  ExamRegistrationFilters,
  ExamRegistrationListResponse,
} from '../types';

interface SimpleExam {
  exam_id: string;
  exam_name?: string;
  exam_type?: string;
  exam_date?: string;
  course_code?: string;
  course_name?: string;
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
  roll_number?: string;
}

export const examRegistrationService = {
  getExamRegistrations: async (
    filters: ExamRegistrationFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<ExamRegistrationListResponse> => {
    // 1. Fetch raw registrations
    const res = await api.get<RawExamRegistration[]>('/exam-registrations', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
        exam_id: filters.examId || undefined,
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
    const [examsRes, enrollmentsRes, studentsRes] = await Promise.all([
      api.get<SimpleExam[]>('/exams', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleEnrollment[]>('/student-enrollments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleStudent[]>('/students', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    const exams = examsRes.data || [];
    const enrollments = enrollmentsRes.data || [];
    const students = studentsRes.data || [];

    // 3. Join lookup values
    let registrations: ExamRegistration[] = list.map((item) => {
      const exam = exams.find((e) => e.exam_id === item.exam_id);
      const enrollment = enrollments.find((en) => en.enrollment_id === item.enrollment_id);
      const student = enrollment
        ? students.find((s) => s.student_profile_id === enrollment.student_profile_id)
        : null;

      const firstName = student?.first_name || '';
      const lastName = student?.last_name || '';

      return {
        examRegistrationId: item.exam_registration_id,
        examId: item.exam_id,
        enrollmentId: item.enrollment_id,
        registrationStatus: item.registration_status as 'REGISTERED' | 'ABSENT' | 'DISQUALIFIED',
        registeredAt: item.registered_at,
        createdAt: item.created_at,
        updatedAt: item.updated_at,

        studentName: firstName || lastName ? `${firstName} ${lastName}`.trim() : 'N/A',
        rollNumber: enrollment?.enrollment_number || student?.roll_number || 'N/A',
        studentEmail: student?.email || 'N/A',
        examName: exam?.exam_name || 'N/A',
        examType: exam?.exam_type || 'N/A',
        examDate: exam?.exam_date || 'N/A',
        courseCode: exam?.course_code || 'N/A',
        courseName: exam?.course_name || 'N/A',
      };
    });

    // Client-side search filters fallback (search by student name, roll number, or exam course code)
    if (filters.search) {
      const sLower = filters.search.toLowerCase();
      registrations = registrations.filter(
        (r) =>
          r.studentName?.toLowerCase().includes(sLower) ||
          r.rollNumber?.toLowerCase().includes(sLower) ||
          r.examName?.toLowerCase().includes(sLower) ||
          r.courseCode?.toLowerCase().includes(sLower)
      );
    }

    return {
      registrations,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  getExamRegistration: async (id: string): Promise<ExamRegistration> => {
    const res = await api.get<RawExamRegistration>(`/exam-registrations/${id}`);
    const item = res.data;
    if (!item) {
      throw new Error('Registration details not found');
    }

    // Load joins for this single item
    const [examRes, enrollmentRes, studentRes] = await Promise.all([
      api.get<SimpleExam>(`/exams/${item.exam_id}`).catch(() => null),
      api.get<SimpleEnrollment[]>('/student-enrollments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleStudent[]>('/students', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    const exam = examRes?.data;
    const enrollments = enrollmentRes?.data || [];
    const students = studentRes?.data || [];
    const enrollment = enrollments.find((e) => e.enrollment_id === item.enrollment_id);
    const student = enrollment
      ? students.find((s) => s.student_profile_id === enrollment.student_profile_id)
      : null;

    const firstName = student?.first_name || '';
    const lastName = student?.last_name || '';

    return {
      examRegistrationId: item.exam_registration_id,
      examId: item.exam_id,
      enrollmentId: item.enrollment_id,
      registrationStatus: item.registration_status as 'REGISTERED' | 'ABSENT' | 'DISQUALIFIED',
      registeredAt: item.registered_at,
      createdAt: item.created_at,
      updatedAt: item.updated_at,

      studentName: firstName || lastName ? `${firstName} ${lastName}`.trim() : 'N/A',
      rollNumber: enrollment?.enrollment_number || student?.roll_number || 'N/A',
      studentEmail: student?.email || 'N/A',
      examName: exam?.exam_name || 'N/A',
      examType: exam?.exam_type || 'N/A',
      examDate: exam?.exam_date || 'N/A',
      courseCode: exam?.course_code || 'N/A',
      courseName: exam?.course_name || 'N/A',
    };
  },

  createExamRegistration: async (
    reg: Omit<ExamRegistration, 'examRegistrationId' | 'registeredAt'>
  ): Promise<ExamRegistration> => {
    const res = await api.post<RawExamRegistration>('/exam-registrations', {
      exam_id: reg.examId,
      enrollment_id: reg.enrollmentId,
      registration_status: reg.registrationStatus,
    });
    if (!res.data) {
      throw new Error('Failed to register student for exam');
    }
    return {
      examRegistrationId: res.data.exam_registration_id,
      examId: res.data.exam_id,
      enrollmentId: res.data.enrollment_id,
      registrationStatus: res.data.registration_status as 'REGISTERED' | 'ABSENT' | 'DISQUALIFIED',
      registeredAt: res.data.registered_at,
      createdAt: res.data.created_at,
      updatedAt: res.data.updated_at,
    };
  },

  updateExamRegistration: async (
    id: string,
    status: 'REGISTERED' | 'ABSENT' | 'DISQUALIFIED'
  ): Promise<ExamRegistration> => {
    const res = await api.put<RawExamRegistration>(`/exam-registrations/${id}`, {
      registration_status: status,
    });
    if (!res.data) {
      throw new Error('Failed to update registration status');
    }
    return {
      examRegistrationId: res.data.exam_registration_id,
      examId: res.data.exam_id,
      enrollmentId: res.data.enrollment_id,
      registrationStatus: res.data.registration_status as 'REGISTERED' | 'ABSENT' | 'DISQUALIFIED',
      registeredAt: res.data.registered_at,
      createdAt: res.data.created_at,
      updatedAt: res.data.updated_at,
    };
  },

  deleteExamRegistration: async (id: string): Promise<string> => {
    await api.delete(`/exam-registrations/${id}`);
    return id;
  },
};
