package semesters

type CreateSemesterRequest struct {
	AcademicYearID string `json:"academic_year_id" validate:"required,uuid"`

	SemesterNumber int32 `json:"semester_number" validate:"required,gte=1"`

	SemesterName string `json:"semester_name" validate:"required"`

	StartDate string `json:"start_date" validate:"required"`

	EndDate string `json:"end_date" validate:"required"`
}
