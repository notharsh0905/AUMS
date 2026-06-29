package programresults

// CreateProgramResultRequest represents the request payload to record a program result.
type CreateProgramResultRequest struct {
	EnrollmentID string `json:"enrollment_id" validate:"required,uuid"`

	Cgpa float64 `json:"cgpa" validate:"required"`

	TotalCredits float64 `json:"total_credits" validate:"required"`

	EarnedCredits float64 `json:"earned_credits" validate:"required"`

	DegreeCompleted bool `json:"degree_completed"`

	CompletionDate string `json:"completion_date" validate:"required"`

	ResultStatus string `json:"result_status"`

	PublishedAt string `json:"published_at" validate:"required"`
}
