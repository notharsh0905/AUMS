package courseofferings

// CreateCourseOfferingRequest represents the request payload for creating a new course offering.
type CreateCourseOfferingRequest struct {
	CourseID string `json:"course_id" validate:"required,uuid"`

	AcademicYearID string `json:"academic_year_id" validate:"required,uuid"`

	SemesterID string `json:"semester_id" validate:"required,uuid"`

	Section string `json:"section"`

	Status string `json:"status"`

	MaxCapacity int32 `json:"max_capacity"`
}
