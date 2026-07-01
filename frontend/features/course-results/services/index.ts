import { api } from '@/services/api';
import {
  RawCourseResult,
  CourseResult,
  CourseResultFilters,
  CourseResultListResponse,
} from '../types';

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

interface SimpleOffering {
  course_offering_id: string;
  course_id: string;
  semester_id: string;
  section: string;
}

interface SimpleCourse {
  course_id: string;
  course_code: string;
  course_name: string;
  credits: number;
}

interface SimpleSemester {
  semester_id: string;
  semester_name: string;
}

export const mapGradeAndScale = (percentage: number) => {
  if (percentage >= 90.0) {
    return {
      gradeCode: 'A+',
      gradePoint: 10.0,
      isPass: true,
      gradeScaleId: 'adf0aa55-aaff-4f84-9be4-f9d1f39f7f97',
    };
  }
  if (percentage >= 80.0) {
    return {
      gradeCode: 'A',
      gradePoint: 9.0,
      isPass: true,
      gradeScaleId: 'ed583aad-74b4-4a03-a2d7-a2074ffe12b4',
    };
  }
  if (percentage >= 70.0) {
    return {
      gradeCode: 'B+',
      gradePoint: 8.0,
      isPass: true,
      gradeScaleId: '2ccfb5a2-83b9-4bdb-b0ce-031216aa8d3b',
    };
  }
  if (percentage >= 60.0) {
    return {
      gradeCode: 'B',
      gradePoint: 7.0,
      isPass: true,
      gradeScaleId: '58dfc5e5-1730-496a-a60a-422249cfaeda',
    };
  }
  if (percentage >= 50.0) {
    return {
      gradeCode: 'C',
      gradePoint: 6.0,
      isPass: true,
      gradeScaleId: '6ebcc4ea-16f7-4cd4-be97-d723ea57b0af',
    };
  }
  if (percentage >= 40.0) {
    return {
      gradeCode: 'P',
      gradePoint: 5.0,
      isPass: true,
      gradeScaleId: '84429d26-430e-4101-bca0-b64054e8ac4b',
    };
  }
  return {
    gradeCode: 'F',
    gradePoint: 0.0,
    isPass: false,
    gradeScaleId: '6a059418-8305-48a9-8908-d58dbb6da180',
  };
};

const mapResult = (
  raw: RawCourseResult,
  enrollments: SimpleEnrollment[],
  students: SimpleStudent[],
  offerings: SimpleOffering[],
  courses: SimpleCourse[],
  semesters: SimpleSemester[]
): CourseResult => {
  const enrollment = enrollments.find((e) => e.enrollment_id === raw.enrollment_id);
  const student = enrollment
    ? students.find((s) => s.student_profile_id === enrollment.student_profile_id)
    : null;
  const offering = offerings.find((o) => o.course_offering_id === raw.course_offering_id);
  const course = offering ? courses.find((c) => c.course_id === offering.course_id) : null;
  const semester = offering ? semesters.find((sem) => sem.semester_id === offering.semester_id) : null;

  const first = student?.first_name || '';
  const last = student?.last_name || '';

  const { gradeCode, gradePoint, isPass } = mapGradeAndScale(raw.percentage);

  const internalMarks = Math.round(raw.marks_obtained * 0.3 * 100) / 100;
  const externalMarks = Math.round((raw.marks_obtained - internalMarks) * 100) / 100;

  return {
    courseResultId: raw.course_result_id,
    enrollmentId: raw.enrollment_id,
    courseOfferingId: raw.course_offering_id,
    totalMarks: raw.total_marks,
    marksObtained: raw.marks_obtained,
    percentage: raw.percentage,
    gradeScaleId: raw.grade_scale_id,
    resultStatus: raw.result_status,
    publishedAt: raw.published_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,

    studentName: first || last ? `${first} ${last}`.trim() : 'N/A',
    rollNumber: enrollment?.enrollment_number || 'N/A',
    studentEmail: student?.email || 'N/A',
    courseCode: course?.course_code || 'N/A',
    courseName: course?.course_name || 'N/A',
    credits: course?.credits || 0,
    semesterName: semester?.semester_name || 'N/A',
    semesterId: offering?.semester_id,

    gradeCode,
    gradePoint,
    isPass,
    internalMarks,
    externalMarks,
  };
};

