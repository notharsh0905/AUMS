package programs

// CreateProgramRequest represents the request payload for creating a new program.
type CreateProgramRequest struct {
	DepartmentID string `json:"department_id" validate:"required,uuid"`

	ProgramCode string `json:"program_code" validate:"required"`

	ProgramName string `json:"program_name" validate:"required"`

	DegreeType string `json:"degree_type" validate:"required"`

	DurationValue int32 `json:"duration_value" validate:"required,gte=1"`

	DurationUnit string `json:"duration_unit" validate:"required"`

	TotalSemesters int32 `json:"total_semesters" validate:"required,gte=1"`
}

// ProgramResponse represents the response details of a program.
type ProgramResponse struct {
	ProgramID      string `json:"program_id"`
	DepartmentID   string `json:"department_id"`
	ProgramCode    string `json:"program_code"`
	ProgramName    string `json:"program_name"`
	DegreeType     string `json:"degree_type"`
	DurationValue  int32  `json:"duration_value"`
	DurationUnit   string `json:"duration_unit"`
	TotalSemesters int32  `json:"total_semesters"`
}
