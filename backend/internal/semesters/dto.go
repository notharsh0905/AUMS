package semesters

// CreateSemesterRequest represents the request payload for creating a new semester.
type CreateSemesterRequest struct {
	AcademicYearID string `json:"academic_year_id" validate:"required,uuid"`

	SemesterNumber int32 `json:"semester_number" validate:"required,gte=1"`

	SemesterName string `json:"semester_name" validate:"required"`

	StartDate string `json:"start_date" validate:"required"`

	EndDate string `json:"end_date" validate:"required"`
}

// SemesterResponse represents the response details of a semester.
type SemesterResponse struct {
	SemesterID     string `json:"semester_id"`
	AcademicYearID string `json:"academic_year_id"`
	SemesterNumber int32  `json:"semester_number"`
	SemesterName   string `json:"semester_name"`
	StartDate      string `json:"start_date"`
	EndDate        string `json:"end_date"`
}
