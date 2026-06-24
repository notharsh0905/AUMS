package semesterresults

type CreateSemesterResultRequest struct {
	EnrollmentID string `json:"enrollment_id" binding:"required"`

	SemesterID string `json:"semester_id" binding:"required"`

	TotalCredits float64 `json:"total_credits" binding:"required"`

	EarnedCredits float64 `json:"earned_credits" binding:"required"`

	Sgpa float64 `json:"sgpa" binding:"required"`

	ResultStatus string `json:"result_status"`

	PublishedAt string `json:"published_at" binding:"required"`
}
