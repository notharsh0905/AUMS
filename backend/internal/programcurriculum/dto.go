package programcurriculum

type CreateProgramCurriculumRequest struct {
	ProgramID string `json:"program_id" binding:"required"`

	CourseID string `json:"course_id" binding:"required"`

	SemesterNumber int32 `json:"semester_number" binding:"required"`

	IsMandatory bool `json:"is_mandatory"`
}
