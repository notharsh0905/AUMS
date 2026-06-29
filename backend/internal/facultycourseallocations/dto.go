package facultycourseallocations

// CreateFacultyCourseAllocationRequest represents the request payload to allocate a course to a faculty member.
type CreateFacultyCourseAllocationRequest struct {
	FacultyProfileID string `json:"faculty_profile_id" validate:"required,uuid"`

	CourseOfferingID string `json:"course_offering_id" validate:"required,uuid"`
}
