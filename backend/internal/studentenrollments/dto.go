package studentenrollments

type CreateStudentEnrollmentRequest struct {
	StudentProfileID string `json:"student_profile_id" binding:"required"`

	ProgramID string `json:"program_id" binding:"required"`

	EnrollmentNumber string `json:"enrollment_number" binding:"required"`

	EnrollmentDate string `json:"enrollment_date" binding:"required"`

	GraduationDate string `json:"graduation_date"`

	Status string `json:"status"`

	Remarks string `json:"remarks"`
}
