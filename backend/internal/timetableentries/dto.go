package timetableentries

// CreateTimetableEntryRequest represents the request payload to create a new timetable entry.
type CreateTimetableEntryRequest struct {
	TimetableID string `json:"timetable_id" validate:"required,uuid"`

	CourseOfferingID string `json:"course_offering_id" validate:"required,uuid"`

	FacultyProfileID string `json:"faculty_profile_id" validate:"required,uuid"`

	RoomID string `json:"room_id" validate:"required,uuid"`

	WorkingDayID string `json:"working_day_id" validate:"required,uuid"`

	TimeSlotID string `json:"time_slot_id" validate:"required,uuid"`

	EntryType string `json:"entry_type" validate:"required"`
}
