package exams

// CreateExamRequest represents the request payload to create a new exam.
type CreateExamRequest struct {
	CourseOfferingID string `json:"course_offering_id" validate:"required,uuid"`

	ExamName string `json:"exam_name" validate:"required"`

	ExamType string `json:"exam_type" validate:"required"`

	TotalMarks float64 `json:"total_marks" validate:"required"`

	PassingMarks float64 `json:"passing_marks" validate:"required"`

	ExamStatus string `json:"exam_status"`

	Description string `json:"description"`
}
