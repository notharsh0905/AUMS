package assignmentsubmissions

// CreateAssignmentSubmissionRequest represents the request payload to submit an assignment.
type CreateAssignmentSubmissionRequest struct {
	AssignmentID string `json:"assignment_id" validate:"required,uuid"`

	EnrollmentID string `json:"enrollment_id" validate:"required,uuid"`

	SubmissionStatus string `json:"submission_status" validate:"required"`

	SubmittedAt string `json:"submitted_at" validate:"required"`

	Remarks string `json:"remarks"`
}
