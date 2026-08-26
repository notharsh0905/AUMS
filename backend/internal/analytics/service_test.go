package analytics

import (
	"testing"
)

func TestDashboardStatsCardConstruction(t *testing.T) {
	card := DashboardStatsCard{
		ID:               "students",
		Title:            "Total Students",
		Value:            int64(120),
		Icon:             "users",
		PercentageChange: 12.0,
		Trend:            "up",
	}

	if card.ID != "students" {
		t.Errorf("expected ID 'students', got '%s'", card.ID)
	}
	if card.Value != int64(120) {
		t.Errorf("expected Value 120, got %v", card.Value)
	}
	if card.Trend != "up" {
		t.Errorf("expected Trend 'up', got '%s'", card.Trend)
	}
}

func TestDashboardAnalyticsResponseStructure(t *testing.T) {
	resp := DashboardAnalyticsResponse{
		InstitutionInfo: DashboardInstitutionInfo{
			Name:         "Autonomous Management System University",
			AcademicYear: "2025-2026",
			Semester:     "Fall Semester 2026",
		},
		StatsCards: []DashboardStatsCard{
			{
				ID:    "students",
				Title: "Total Students",
				Value: int64(120),
			},
		},
		ResultsSummary: DashboardResultsSummary{
			CourseCount:   10,
			SemesterCount: 5,
			ProgramCount:  2,
		},
	}

	if resp.InstitutionInfo.Name == "" {
		t.Errorf("expected non-empty InstitutionInfo.Name")
	}
	if len(resp.StatsCards) != 1 {
		t.Errorf("expected 1 stats card, got %d", len(resp.StatsCards))
	}
	if resp.ResultsSummary.CourseCount != 10 {
		t.Errorf("expected CourseCount 10, got %d", resp.ResultsSummary.CourseCount)
	}
}
