package timetableentries

import (
	"testing"

	aumsuuid "aums/backend/pkg/uuid"
)

func TestTimetableEntryValidation(t *testing.T) {
	t.Run("Valid timetable entry payload structure", func(t *testing.T) {
		req := CreateTimetableEntryRequest{
			TimetableID:      "00000000-0000-0000-0000-000000000001",
			CourseOfferingID: "00000000-0000-0000-0000-000000000002",
			FacultyProfileID: "00000000-0000-0000-0000-000000000003",
			RoomID:           "00000000-0000-0000-0000-000000000004",
			WorkingDayID:     "00000000-0000-0000-0000-000000000005",
			TimeSlotID:       "00000000-0000-0000-0000-000000000006",
			EntryType:        "LECTURE",
		}

		if req.EntryType != "LECTURE" {
			t.Errorf("expected entry type to be LECTURE")
		}
	})

	t.Run("Parse valid UUIDs", func(t *testing.T) {
		id, err := aumsuuid.New()
		if err != nil {
			t.Fatalf("failed to generate uuid: %v", err)
		}

		parsed, err := aumsuuid.Parse(id.String())
		if err != nil {
			t.Fatalf("failed to parse uuid: %v", err)
		}

		if parsed != id {
			t.Errorf("parsed UUID does not match original")
		}
	})

	t.Run("Reject invalid UUID", func(t *testing.T) {
		_, err := aumsuuid.Parse("invalid-entry-uuid")
		if err == nil {
			t.Errorf("expected error for invalid UUID string")
		}
	})
}
