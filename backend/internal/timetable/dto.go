package timetable

type CreateTimetableRequest struct {
	TimetableName string `json:"timetable_name" binding:"required"`

	AcademicYearID string `json:"academic_year_id" binding:"required"`

	SemesterID string `json:"semester_id" binding:"required"`

	EffectiveFrom string `json:"effective_from" binding:"required"`

	EffectiveTo string `json:"effective_to"`

	IsActive bool `json:"is_active"`
}
