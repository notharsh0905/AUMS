package courseofferings

type CreateCourseOfferingRequest struct {
	CourseID string `json:"course_id" binding:"required"`

	AcademicYearID string `json:"academic_year_id" binding:"required"`

	SemesterID string `json:"semester_id" binding:"required"`

	Section string `json:"section"`

	Status string `json:"status"`

	MaxCapacity int32 `json:"max_capacity"`
}
