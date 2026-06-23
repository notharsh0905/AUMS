package courses

type CreateCourseRequest struct {
	CourseCode string `json:"course_code" binding:"required"`
	CourseName string `json:"course_name" binding:"required"`

	CourseType string `json:"course_type" binding:"required"`

	Credits float64 `json:"credits"`

	ContactHours int32 `json:"contact_hours"`

	Description string `json:"description"`
}
