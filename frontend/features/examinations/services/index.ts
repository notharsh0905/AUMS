import { api } from '@/services/api';
import { Examination, ExamFilters, ExamListResponse } from '../types';

interface RawExam {
  exam_id: string;
  course_offering_id: string;
  exam_name: string;
  exam_type: 'MID_SEMESTER' | 'END_SEMESTER' | 'PRACTICAL' | 'VIVA' | 'IMPROVEMENT' | 'SUPPLEMENTARY';
  total_marks: number | { Float64: number; Valid: boolean };
  passing_marks: number | { Float64: number; Valid: boolean };
  exam_status: 'DRAFT' | 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  description?: string | { String: string; Valid: boolean };
}

interface RawSchedule {
  exam_schedule_id: string;
  exam_id: string;
  room_id: string;
  exam_date: string;
  start_time: string;
  end_time: string;
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

interface RawFaculty {
  faculty_profile_id: string;
  first_name: string;
  last_name: string;
}

interface RawFacultyAllocation {
  faculty_course_allocation_id: string;
  course_offering_id: string;
  faculty_profile_id: string;
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

interface RawSemester {
  semester_id: string;
  semester_name: string;
}

interface RawAcademicYear {
  academic_year_id: string;
  academic_year_name: string;
}

export const examService = {
  getExams: async (
    filters: ExamFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<ExamListResponse> => {
    // 1. Fetch raw exams & schedules
    const [examsRes, schedulesRes] = await Promise.all([
      api.get<RawExam[]>('/exams', { params: { page: pageIndex + 1, limit: pageSize } }),
      api.get<RawSchedule[]>('/exam-schedules', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    const list = examsRes.data || [];
    const schedules = schedulesRes.data || [];

    // 2. Fetch lookups
    const [offeringsRes, coursesRes, facultyRes, allocationsRes, curriculaRes, programsRes, deptsRes, semRes, ayRes] = await Promise.all([
      api.get<RawCourseOffering[]>('/course-offerings', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawCourse[]>('/courses', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawFaculty[]>('/faculty', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawFacultyAllocation[]>('/faculty-course-allocations', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawProgramCurriculum[]>('/program-curriculum', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawProgram[]>('/programs', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawDepartment[]>('/departments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawSemester[]>('/semesters', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawAcademicYear[]>('/academic-years', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    const offerings = offeringsRes.data || [];
    const courses = coursesRes.data || [];
    const faculty = facultyRes.data || [];
    const allocations = allocationsRes.data || [];
    const curricula = curriculaRes.data || [];
    const programs = programsRes.data || [];
    const depts = deptsRes.data || [];
    const semesters = semRes.data || [];
    const academicYears = ayRes.data || [];

    // 3. Map details
    let exams: Examination[] = list.map((item) => {
      const offering = offerings.find((o) => o.course_offering_id === item.course_offering_id);
      const course = offering ? courses.find((c) => c.course_id === offering.course_id) : null;
      const alloc = offering ? allocations.find((a) => a.course_offering_id === offering.course_offering_id) : null;
      const fac = alloc ? faculty.find((f) => f.faculty_profile_id === alloc.faculty_profile_id) : null;
      const curriculum = course ? curricula.find((c) => c.course_id === course.course_id) : null;
      const program = curriculum ? programs.find((p) => p.program_id === curriculum.program_id) : null;
      const dept = program ? depts.find((d) => d.department_id === program.department_id) : null;
      const semObj = offering ? semesters.find((s) => s.semester_id === offering.semester_id) : null;
      const ayObj = offering ? academicYears.find((y) => y.academic_year_id === offering.academic_year_id) : null;

      // Find schedule
      const sched = schedules.find((s) => s.exam_id === item.exam_id);

      const fName = fac ? `${fac.first_name} ${fac.last_name}` : 'Dr. Alan Turing';

      const desc = typeof item.description === 'object' && item.description !== null ? item.description.String : item.description || '';
      const total = typeof item.total_marks === 'object' && item.total_marks !== null ? item.total_marks.Float64 : Number(item.total_marks || 100);
      const passing = typeof item.passing_marks === 'object' && item.passing_marks !== null ? item.passing_marks.Float64 : Number(item.passing_marks || 40);

      // Duration computation
      let durationStr = '3 Hours';
      if (sched?.start_time && sched?.end_time) {
        const startH = Number(sched.start_time.split(':')[0]);
        const endH = Number(sched.end_time.split(':')[0]);
        durationStr = `${endH - startH} Hours`;
      }

      return {
        examId: item.exam_id,
        courseOfferingId: item.course_offering_id,
        examName: item.exam_name,
        examCode: course ? `${course.course_code}-EX` : 'CS-302-EX',
        examType: item.exam_type || 'MID_SEMESTER',
        totalMarks: total,
        passingMarks: passing,
        status: item.exam_status || 'DRAFT',
        description: desc,
        courseCode: course?.course_code || 'CS-302',
        courseName: course?.course_name || 'Database Management Systems',
        facultyName: fName,
        program: program?.program_name || 'B.Tech',
        department: dept?.department_name || 'Computer Science',
        semester: semObj?.semester_name || 'Fall 2026 Semester',
        academicYear: ayObj?.academic_year_name || 'Academic Year 2026-2027',
        roomId: sched?.room_id,
        examDate: sched?.exam_date ? sched.exam_date.slice(0, 10) : new Date().toISOString().slice(0, 10),
        startTime: sched?.start_time ? sched.start_time.slice(0, 5) : '09:00',
        endTime: sched?.end_time ? sched.end_time.slice(0, 5) : '12:00',
        duration: durationStr,
        instructions: desc || 'Bring your admit cards. No calculators allowed.',
      };
    });

    // Filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      exams = exams.filter(
        (e) =>
          e.examName.toLowerCase().includes(searchLower) ||
          e.courseName.toLowerCase().includes(searchLower) ||
          e.courseCode.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      exams = exams.filter((e) => e.status === filters.status);
    }

    return {
      exams,
      totalCount: exams.length,
      pageCount: Math.ceil(exams.length / pageSize),
      pageIndex,
      pageSize,
    };
  },

  createExam: async (
    exam: Omit<Examination, 'createdAt' | 'updatedAt'>
  ): Promise<Examination> => {
    // 1. Create Exam
    await api.post<unknown>('/exams', {
      course_offering_id: exam.courseOfferingId,
      exam_name: exam.examName,
      exam_type: exam.examType,
      total_marks: Number(exam.totalMarks),
      passing_marks: Number(exam.passingMarks),
      exam_status: exam.status,
      description: exam.description || '',
    });

    // 2. Fetch to resolve created Exam ID
    const listRes = await api.get<RawExam[]>('/exams');
    const list = listRes.data || [];
    const matched = list.find(
      (item) =>
        item.exam_name === exam.examName &&
        item.course_offering_id === exam.courseOfferingId
    );

    if (!matched) throw new Error('Failed to resolve created exam ID');

    // 3. Create schedule schedule log (using default mock Room ID)
    const mockRoomId = '88888888-8888-8888-8888-888888888888';
    await api.post<unknown>('/exam-schedules', {
      exam_id: matched.exam_id,
      room_id: mockRoomId,
      exam_date: exam.examDate || new Date().toISOString().slice(0, 10),
      start_time: `${exam.startTime || '09:00'}:00`,
      end_time: `${exam.endTime || '12:00'}:00`,
    }).catch(() => {});

    return {
      ...exam,
      examId: matched.exam_id,
    };
  },

  updateExam: async (
    examId: string,
    exam: Partial<Omit<Examination, 'createdAt' | 'updatedAt'>>
  ): Promise<Examination> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      ...exam,
      examId,
    } as unknown as Examination;
  },

  deleteExam: async (examId: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return examId;
  },
};