export const courseResultService = {
  getCourseResults: async (
    filters: CourseResultFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<CourseResultListResponse> => {
    // 1. Fetch raw course results
    const res = await api.get<RawCourseResult[]>('/course-results', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
        enrollment_id: filters.enrollmentId || undefined,
        course_offering_id: filters.courseOfferingId || undefined,
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
    const [enrollmentsRes, studentsRes, offeringsRes, coursesRes, semestersRes] = await Promise.all([
      api.get<SimpleEnrollment[]>('/student-enrollments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleStudent[]>('/students', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleOffering[]>('/course-offerings', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleCourse[]>('/courses', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleSemester[]>('/semesters', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    const enrollments = enrollmentsRes.data || [];
    const students = studentsRes.data || [];
    const offerings = offeringsRes.data || [];
    const courses = coursesRes.data || [];
    const semesters = semestersRes.data || [];

    // 3. Map & Join lookups
    let results = list.map((item) =>
      mapResult(item, enrollments, students, offerings, courses, semesters)
    );

    // Client-side search filters fallback
    if (filters.search) {
      const sLower = filters.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.studentName?.toLowerCase().includes(sLower) ||
          r.rollNumber?.toLowerCase().includes(sLower) ||
          r.courseCode?.toLowerCase().includes(sLower) ||
          r.courseName?.toLowerCase().includes(sLower)
      );
    }

    if (filters.semesterId) {
      results = results.filter((r) => r.semesterId === filters.semesterId);
    }

    return {
      results,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      pageIndex,
      pageSize,
    };
  },

  getCourseResult: async (id: string): Promise<CourseResult> => {
    const res = await api.get<RawCourseResult>(`/course-results/${id}`);
    const item = res.data;
    if (!item) {
      throw new Error('Course result details not found');
    }

    // Load joins for this single result
    const [enrollmentsRes, studentsRes, offeringsRes, coursesRes, semestersRes] = await Promise.all([
      api.get<SimpleEnrollment[]>('/student-enrollments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleStudent[]>('/students', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleOffering[]>('/course-offerings', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleCourse[]>('/courses', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<SimpleSemester[]>('/semesters', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    return mapResult(
      item,
      enrollmentsRes.data || [],
      studentsRes.data || [],
      offeringsRes.data || [],
      coursesRes.data || [],
      semestersRes.data || []
    );
  },

  createCourseResult: async (
    res: Omit<CourseResult, 'courseResultId' | 'createdAt' | 'updatedAt'>
  ): Promise<CourseResult> => {
    const apiRes = await api.post<RawCourseResult>('/course-results', {
      enrollment_id: res.enrollmentId,
      course_offering_id: res.courseOfferingId,
      total_marks: Number(res.totalMarks),
      marks_obtained: Number(res.marksObtained),
      percentage: Number(res.percentage),
      grade_scale_id: res.gradeScaleId,
      result_status: res.resultStatus,
      published_at: res.publishedAt ? new Date(res.publishedAt).toISOString() : undefined,
    });
    if (!apiRes.data) {
      throw new Error('Failed to create course result record');
    }
    return {
      courseResultId: apiRes.data.course_result_id,
      enrollmentId: apiRes.data.enrollment_id,
      courseOfferingId: apiRes.data.course_offering_id,
      totalMarks: apiRes.data.total_marks,
      marksObtained: apiRes.data.marks_obtained,
      percentage: apiRes.data.percentage,
      gradeScaleId: apiRes.data.grade_scale_id,
      resultStatus: apiRes.data.result_status,
      publishedAt: apiRes.data.published_at,
    };
  },

  updateCourseResult: async (
    id: string,
    res: Partial<Omit<CourseResult, 'courseResultId' | 'createdAt' | 'updatedAt'>>
  ): Promise<CourseResult> => {
    const apiRes = await api.put<RawCourseResult>(`/course-results/${id}`, {
      total_marks: res.totalMarks !== undefined ? Number(res.totalMarks) : undefined,
      marks_obtained: res.marksObtained !== undefined ? Number(res.marksObtained) : undefined,
      percentage: res.percentage !== undefined ? Number(res.percentage) : undefined,
      grade_scale_id: res.gradeScaleId,
      result_status: res.resultStatus,
      published_at: res.publishedAt ? new Date(res.publishedAt).toISOString() : undefined,
    });
    if (!apiRes.data) {
      throw new Error('Failed to update course result record');
    }
    return {
      courseResultId: apiRes.data.course_result_id,
      enrollmentId: apiRes.data.enrollment_id,
      courseOfferingId: apiRes.data.course_offering_id,
      totalMarks: apiRes.data.total_marks,
      marksObtained: apiRes.data.marks_obtained,
      percentage: apiRes.data.percentage,
      gradeScaleId: apiRes.data.grade_scale_id,
      resultStatus: apiRes.data.result_status,
      publishedAt: apiRes.data.published_at,
    };
  },

  deleteCourseResult: async (id: string): Promise<string> => {
    await api.delete(`/course-results/${id}`);
    return id;
  },
};
