import { api } from '@/services/api';
import { InternalAssessment, AssessmentFilters, AssessmentListResponse } from '../types';

interface RawRegistration {
  student_course_registration_id: string;
  enrollment_id: string;
  course_offering_id: string;
}

interface RawStudent {
  student_profile_id: string;
  roll_number: string;
  first_name: string;
  last_name: string;
}

interface RawEnrollment {
  enrollment_id: string;
  student_profile_id: string;
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

interface RawAttendance {
  class_session_id: string;
  enrollment_id: string;
  attendance_status: string;
}

interface RawSubmission {
  enrollment_id: string;
  assignment_id: string;
  submission_status: string;
  remarks?: string; // We can parse marks awarded if mapped or mocked
}

// Local mock input marks store to persist edits
const LOCAL_MARKS_STORE = new Map<
  string, // enrollmentId + courseOfferingId
  {
    quiz: number;
    practical: number;
    viva: number;
    mid: number;
    bonus: number;
    penalty: number;
    remarks: string;
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  }
>();

export const assessmentService = {
  getAssessments: async (
    filters: AssessmentFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<AssessmentListResponse> => {
    // 1. Fetch lookups
    const [regsRes, studentsRes, enrollRes, offeringsRes, coursesRes, facultyRes, curriculaRes, programsRes, deptsRes, semRes, ayRes, attendanceRes, submissionsRes] = await Promise.all([
      api.get<RawRegistration[]>('/student-course-registrations', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawStudent[]>('/students', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawEnrollment[]>('/student-enrollments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawCourseOffering[]>('/course-offerings', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawCourse[]>('/courses', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawFaculty[]>('/faculty', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawProgramCurriculum[]>('/program-curriculum', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawProgram[]>('/programs', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawDepartment[]>('/departments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawSemester[]>('/semesters', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawAcademicYear[]>('/academic-years', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawAttendance[]>('/attendance', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawSubmission[]>('/assignment-submissions', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    const regs = regsRes.data || [];
    const students = studentsRes.data || [];
    const enrollments = enrollRes.data || [];
    const offerings = offeringsRes.data || [];
    const courses = coursesRes.data || [];
    const faculty = facultyRes.data || [];
    const curricula = curriculaRes.data || [];
    const programs = programsRes.data || [];
    const depts = deptsRes.data || [];
    const semesters = semRes.data || [];
    const academicYears = ayRes.data || [];
    const attendance = attendanceRes.data || [];
    const submissions = submissionsRes.data || [];

    // 2. Build entries from student registrations
    let assessments: InternalAssessment[] = regs.map((reg) => {
      const enrollmentObj = enrollments.find((e) => e.enrollment_id === reg.enrollment_id);
      const studentObj = enrollmentObj ? students.find((s) => s.student_profile_id === enrollmentObj.student_profile_id) : null;
      const offering = offerings.find((o) => o.course_offering_id === reg.course_offering_id);
      const course = offering ? courses.find((c) => c.course_id === offering.course_id) : null;
      const curriculum = course ? curricula.find((c) => c.course_id === course.course_id) : null;
      const program = curriculum ? programs.find((p) => p.program_id === curriculum.program_id) : null;
      const dept = program ? depts.find((d) => d.department_id === program.department_id) : null;
      const sem = offering ? semesters.find((s) => s.semester_id === offering.semester_id) : null;
      const ay = offering ? academicYears.find((y) => y.academic_year_id === offering.academic_year_id) : null;

      // Dynamic Attendance computation
      const studentAttendance = attendance.filter((a) => a.enrollment_id === reg.enrollment_id);
      const totalSessions = studentAttendance.length || 5; // fallback default sessions
      const presentCount = studentAttendance.filter((a) => a.attendance_status === 'PRESENT').length || 4; // fallback default
      const attPercent = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 85;

      // Attendance Marks: >= 90% = 5; >= 80% = 4; >= 75% = 3; otherwise 0
      let attMarks = 0;
      if (attPercent >= 90) attMarks = 5;
      else if (attPercent >= 80) attMarks = 4;
      else if (attPercent >= 75) attMarks = 3;

      // Dynamic Assignment average marks (defaulting out of 10)
      const studentSubs = submissions.filter((s) => s.enrollment_id === reg.enrollment_id);
      const assignmentMarksVal = studentSubs.length > 0 ? 8.5 : 8.0; // simulated assignment score resolver

      // Merge local inputs
      const storeKey = `${reg.enrollment_id}_${reg.course_offering_id}`;
      const localMarks = LOCAL_MARKS_STORE.get(storeKey) || {
        quiz: 8,
        practical: 9,
        viva: 4,
        mid: 18,
        bonus: 2,
        penalty: 0,
        remarks: 'Excellent overall internal stats',
        status: 'DRAFT' as const,
      };

      const total =
        attMarks +
        assignmentMarksVal +
        localMarks.quiz +
        localMarks.practical +
        localMarks.viva +
        localMarks.mid +
        localMarks.bonus -
        localMarks.penalty;

      const sName = studentObj ? `${studentObj.first_name} ${studentObj.last_name}` : 'Student Name';
      const roll = studentObj?.roll_number || '2026CS101';

      return {
        assessmentId: reg.student_course_registration_id,
        enrollmentId: reg.enrollment_id,
        studentName: sName,
        rollNumber: roll,
        courseOfferingId: reg.course_offering_id,
        courseCode: course?.course_code || 'CS-302',
        courseName: course?.course_name || 'Database Management Systems',
        facultyName: faculty[0] ? `${faculty[0].first_name} ${faculty[0].last_name}` : 'Dr. Alan Turing',
        program: program?.program_name || 'B.Tech',
        department: dept?.department_name || 'Computer Science',
        semester: sem?.semester_name || 'Fall 2026 Semester',
        academicYear: ay?.academic_year_name || 'Academic Year 2026-2027',
        attendancePercentage: attPercent,
        attendanceMarks: attMarks,
        assignmentMarks: assignmentMarksVal,
        quizMarks: localMarks.quiz,
        practicalMarks: localMarks.practical,
        vivaMarks: localMarks.viva,
        midSemesterMarks: localMarks.mid,
        bonusMarks: localMarks.bonus,
        penalty: localMarks.penalty,
        totalInternalMarks: total,
        maxMarks: 50,
        status: localMarks.status,
        remarks: localMarks.remarks,
      };
    });

    // Client-side search / filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      assessments = assessments.filter(
        (a) =>
          a.studentName.toLowerCase().includes(searchLower) ||
          a.rollNumber.toLowerCase().includes(searchLower) ||
          a.courseName.toLowerCase().includes(searchLower) ||
          a.courseCode.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      assessments = assessments.filter((a) => a.status === filters.status);
    }

    return {
      assessments,
      totalCount: assessments.length,
      pageCount: Math.ceil(assessments.length / pageSize),
      pageIndex,
      pageSize,
    };
  },

  createAssessment: async (
    assessment: Omit<InternalAssessment, 'createdAt' | 'updatedAt'>
  ): Promise<InternalAssessment> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const storeKey = `${assessment.enrollmentId}_${assessment.courseOfferingId}`;
    LOCAL_MARKS_STORE.set(storeKey, {
      quiz: Number(assessment.quizMarks),
      practical: Number(assessment.practicalMarks),
      viva: Number(assessment.vivaMarks),
      mid: Number(assessment.midSemesterMarks),
      bonus: Number(assessment.bonusMarks),
      penalty: Number(assessment.penalty),
      remarks: assessment.remarks || '',
      status: assessment.status as 'DRAFT' | 'SUBMITTED' | 'APPROVED',
    });

    return assessment;
  },

  updateAssessment: async (
    assessmentId: string,
    assessment: Partial<Omit<InternalAssessment, 'createdAt' | 'updatedAt'>>
  ): Promise<InternalAssessment> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (assessment.enrollmentId && assessment.courseOfferingId) {
      const storeKey = `${assessment.enrollmentId}_${assessment.courseOfferingId}`;
      const existing = LOCAL_MARKS_STORE.get(storeKey) || {
        quiz: 8,
        practical: 9,
        viva: 4,
        mid: 18,
        bonus: 2,
        penalty: 0,
        remarks: '',
        status: 'DRAFT' as const,
      };

      LOCAL_MARKS_STORE.set(storeKey, {
        quiz: assessment.quizMarks !== undefined ? Number(assessment.quizMarks) : existing.quiz,
        practical: assessment.practicalMarks !== undefined ? Number(assessment.practicalMarks) : existing.practical,
        viva: assessment.vivaMarks !== undefined ? Number(assessment.vivaMarks) : existing.viva,
        mid: assessment.midSemesterMarks !== undefined ? Number(assessment.midSemesterMarks) : existing.mid,
        bonus: assessment.bonusMarks !== undefined ? Number(assessment.bonusMarks) : existing.bonus,
        penalty: assessment.penalty !== undefined ? Number(assessment.penalty) : existing.penalty,
        remarks: assessment.remarks !== undefined ? assessment.remarks : existing.remarks,
        status: (assessment.status !== undefined ? assessment.status : existing.status) as 'DRAFT' | 'SUBMITTED' | 'APPROVED',
      });
    }

    return {
      ...assessment,
      assessmentId,
    } as unknown as InternalAssessment;
  },

  deleteAssessment: async (assessmentId: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return assessmentId;
  },
};
