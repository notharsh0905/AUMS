package studentenrollments

// CreateStudentEnrollmentRequest represents the request payload for creating a student enrollment.
type CreateStudentEnrollmentRequest struct {
	StudentProfileID string `json:"student_profile_id" validate:"required,uuid"`

	ProgramID string `json:"program_id" validate:"required,uuid"`

	EnrollmentNumber string `json:"enrollment_number" validate:"required"`

	EnrollmentDate string `json:"enrollment_date" validate:"required"`

	GraduationDate string `json:"graduation_date,omitempty"`

	Status string `json:"status,omitempty"`

	Remarks string `json:"remarks,omitempty"`
}

// StudentEnrollmentResponse represents the response details of a student enrollment.
type StudentEnrollmentResponse struct {
	EnrollmentID     string `json:"enrollment_id"`
	StudentProfileID string `json:"student_profile_id"`
	ProgramID        string `json:"program_id"`
	EnrollmentNumber string `json:"enrollment_number"`
	EnrollmentDate   string `json:"enrollment_date"`
	GraduationDate   string `json:"graduation_date,omitempty"`
	Status           string `json:"status"`
	Remarks          string `json:"remarks,omitempty"`
}
