package courses

// CreateCourseRequest represents the request payload for creating a new course.
type CreateCourseRequest struct {
	CourseCode string `json:"course_code" validate:"required"`

	CourseName string `json:"course_name" validate:"required"`

	CourseType string `json:"course_type" validate:"required"`

	Credits string `json:"credits" validate:"required"`

	ContactHours int32 `json:"contact_hours" validate:"required,gte=1"`

	Description string `json:"description,omitempty"`
}
