package programs

type CreateProgramRequest struct {
	DepartmentID string `json:"department_id" binding:"required"`

	ProgramCode string `json:"program_code" binding:"required"`
	ProgramName string `json:"program_name" binding:"required"`

	DegreeType string `json:"degree_type" binding:"required"`

	DurationValue int32  `json:"duration_value" binding:"required"`
	DurationUnit  string `json:"duration_unit" binding:"required"`

	TotalSemesters int32 `json:"total_semesters"`
}
