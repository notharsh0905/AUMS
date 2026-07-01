export interface RawStudentDetails {
  student_id: string;
  enrollment_id: string;
  enrollment_number: string;
  enrollment_date: string;
  graduation_date?: string;
  admission_date?: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  nationality: string;
  blood_group: string;
}

export interface RawProgramDetails {
  program_id: string;
  program_code: string;
  program_name: string;
  degree_type: string;
  department_name: string;
}

export interface RawTranscriptSemester {
  semester_result_id: string;
  semester_id: string;
  semester_number: number;
  semester_name: string;
  total_credits: number;
  earned_credits: number;
  sgpa: number;
  result_status: string;
  published_at: string;
}

export interface RawTranscriptCourse {
  course_result_id: string;
  course_offering_id: string;
  course_id: string;
  course_code: string;
  course_name: string;
  credits: number;
  semester_id: string;
  semester_number: number;
  total_marks: number;
  marks_obtained: number;
  percentage: number;
  grade_code: string;
  grade_point: number;
  is_passing: boolean;
  result_status: string;
  published_at: string;
}

export interface RawTranscriptCGPASummary {
  cgpa: number;
  total_credits: number;
  earned_credits: number;
  credits_remaining: number;
  overall_percentage: number;
  degree_classification: string;
  graduation_eligibility: string;
  academic_standing: string;
  degree_completed: boolean;
  completion_date?: string;
}

export interface RawTranscriptResponse {
  student: RawStudentDetails;
  program: RawProgramDetails;
  semesters: RawTranscriptSemester[];
  courses: RawTranscriptCourse[];
  cgpa: RawTranscriptCGPASummary;
  generated_at: string;
}

// Clean CamelCase types for frontend components
export interface StudentDetails {
  studentId: string;
  enrollmentId: string;
  enrollmentNumber: string;
  enrollmentDate: string;
  graduationDate?: string;
  admissionDate?: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  bloodGroup: string;
}

export interface ProgramDetails {
  programId: string;
  programCode: string;
  programName: string;
  degreeType: string;
  departmentName: string;
}

export interface TranscriptSemester {
  semesterResultId: string;
  semesterId: string;
  semesterNumber: number;
  semesterName: string;
  totalCredits: number;
  earnedCredits: number;
  sgpa: number;
  resultStatus: string;
  publishedAt: string;
}

export interface TranscriptCourse {
  courseResultId: string;
  courseOfferingId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  semesterId: string;
  semesterNumber: number;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  gradeCode: string;
  gradePoint: number;
  isPassing: boolean;
  resultStatus: string;
  publishedAt: string;
}

export interface TranscriptCGPASummary {
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  creditsRemaining: number;
  overallPercentage: number;
  degreeClassification: string;
  graduationEligibility: string;
  academicStanding: string;
  degreeCompleted: boolean;
  completionDate?: string;
}

export interface TranscriptResponse {
  student: StudentDetails;
  program: ProgramDetails;
  semesters: TranscriptSemester[];
  courses: TranscriptCourse[];
  cgpa: TranscriptCGPASummary;
  generatedAt: string;
}
