package assignments

// CreateAssignmentRequest represents the request payload to create a new assignment.
type CreateAssignmentRequest struct {
	CourseOfferingID string `json:"course_offering_id" validate:"required,uuid"`

	FacultyProfileID string `json:"faculty_profile_id" validate:"required,uuid"`

	Title string `json:"title" validate:"required"`

	Description string `json:"description"`

	TotalMarks float64 `json:"total_marks" validate:"required"`

	PublishAt string `json:"publish_at" validate:"required"`

	DueAt string `json:"due_at" validate:"required"`

	AssignmentStatus string `json:"assignment_status"`
}
