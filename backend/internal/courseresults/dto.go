package courseresults

// CreateCourseResultRequest represents the request payload to record a course result.
type CreateCourseResultRequest struct {
	EnrollmentID string `json:"enrollment_id" validate:"required,uuid"`

	CourseOfferingID string `json:"course_offering_id" validate:"required,uuid"`

	TotalMarks float64 `json:"total_marks" validate:"required"`

	MarksObtained float64 `json:"marks_obtained" validate:"required"`

	Percentage float64 `json:"percentage" validate:"required"`

	GradeScaleID string `json:"grade_scale_id" validate:"required,uuid"`

	ResultStatus string `json:"result_status"`

	PublishedAt string `json:"published_at" validate:"required"`
}
