package transcripts

type StudentDetails struct {
	StudentID        string `json:"student_id"`
	EnrollmentID     string `json:"enrollment_id"`
	EnrollmentNumber string `json:"enrollment_number"`
	EnrollmentDate   string `json:"enrollment_date"`
	GraduationDate   string `json:"graduation_date,omitempty"`
	AdmissionDate    string `json:"admission_date,omitempty"`
	FirstName        string `json:"first_name"`
	LastName         string `json:"last_name"`
	Email            string `json:"email"`
	Gender           string `json:"gender"`
	DateOfBirth      string `json:"date_of_birth"`
	Nationality      string `json:"nationality"`
	BloodGroup       string `json:"blood_group"`
}

type ProgramDetails struct {
	ProgramID      string `json:"program_id"`
	ProgramCode    string `json:"program_code"`
	ProgramName    string `json:"program_name"`
	DegreeType     string `json:"degree_type"`
	DepartmentName string `json:"department_name"`
}

type TranscriptSemester struct {
	SemesterResultID string  `json:"semester_result_id"`
	SemesterID       string  `json:"semester_id"`
	SemesterNumber   int32   `json:"semester_number"`
	SemesterName     string  `json:"semester_name"`
	TotalCredits     float64 `json:"total_credits"`
	EarnedCredits    float64 `json:"earned_credits"`
	Sgpa             float64 `json:"sgpa"`
	ResultStatus     string  `json:"result_status"`
	PublishedAt      string  `json:"published_at"`
}

type TranscriptCourse struct {
	CourseResultID   string  `json:"course_result_id"`
	CourseOfferingID string  `json:"course_offering_id"`
	CourseID         string  `json:"course_id"`
	CourseCode       string  `json:"course_code"`
	CourseName       string  `json:"course_name"`
	Credits          float64 `json:"credits"`
	SemesterID       string  `json:"semester_id"`
	SemesterNumber   int32   `json:"semester_number"`
	TotalMarks       float64 `json:"total_marks"`
	MarksObtained    float64 `json:"marks_obtained"`
	Percentage       float64 `json:"percentage"`
	GradeCode        string  `json:"grade_code"`
	GradePoint       float64 `json:"grade_point"`
	IsPassing        bool    `json:"is_passing"`
	ResultStatus     string  `json:"result_status"`
	PublishedAt      string  `json:"published_at"`
}

type TranscriptCGPASummary struct {
	Cgpa                  float64 `json:"cgpa"`
	TotalCredits          float64 `json:"total_credits"`
	EarnedCredits         float64 `json:"earned_credits"`
	CreditsRemaining      float64 `json:"credits_remaining"`
	OverallPercentage     float64 `json:"overall_percentage"`
	DegreeClassification  string  `json:"degree_classification"`
	GraduationEligibility string  `json:"graduation_eligibility"`
	AcademicStanding      string  `json:"academic_standing"`
	DegreeCompleted       bool    `json:"degree_completed"`
	CompletionDate        string  `json:"completion_date,omitempty"`
}

type TranscriptResponse struct {
	Student     StudentDetails        `json:"student"`
	Program     ProgramDetails        `json:"program"`
	Semesters   []TranscriptSemester  `json:"semesters"`
	Courses     []TranscriptCourse    `json:"courses"`
	CGPA        TranscriptCGPASummary `json:"cgpa"`
	GeneratedAt string                `json:"generated_at"`
}
