package timetable

// CreateTimetableRequest represents the request payload to create a new timetable.
type CreateTimetableRequest struct {
	TimetableName string `json:"timetable_name" validate:"required"`

	AcademicYearID string `json:"academic_year_id" validate:"required,uuid"`

	SemesterID string `json:"semester_id" validate:"required,uuid"`

	EffectiveFrom string `json:"effective_from" validate:"required"`

	EffectiveTo string `json:"effective_to"`

	IsActive bool `json:"is_active"`
}
