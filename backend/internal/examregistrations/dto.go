package examregistrations

// CreateExamRegistrationRequest represents the request payload to register a student for an exam.
type CreateExamRegistrationRequest struct {
	ExamID string `json:"exam_id" validate:"required,uuid"`

	EnrollmentID string `json:"enrollment_id" validate:"required,uuid"`

	RegistrationStatus string `json:"registration_status"`
}
