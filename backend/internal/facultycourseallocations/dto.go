package facultycourseallocations

type CreateFacultyCourseAllocationRequest struct {
	FacultyProfileID string `json:"faculty_profile_id" binding:"required"`

	CourseOfferingID string `json:"course_offering_id" binding:"required"`
}
