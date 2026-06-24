package examschedules

type CreateExamScheduleRequest struct {
	ExamID string `json:"exam_id" binding:"required"`

	RoomID string `json:"room_id" binding:"required"`

	ExamDate string `json:"exam_date" binding:"required"`
	// format: 2006-01-02

	StartTime string `json:"start_time" binding:"required"`
	// format: 09:00:00

	EndTime string `json:"end_time" binding:"required"`
	// format: 12:00:00
}
