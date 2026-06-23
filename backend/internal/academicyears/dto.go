package academicyears

type CreateAcademicYearRequest struct {
	AcademicYearName string `json:"academic_year_name" binding:"required"`

	StartDate string `json:"start_date" binding:"required"`
	EndDate   string `json:"end_date" binding:"required"`

	IsCurrent bool `json:"is_current"`
}
