package semesterresults

// CreateSemesterResultRequest represents the request payload to record a semester result.
type CreateSemesterResultRequest struct {
	EnrollmentID string `json:"enrollment_id" validate:"required,uuid"`

	SemesterID string `json:"semester_id" validate:"required,uuid"`

	TotalCredits float64 `json:"total_credits" validate:"required"`

	EarnedCredits float64 `json:"earned_credits" validate:"required"`

	Sgpa float64 `json:"sgpa" validate:"required"`

	ResultStatus string `json:"result_status"`

	PublishedAt string `json:"published_at" validate:"required"`
}
