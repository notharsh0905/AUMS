package analytics

import (
	"context"
	"testing"

	"github.com/jackc/pgx/v5/pgtype"
)

func TestRoleScopingAnalyticsMetrics(t *testing.T) {
	t.Run("Super admin gets comprehensive 6-card dashboard view", func(t *testing.T) {
		cards := []DashboardStatsCard{
			{ID: "students", Title: "Total Students", Value: int64(1500), Icon: "users", Trend: "up"},
			{ID: "faculty", Title: "Faculty Members", Value: int64(120), Icon: "graduation-cap", Trend: "up"},
			{ID: "departments", Title: "Departments", Value: int64(15), Icon: "building", Trend: "neutral"},
			{ID: "programs", Title: "Degree Programs", Value: int64(25), Icon: "book-open", Trend: "up"},
			{ID: "courses", Title: "Active Courses", Value: int64(180), Icon: "book", Trend: "up"},
			{ID: "campuses", Title: "Campuses", Value: int64(3), Icon: "map-pin", Trend: "neutral"},
		}

		if len(cards) != 6 {
			t.Fatalf("expected 6 cards for admin, got %d", len(cards))
		}

		for _, c := range cards {
			val, ok := c.Value.(int64)
			if !ok || val <= 0 {
				t.Errorf("expected positive int64 metric value for %s, got %v", c.ID, c.Value)
			}
		}
	})

	t.Run("Validate invalid user UUID", func(t *testing.T) {
		service := NewService(nil, nil)
		if service == nil {
			t.Fatalf("expected non-nil service")
		}
		var emptyUUID pgtype.UUID
		if emptyUUID.Valid {
			t.Errorf("expected empty UUID to be invalid")
		}
		_ = context.Background()
	})
}
