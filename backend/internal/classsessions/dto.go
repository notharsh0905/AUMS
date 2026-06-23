package classsessions

type CreateClassSessionRequest struct {
	TimetableEntryID string `json:"timetable_entry_id" binding:"required"`

	SessionDate string `json:"session_date" binding:"required"`

	StartTime string `json:"start_time" binding:"required"`

	EndTime string `json:"end_time" binding:"required"`

	SessionStatus string `json:"session_status"`

	ConductedBy string `json:"conducted_by"`

	Remarks string `json:"remarks"`
}
