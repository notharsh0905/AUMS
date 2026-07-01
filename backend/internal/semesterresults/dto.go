package semesterresults

type CreateSemesterResultRequest struct {
	EnrollmentID  string  `json:"enrollment_id" validate:"required,uuid"`
	SemesterID    string  `json:"semester_id" validate:"required,uuid"`
	TotalCredits  float64 `json:"total_credits"`
	EarnedCredits float64 `json:"earned_credits"`
	Sgpa          float64 `json:"sgpa"`
	ResultStatus  string  `json:"result_status" validate:"required"`
	PublishedAt   string  `json:"published_at"` // RFC3339 format
}

type UpdateSemesterResultRequest struct {
	TotalCredits  float64 `json:"total_credits"`
	EarnedCredits float64 `json:"earned_credits"`
	Sgpa          float64 `json:"sgpa"`
	ResultStatus  string  `json:"result_status" validate:"required"`
	PublishedAt   string  `json:"published_at"` // RFC3339 format
}

type SemesterResultResponse struct {
	SemesterResultID string  `json:"semester_result_id"`
	EnrollmentID     string  `json:"enrollment_id"`
	SemesterID       string  `json:"semester_id"`
	TotalCredits     float64 `json:"total_credits"`
	EarnedCredits    float64 `json:"earned_credits"`
	Sgpa             float64 `json:"sgpa"`
	ResultStatus     string  `json:"result_status"`
	PublishedAt      string  `json:"published_at"`
	CreatedAt        string  `json:"created_at"`
	UpdatedAt        string  `json:"updated_at"`
}
