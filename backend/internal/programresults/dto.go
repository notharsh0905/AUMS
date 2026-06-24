package programresults

type CreateProgramResultRequest struct {
	EnrollmentID string `json:"enrollment_id" binding:"required"`

	Cgpa float64 `json:"cgpa" binding:"required"`

	TotalCredits float64 `json:"total_credits" binding:"required"`

	EarnedCredits float64 `json:"earned_credits" binding:"required"`

	DegreeCompleted bool `json:"degree_completed"`

	CompletionDate string `json:"completion_date" binding:"required"`

	ResultStatus string `json:"result_status"`

	PublishedAt string `json:"published_at" binding:"required"`
}
