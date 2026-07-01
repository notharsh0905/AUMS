package examregistrations

type CreateExamRegistrationRequest struct {
	ExamID             string `json:"exam_id" validate:"required,uuid"`
	EnrollmentID       string `json:"enrollment_id" validate:"required,uuid"`
	RegistrationStatus string `json:"registration_status" validate:"required"`
}

type UpdateExamRegistrationRequest struct {
	RegistrationStatus string `json:"registration_status" validate:"required"`
}

type ExamRegistrationResponse struct {
	ExamRegistrationID string `json:"exam_registration_id"`
	ExamID             string `json:"exam_id"`
	EnrollmentID       string `json:"enrollment_id"`
	RegistrationStatus string `json:"registration_status"`
	RegisteredAt       string `json:"registered_at"`
	CreatedAt          string `json:"created_at"`
	UpdatedAt          string `json:"updated_at"`
}
