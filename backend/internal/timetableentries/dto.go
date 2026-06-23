package timetableentries

type CreateTimetableEntryRequest struct {
	TimetableID string `json:"timetable_id" binding:"required"`

	CourseOfferingID string `json:"course_offering_id" binding:"required"`

	FacultyProfileID string `json:"faculty_profile_id" binding:"required"`

	RoomID string `json:"room_id" binding:"required"`

	WorkingDayID string `json:"working_day_id" binding:"required"`

	TimeSlotID string `json:"time_slot_id" binding:"required"`

	EntryType string `json:"entry_type" binding:"required"`
}
