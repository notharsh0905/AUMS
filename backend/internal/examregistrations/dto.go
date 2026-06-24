package examregistrations

type CreateExamRegistrationRequest struct {
	ExamID string `json:"exam_id" binding:"required"`

	EnrollmentID string `json:"enrollment_id" binding:"required"`

	RegistrationStatus string `json:"registration_status"`
}
