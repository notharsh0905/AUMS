import { api } from '@/services/api';
import { AssignmentSubmission, SubmissionFilters, SubmissionListResponse } from '../types';

interface RawSubmission {
  assignment_submission_id: string;
  assignment_id: string;
  enrollment_id: string;
  submission_status: 'SUBMITTED' | 'GRADED' | 'LATE' | 'PENDING';
  submitted_at: string;
  remarks?: string;
}

interface RawAssignment {
  assignment_id: string;
  course_offering_id: string;
  faculty_profile_id: string;
  title: string;
  total_marks: number | { Float64: number; Valid: boolean };
  due_at: string | { Time: string; Valid: boolean };
}

interface RawEnrollment {
  enrollment_id: string;
  student_profile_id: string;
  enrollment_number: string;
}

interface RawStudent {
  student_profile_id: string;
  first_name: string;
  last_name: string;
  roll_number: string;
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

const LOCAL_GRADING_MOCK_STORE = new Map<string, { marks: number; feedback: string }>();

const LOCAL_SUBMISSIONS_MOCK: AssignmentSubmission[] = [
  {
    assignmentSubmissionId: 'sub-mock-1',
    assignmentId: 'assign-mock-1',
    assignmentTitle: 'SQL Joins Homework',
    dueDate: '2026-07-15',
    maximumMarks: 100,
    enrollmentId: 'enroll-mock-1',
    studentName: 'Jane Doe',
    rollNumber: '2026CS101',
    facultyName: 'Dr. Alan Turing',
    program: 'B.Tech',
    department: 'Computer Science',
    semester: 'Fall 2026 Semester',
    academicYear: 'Academic Year 2026-2027',
    submissionStatus: 'SUBMITTED',
    submittedAt: '2026-07-14',
    attachmentName: 'sql_joins_janedoe.pdf',
    isLate: false,
    remarks: 'Solved all tasks',
  },
];

export const submissionService = {
  getSubmissions: async (
    filters: SubmissionFilters,
    pageIndex: number,
    pageSize: number
  ): Promise<SubmissionListResponse> => {
    // 1. Fetch raw submissions
    const res = await api.get<RawSubmission[]>('/assignment-submissions', {
      params: {
        page: pageIndex + 1,
        limit: pageSize,
      },
    });

    const list = res.data || [];


    // 2. Fetch parallel lookups
    const [assignmentsRes, enrollmentsRes, studentsRes, offeringsRes, coursesRes, facultyRes, curriculaRes, programsRes, deptsRes, semRes, ayRes] = await Promise.all([
      api.get<RawAssignment[]>('/assignments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawEnrollment[]>('/student-enrollments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawStudent[]>('/students', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawCourseOffering[]>('/course-offerings', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawCourse[]>('/courses', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawFaculty[]>('/faculty', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawProgramCurriculum[]>('/program-curriculum', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawProgram[]>('/programs', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawDepartment[]>('/departments', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawSemester[]>('/semesters', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
      api.get<RawAcademicYear[]>('/academic-years', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
    ]);

    const assignmentsList = assignmentsRes.data || [];
    const enrollments = enrollmentsRes.data || [];
    const students = studentsRes.data || [];
    const offerings = offeringsRes.data || [];
    const courses = coursesRes.data || [];
    const faculty = facultyRes.data || [];
    const curricula = curriculaRes.data || [];
    const programs = programsRes.data || [];
    const depts = deptsRes.data || [];
    const semesters = semRes.data || [];
    const academicYears = ayRes.data || [];

    // 3. Map details
    const dbSubmissions: AssignmentSubmission[] = list.map((item) => {
      const assignmentObj = assignmentsList.find((a) => a.assignment_id === item.assignment_id);
      const enrollmentObj = enrollments.find((e) => e.enrollment_id === item.enrollment_id);
      const studentObj = enrollmentObj ? students.find((s) => s.student_profile_id === enrollmentObj.student_profile_id) : null;
      const offering = assignmentObj ? offerings.find((o) => o.course_offering_id === assignmentObj.course_offering_id) : null;
      const course = offering ? courses.find((c) => c.course_id === offering.course_id) : null;
      const facObj = assignmentObj ? faculty.find((f) => f.faculty_profile_id === assignmentObj.faculty_profile_id) : null;
      const curriculum = course ? curricula.find((c) => c.course_id === course.course_id) : null;
      const program = curriculum ? programs.find((p) => p.program_id === curriculum.program_id) : null;
      const dept = program ? depts.find((d) => d.department_id === program.department_id) : null;
      const semObj = offering ? semesters.find((s) => s.semester_id === offering.semester_id) : null;
      const ayObj = offering ? academicYears.find((y) => y.academic_year_id === offering.academic_year_id) : null;

      const marksMax = assignmentObj
        ? typeof assignmentObj.total_marks === 'object' && assignmentObj.total_marks !== null
          ? assignmentObj.total_marks.Float64
          : Number(assignmentObj.total_marks || 100)
        : 100;

      const dueRaw = assignmentObj
        ? typeof assignmentObj.due_at === 'object' && assignmentObj.due_at !== null
          ? assignmentObj.due_at.Time
          : assignmentObj.due_at
        : '';
      const dueStr = dueRaw ? dueRaw.slice(0, 10) : '';

      const sName = studentObj ? `${studentObj.first_name} ${studentObj.last_name}` : 'Student Name';
      const roll = studentObj?.roll_number || '2026CS101';

      const fName = facObj ? `${facObj.first_name} ${facObj.last_name}` : 'Faculty Member';

      const submittedDate = item.submitted_at ? item.submitted_at.slice(0, 10) : '';

      const isLate = submittedDate && dueStr ? submittedDate > dueStr : false;

      // Merge local grading mock variables
      const localGrade = LOCAL_GRADING_MOCK_STORE.get(item.assignment_submission_id);

      return {
        assignmentSubmissionId: item.assignment_submission_id,
        assignmentId: item.assignment_id,
        assignmentTitle: assignmentObj?.title || 'Course Assignment',
        dueDate: dueStr,
        maximumMarks: marksMax,
        enrollmentId: item.enrollment_id,
        studentName: sName,
        rollNumber: roll,
        facultyName: fName,
        program: program?.program_name || 'B.Tech',
        department: dept?.department_name || 'Computer Science',
        semester: semObj?.semester_name || 'Fall 2026 Semester',
        academicYear: ayObj?.academic_year_name || 'Academic Year 2026-2027',
        submissionStatus: localGrade ? 'GRADED' : item.submission_status || 'SUBMITTED',
        submittedAt: submittedDate,
        marksAwarded: localGrade ? localGrade.marks : undefined,
        feedback: localGrade ? localGrade.feedback : undefined,
        attachmentName: 'assignment_file.pdf',
        isLate,
        remarks: item.remarks || '',
      };
    });

    let submissions = [...dbSubmissions, ...LOCAL_SUBMISSIONS_MOCK];

    // Filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      submissions = submissions.filter(
        (s) =>
          s.assignmentTitle.toLowerCase().includes(searchLower) ||
          s.studentName.toLowerCase().includes(searchLower) ||
          s.rollNumber.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      submissions = submissions.filter((s) => s.submissionStatus === filters.status);
    }

    return {
      submissions,
      totalCount: submissions.length,
      pageCount: Math.ceil(submissions.length / pageSize),
      pageIndex,
      pageSize,
    };
  },

  createSubmission: async (
    submission: Omit<AssignmentSubmission, 'createdAt' | 'updatedAt'>
  ): Promise<AssignmentSubmission> => {
    const formattedSubmit = new Date(submission.submittedAt).toISOString();

    await api.post<unknown>('/assignment-submissions', {
      assignment_id: submission.assignmentId,
      enrollment_id: submission.enrollmentId,
      submission_status: submission.submissionStatus,
      submitted_at: formattedSubmit,
      remarks: submission.remarks || '',
    });

    // Fetch list to resolve created ID
    const listRes = await api.get<RawSubmission[]>('/assignment-submissions');
    const list = listRes.data || [];
    const matched = list.find(
      (item) =>
        item.assignment_id === submission.assignmentId &&
        item.enrollment_id === submission.enrollmentId
    );

    if (!matched) throw new Error('Failed to resolve created submission ID');

    return {
      ...submission,
      assignmentSubmissionId: matched.assignment_submission_id,
    };
  },

  gradeSubmission: async (
    submissionId: string,
    marks: number,
    feedback: string
  ): Promise<void> => {
    // Simulated grading logic (no backend grade routes exist)
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Save locally
    LOCAL_GRADING_MOCK_STORE.set(submissionId, { marks, feedback });

    // Try to update mock store matching lists
    const matched = LOCAL_SUBMISSIONS_MOCK.find((s) => s.assignmentSubmissionId === submissionId);
    if (matched) {
      matched.marksAwarded = marks;
      matched.feedback = feedback;
      matched.submissionStatus = 'GRADED';
    }
  },

  deleteSubmission: async (submissionId: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = LOCAL_SUBMISSIONS_MOCK.findIndex((s) => s.assignmentSubmissionId === submissionId);
    if (index !== -1) {
      LOCAL_SUBMISSIONS_MOCK.splice(index, 1);
    }
    return submissionId;
  },
};
