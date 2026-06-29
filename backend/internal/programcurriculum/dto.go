package programcurriculum

// CreateProgramCurriculumRequest represents the request payload for creating a new program curriculum.
type CreateProgramCurriculumRequest struct {
	ProgramID string `json:"program_id" validate:"required,uuid"`

	CourseID string `json:"course_id" validate:"required,uuid"`

	SemesterNumber int32 `json:"semester_number" validate:"required,gte=1"`

	IsMandatory bool `json:"is_mandatory"`
}
