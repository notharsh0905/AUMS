package studentcourseregistrations

// CreateStudentCourseRegistrationRequest represents the request payload to register a student for a course offering.
type CreateStudentCourseRegistrationRequest struct {
	EnrollmentID string `json:"enrollment_id" validate:"required,uuid"`

	CourseOfferingID string `json:"course_offering_id" validate:"required,uuid"`

	RegistrationStatus string `json:"registration_status"`
}
