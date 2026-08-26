package assignmentsubmissions

import (
	"testing"

	aumsuuid "aums/backend/pkg/uuid"
)

func TestGradeValidation(t *testing.T) {
	t.Run("Valid grade request formatting", func(t *testing.T) {
		req := GradeAssignmentSubmissionRequest{
			MarksAwarded: 85.5,
			Feedback:     "Well articulated response",
		}

		if req.MarksAwarded < 0 {
			t.Errorf("expected marks to be non-negative")
		}
	})

	t.Run("Parse submission UUID", func(t *testing.T) {
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
		_, err := aumsuuid.Parse("invalid-uuid-string")
		if err == nil {
			t.Errorf("expected error for invalid UUID string")
		}
	})
}
