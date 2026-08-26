package students

import (
	"testing"

	aumsuuid "aums/backend/pkg/uuid"
)

func TestStudentScopingLogic(t *testing.T) {
	student1UserID, _ := aumsuuid.New()
	student2UserID, _ := aumsuuid.New()

	t.Run("Distinct student user IDs are not identical", func(t *testing.T) {
		if student1UserID == student2UserID {
			t.Errorf("Expected student1 and student2 IDs to be distinct")
		}
	})

	t.Run("Service instance with repository creates successfully", func(t *testing.T) {
		svc := NewService(nil, nil)
		if svc == nil {
			t.Errorf("Expected non-nil service")
		}
	})
}
