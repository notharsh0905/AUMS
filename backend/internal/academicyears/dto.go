package academicyears

// CreateAcademicYearRequest represents the request payload for creating a new academic year.
type CreateAcademicYearRequest struct {
	YearName string `json:"year_name" validate:"required"`

	StartDate string `json:"start_date" validate:"required"`

	EndDate string `json:"end_date" validate:"required"`

	IsCurrent bool `json:"is_current"`
}

// AcademicYearResponse represents the response details of an academic year.
type AcademicYearResponse struct {
	AcademicYearID   string `json:"academic_year_id"`
	AcademicYearName string `json:"academic_year_name"`
	StartDate        string `json:"start_date"`
	EndDate          string `json:"end_date"`
	IsCurrent        bool   `json:"is_current"`
}
