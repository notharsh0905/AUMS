package attendance

// CreateAttendanceRecordRequest represents the request payload to mark/create attendance.
type CreateAttendanceRecordRequest struct {
	ClassSessionID string `json:"class_session_id" validate:"required,uuid"`

	EnrollmentID string `json:"enrollment_id" validate:"required,uuid"`

	AttendanceStatus string `json:"attendance_status" validate:"required"`

	MarkedBy string `json:"marked_by"`

	Remarks string `json:"remarks"`
}
