package studentcourseregistrations

type CreateStudentCourseRegistrationRequest struct {
	EnrollmentID string `json:"enrollment_id" binding:"required"`

	CourseOfferingID string `json:"course_offering_id" binding:"required"`

	RegistrationStatus string `json:"registration_status"`
}
