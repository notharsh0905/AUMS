package classsessions

// CreateClassSessionRequest represents the request payload to create a new class session.
type CreateClassSessionRequest struct {
	TimetableEntryID string `json:"timetable_entry_id" validate:"required,uuid"`

	SessionDate string `json:"session_date" validate:"required"`

	StartTime string `json:"start_time" validate:"required"`

	EndTime string `json:"end_time" validate:"required"`

	SessionStatus string `json:"session_status"`

	ConductedBy string `json:"conducted_by"`

	Remarks string `json:"remarks"`
}
