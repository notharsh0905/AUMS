package assignmentsubmissions

type CreateAssignmentSubmissionRequest struct {
	AssignmentID string `json:"assignment_id" binding:"required"`

	EnrollmentID string `json:"enrollment_id" binding:"required"`

	SubmissionStatus string `json:"submission_status" binding:"required"`

	SubmittedAt string `json:"submitted_at" binding:"required"`

	Remarks string `json:"remarks"`
}
