package academicyears

type CreateAcademicYearRequest struct {
	YearName string `json:"year_name" validate:"required"`

	StartDate string `json:"start_date" validate:"required"`

	EndDate string `json:"end_date" validate:"required"`

	IsCurrent bool `json:"is_current"`
}
