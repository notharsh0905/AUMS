package programresults

type CreateProgramResultRequest struct {
	EnrollmentID    string  `json:"enrollment_id" validate:"required,uuid"`
	Cgpa            float64 `json:"cgpa"`
	TotalCredits    float64 `json:"total_credits"`
	EarnedCredits   float64 `json:"earned_credits"`
	DegreeCompleted bool    `json:"degree_completed"`
	CompletionDate  string  `json:"completion_date"` // YYYY-MM-DD
	ResultStatus    string  `json:"result_status" validate:"required"`
	PublishedAt     string  `json:"published_at"` // RFC3339 format
}

type UpdateProgramResultRequest struct {
	Cgpa            float64 `json:"cgpa"`
	TotalCredits    float64 `json:"total_credits"`
	EarnedCredits   float64 `json:"earned_credits"`
	DegreeCompleted bool    `json:"degree_completed"`
	CompletionDate  string  `json:"completion_date"` // YYYY-MM-DD
	ResultStatus    string  `json:"result_status" validate:"required"`
	PublishedAt     string  `json:"published_at"` // RFC3339 format
}

type ProgramResultResponse struct {
	ProgramResultID       string  `json:"program_result_id"`
	EnrollmentID          string  `json:"enrollment_id"`
	Cgpa                  float64 `json:"cgpa"`
	TotalCredits          float64 `json:"total_credits"`
	EarnedCredits         float64 `json:"earned_credits"`
	CreditsRemaining      float64 `json:"credits_remaining"`
	OverallPercentage     float64 `json:"overall_percentage"`
	DegreeClassification  string  `json:"degree_classification"`
	GraduationEligibility string  `json:"graduation_eligibility"`
	AcademicStanding      string  `json:"academic_standing"`
	DegreeCompleted       bool    `json:"degree_completed"`
	CompletionDate        string  `json:"completion_date"`
	ResultStatus          string  `json:"result_status"`
	PublishedAt           string  `json:"published_at"`
	CreatedAt             string  `json:"created_at"`
	UpdatedAt             string  `json:"updated_at"`
}
