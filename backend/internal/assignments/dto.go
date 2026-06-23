package assignments

type CreateAssignmentRequest struct {
	CourseOfferingID string `json:"course_offering_id" binding:"required"`

	FacultyProfileID string `json:"faculty_profile_id" binding:"required"`

	Title string `json:"title" binding:"required"`

	Description string `json:"description"`

	TotalMarks float64 `json:"total_marks" binding:"required"`

	PublishAt string `json:"publish_at" binding:"required"`

	DueAt string `json:"due_at" binding:"required"`

	AssignmentStatus string `json:"assignment_status"`
}
