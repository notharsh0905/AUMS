package semesters

type CreateSemesterRequest struct {
	AcademicYearID string `json:"academic_year_id" binding:"required"`

	SemesterNumber int32  `json:"semester_number" binding:"required"`
	SemesterName   string `json:"semester_name" binding:"required"`

	StartDate string `json:"start_date" binding:"required"`
	EndDate   string `json:"end_date" binding:"required"`

	IsActive bool `json:"is_active"`
}
