package exams

type CreateExamRequest struct {
	CourseOfferingID string `json:"course_offering_id" binding:"required"`

	ExamName string `json:"exam_name" binding:"required"`

	ExamType string `json:"exam_type" binding:"required"`

	TotalMarks float64 `json:"total_marks" binding:"required"`

	PassingMarks float64 `json:"passing_marks" binding:"required"`

	ExamStatus string `json:"exam_status"`

	Description string `json:"description"`
}
