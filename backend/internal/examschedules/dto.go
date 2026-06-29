package examschedules

// CreateExamScheduleRequest represents the request payload to create a new exam schedule.
type CreateExamScheduleRequest struct {
	ExamID string `json:"exam_id" validate:"required,uuid"`

	RoomID string `json:"room_id" validate:"required,uuid"`

	ExamDate string `json:"exam_date" validate:"required"`
	// format: 2006-01-02

	StartTime string `json:"start_time" validate:"required"`
	// format: 09:00:00

	EndTime string `json:"end_time" validate:"required"`
	// format: 12:00:00
}
