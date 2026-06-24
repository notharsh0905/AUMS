package courseresults

type CreateCourseResultRequest struct {
	EnrollmentID string `json:"enrollment_id" binding:"required"`

	CourseOfferingID string `json:"course_offering_id" binding:"required"`

	TotalMarks float64 `json:"total_marks" binding:"required"`

	MarksObtained float64 `json:"marks_obtained" binding:"required"`

	Percentage float64 `json:"percentage" binding:"required"`

	GradeScaleID string `json:"grade_scale_id" binding:"required"`

	ResultStatus string `json:"result_status"`

	PublishedAt string `json:"published_at" binding:"required"`
}
