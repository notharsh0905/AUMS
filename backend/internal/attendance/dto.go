package attendance

// CreateAttendanceRecordRequest represents the request payload to mark/create attendance.
type CreateAttendanceRecordRequest struct {
	ClassSessionID string `json:"class_session_id" validate:"required,uuid"`

	EnrollmentID string `json:"enrollment_id" validate:"required,uuid"`

	AttendanceStatus string `json:"attendance_status" validate:"required,oneof=PRESENT ABSENT LATE EXCUSED"`

	MarkedBy string `json:"marked_by"`

	Remarks string `json:"remarks"`
}

// BulkAttendanceItem represents a single student's attendance marking within a bulk request.
type BulkAttendanceItem struct {
	EnrollmentID string `json:"enrollment_id" validate:"required,uuid"`

	AttendanceStatus string `json:"attendance_status" validate:"required,oneof=PRESENT ABSENT LATE EXCUSED"`

	Remarks string `json:"remarks"`
}

// BulkMarkAttendanceRequest represents the payload to atomically mark attendance for multiple students.
type BulkMarkAttendanceRequest struct {
	ClassSessionID string `json:"class_session_id" validate:"required,uuid"`

	Records []BulkAttendanceItem `json:"records" validate:"required,min=1,dive"`
}
