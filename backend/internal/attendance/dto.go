package attendance

type CreateAttendanceRecordRequest struct {
	ClassSessionID string `json:"class_session_id" binding:"required"`

	EnrollmentID string `json:"enrollment_id" binding:"required"`

	AttendanceStatus string `json:"attendance_status" binding:"required"`

	MarkedBy string `json:"marked_by"`

	Remarks string `json:"remarks"`
}
