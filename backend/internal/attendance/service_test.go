package attendance

import (
	"context"
	"testing"

	aumsuuid "aums/backend/pkg/uuid"
)

func TestAttendanceValidation(t *testing.T) {
	t.Run("Valid bulk attendance payload structure", func(t *testing.T) {
		req := BulkMarkAttendanceRequest{
			ClassSessionID: "00000000-0000-0000-0000-000000000001",
			Records: []BulkAttendanceItem{
				{
					EnrollmentID:     "00000000-0000-0000-0000-000000000010",
					AttendanceStatus: "PRESENT",
					Remarks:          "On time",
				},
				{
					EnrollmentID:     "00000000-0000-0000-0000-000000000020",
					AttendanceStatus: "ABSENT",
					Remarks:          "Unexcused",
				},
			},
		}

		if len(req.Records) != 2 {
			t.Errorf("expected 2 records, got %d", len(req.Records))
		}
	})

	t.Run("Detect duplicate enrollments in service bulk validation", func(t *testing.T) {
		service := NewService(nil, nil)
		callerID, _ := aumsuuid.New()

		req := BulkMarkAttendanceRequest{
			ClassSessionID: "00000000-0000-0000-0000-000000000001",
			Records: []BulkAttendanceItem{
				{
					EnrollmentID:     "00000000-0000-0000-0000-000000000010",
					AttendanceStatus: "PRESENT",
				},
				{
					EnrollmentID:     "00000000-0000-0000-0000-000000000010",
					AttendanceStatus: "ABSENT",
				},
			},
		}

		err := service.BulkMark(context.Background(), callerID.String(), req)
		if err == nil || err.Error() != "duplicate enrollment record in bulk attendance payload: 00000000-0000-0000-0000-000000000010" {
			t.Errorf("expected duplicate enrollment error, got: %v", err)
		}
	})

	t.Run("Reject invalid class session UUID", func(t *testing.T) {
		service := NewService(nil, nil)
		callerID, _ := aumsuuid.New()

		req := BulkMarkAttendanceRequest{
			ClassSessionID: "invalid-uuid",
			Records: []BulkAttendanceItem{
				{
					EnrollmentID:     "00000000-0000-0000-0000-000000000010",
					AttendanceStatus: "PRESENT",
				},
			},
		}

		err := service.BulkMark(context.Background(), callerID.String(), req)
		if err == nil || err.Error() != "invalid class session id" {
			t.Errorf("expected invalid class session error, got: %v", err)
		}
	})
}
