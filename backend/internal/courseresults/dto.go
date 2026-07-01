package courseresults

type CreateCourseResultRequest struct {
	EnrollmentID     string  `json:"enrollment_id" validate:"required,uuid"`
	CourseOfferingID string  `json:"course_offering_id" validate:"required,uuid"`
	TotalMarks       float64 `json:"total_marks" validate:"required,gt=0"`
	MarksObtained    float64 `json:"marks_obtained" validate:"required,gte=0"`
	Percentage       float64 `json:"percentage" validate:"required,gte=0,lte=100"`
	GradeScaleID     string  `json:"grade_scale_id" validate:"required,uuid"`
	ResultStatus     string  `json:"result_status" validate:"required"`
	PublishedAt      string  `json:"published_at" validate:"required"` // RFC3339 format
}

type UpdateCourseResultRequest struct {
	TotalMarks    float64 `json:"total_marks" validate:"required,gt=0"`
	MarksObtained float64 `json:"marks_obtained" validate:"required,gte=0"`
	Percentage    float64 `json:"percentage" validate:"required,gte=0,lte=100"`
	GradeScaleID  string  `json:"grade_scale_id" validate:"required,uuid"`
	ResultStatus  string  `json:"result_status" validate:"required"`
	PublishedAt   string  `json:"published_at" validate:"required"` // RFC3339 format
}

type CourseResultResponse struct {
	CourseResultID   string  `json:"course_result_id"`
	EnrollmentID     string  `json:"enrollment_id"`
	CourseOfferingID string  `json:"course_offering_id"`
	TotalMarks       float64 `json:"total_marks"`
	MarksObtained    float64 `json:"marks_obtained"`
	Percentage       float64 `json:"percentage"`
	GradeScaleID     string  `json:"grade_scale_id"`
	ResultStatus     string  `json:"result_status"`
	PublishedAt      string  `json:"published_at"`
	CreatedAt        string  `json:"created_at"`
	UpdatedAt        string  `json:"updated_at"`
}
