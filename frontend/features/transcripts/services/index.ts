import { api } from '@/services/api';
import {
  RawTranscriptResponse,
  TranscriptResponse,
  RawTranscriptCGPASummary,
  TranscriptCGPASummary,
  RawTranscriptSemester,
  TranscriptSemester,
  RawTranscriptCourse,
  TranscriptCourse,
  RawStudentDetails,
  StudentDetails,
  RawProgramDetails,
  ProgramDetails,
} from '../types';

const mapStudent = (raw: RawStudentDetails): StudentDetails => ({
  studentId: raw.student_id,
  enrollmentId: raw.enrollment_id,
  enrollmentNumber: raw.enrollment_number,
  enrollmentDate: raw.enrollment_date,
  graduationDate: raw.graduation_date,
  admissionDate: raw.admission_date,
  firstName: raw.first_name,
  lastName: raw.last_name,
  email: raw.email,
  gender: raw.gender,
  dateOfBirth: raw.date_of_birth,
  nationality: raw.nationality,
  bloodGroup: raw.blood_group,
});

const mapProgram = (raw: RawProgramDetails): ProgramDetails => ({
  programId: raw.program_id,
  programCode: raw.program_code,
  programName: raw.program_name,
  degreeType: raw.degree_type,
  departmentName: raw.department_name,
});

const mapSemester = (raw: RawTranscriptSemester): TranscriptSemester => ({
  semesterResultId: raw.semester_result_id,
  semesterId: raw.semester_id,
  semesterNumber: raw.semester_number,
  semesterName: raw.semester_name,
  totalCredits: Number(raw.total_credits),
  earnedCredits: Number(raw.earned_credits),
  sgpa: Number(raw.sgpa),
  resultStatus: raw.result_status,
  publishedAt: raw.published_at,
});

const mapCourse = (raw: RawTranscriptCourse): TranscriptCourse => ({
  courseResultId: raw.course_result_id,
  courseOfferingId: raw.course_offering_id,
  courseId: raw.course_id,
  courseCode: raw.course_code,
  courseName: raw.course_name,
  credits: Number(raw.credits),
  semesterId: raw.semester_id,
  semesterNumber: raw.semester_number,
  totalMarks: Number(raw.total_marks),
  marksObtained: Number(raw.marks_obtained),
  percentage: Number(raw.percentage),
  gradeCode: raw.grade_code,
  gradePoint: Number(raw.grade_point),
  isPassing: raw.is_passing,
  resultStatus: raw.result_status,
  publishedAt: raw.published_at,
});

const mapCGPA = (raw: RawTranscriptCGPASummary): TranscriptCGPASummary => ({
  cgpa: Number(raw.cgpa),
  totalCredits: Number(raw.total_credits),
  earnedCredits: Number(raw.earned_credits),
  creditsRemaining: Number(raw.credits_remaining),
  overallPercentage: Number(raw.overall_percentage),
  degreeClassification: raw.degree_classification,
  graduationEligibility: raw.graduation_eligibility,
  academicStanding: raw.academic_standing,
  degreeCompleted: raw.degree_completed,
  completionDate: raw.completion_date,
});

export const transcriptService = {
  getTranscript: async (studentId: string): Promise<TranscriptResponse> => {
    const res = await api.get<RawTranscriptResponse>(`/transcripts/${studentId}`);
    if (!res.data) {
      throw new Error('No transcript data returned');
    }
    return {
      student: mapStudent(res.data.student),
      program: mapProgram(res.data.program),
      semesters: (res.data.semesters || []).map(mapSemester),
      courses: (res.data.courses || []).map(mapCourse),
      cgpa: mapCGPA(res.data.cgpa),
      generatedAt: res.data.generated_at,
    };
  },

  getTranscriptSummary: async (studentId: string): Promise<TranscriptCGPASummary> => {
    const res = await api.get<RawTranscriptCGPASummary>(`/transcripts/${studentId}/summary`);
    if (!res.data) {
      throw new Error('No summary data returned');
    }
    return mapCGPA(res.data);
  },

  getTranscriptSemesters: async (studentId: string): Promise<TranscriptSemester[]> => {
    const res = await api.get<RawTranscriptSemester[]>(`/transcripts/${studentId}/semesters`);
    return (res.data || []).map(mapSemester);
  },

  getTranscriptCourses: async (studentId: string): Promise<TranscriptCourse[]> => {
    const res = await api.get<RawTranscriptCourse[]>(`/transcripts/${studentId}/courses`);
    return (res.data || []).map(mapCourse);
  },
};
