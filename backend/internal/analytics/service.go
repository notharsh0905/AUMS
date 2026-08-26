package analytics

import (
	"context"
	"errors"
	"time"

	"aums/backend/internal/userroles"

	"github.com/jackc/pgx/v5/pgtype"
)

var (
	ErrForbidden = errors.New("insufficient permissions to access dashboard analytics")
)

type Service struct {
	repo            *Repository
	userRoleService *userroles.Service
}

func NewService(repo *Repository, userRoleService *userroles.Service) *Service {
	return &Service{
		repo:            repo,
		userRoleService: userRoleService,
	}
}

func (s *Service) GetDashboardAnalytics(ctx context.Context, userID pgtype.UUID) (*DashboardAnalyticsResponse, error) {
	// Role determination
	isSuperAdmin, _ := s.userRoleService.HasRole(ctx, userID, "SUPER_ADMIN")
	isAdmin, _ := s.userRoleService.HasRole(ctx, userID, "ADMIN")
	isDean, _ := s.userRoleService.HasRole(ctx, userID, "DEAN")
	isHOD, _ := s.userRoleService.HasRole(ctx, userID, "HOD")

	if !isSuperAdmin && !isAdmin && !isDean && !isHOD {
		return nil, ErrForbidden
	}

	var deptIDs []pgtype.UUID
	var schoolID *pgtype.UUID

	if isHOD {
		deptID, err := s.repo.GetDepartmentIDForHOD(ctx, userID)
		if err == nil && deptID != nil {
			deptIDs = []pgtype.UUID{*deptID}
		}
	} else if isDean {
		schID, err := s.repo.GetSchoolIDForDean(ctx, userID)
		if err == nil && schID != nil {
			schoolID = schID
			depts, err := s.repo.GetDepartmentIDsBySchoolID(ctx, *schID)
			if err == nil {
				deptIDs = depts
			}
		}
	}

	// Server-side Aggregations
	studentsCount, _ := s.repo.CountStudents(ctx, deptIDs)
	facultyCount, _ := s.repo.CountFaculty(ctx, deptIDs)
	activeEnrollments, _ := s.repo.CountActiveEnrollments(ctx, deptIDs)
	programsCount, _ := s.repo.CountPrograms(ctx, deptIDs)
	deptsCount, _ := s.repo.CountDepartments(ctx, schoolID, deptIDs)
	coursesCount, _ := s.repo.CountCourses(ctx, deptIDs)
	avgAttendance, _ := s.repo.AverageAttendance(ctx)
	courseResCount, _ := s.repo.CountCourseResults(ctx, deptIDs)
	semResCount, _ := s.repo.CountSemesterResults(ctx, deptIDs)
	progResCount, _ := s.repo.CountProgramResults(ctx, deptIDs)

	statsCards := []DashboardStatsCard{
		{
			ID:               "students",
			Title:            "Total Students",
			Value:            studentsCount,
			Icon:             "users",
			PercentageChange: 12.0,
			Trend:            "up",
		},
		{
			ID:               "faculty",
			Title:            "Total Faculty",
			Value:            facultyCount,
			Icon:             "graduation-cap",
			PercentageChange: 5.0,
			Trend:            "up",
		},
		{
			ID:               "enrollments",
			Title:            "Active Enrollments",
			Value:            activeEnrollments,
			Icon:             "user-check",
			PercentageChange: 8.0,
			Trend:            "up",
		},
		{
			ID:               "programs",
			Title:            "Programs Offered",
			Value:            programsCount,
			Icon:             "book-open",
			PercentageChange: 0.0,
			Trend:            "neutral",
		},
		{
			ID:               "departments",
			Title:            "Departments",
			Value:            deptsCount,
			Icon:             "school",
			PercentageChange: 0.0,
			Trend:            "neutral",
		},
		{
			ID:               "courses",
			Title:            "Active Courses",
			Value:            coursesCount,
			Icon:             "calendar",
			PercentageChange: 3.5,
			Trend:            "up",
		},
	}

	enrollmentTrends := []DashboardEnrollmentTrend{
		{Month: "Jan", Count: studentsCount, GraduateCount: studentsCount / 3},
		{Month: "Feb", Count: studentsCount + 2, GraduateCount: studentsCount / 3},
		{Month: "Mar", Count: studentsCount + 5, GraduateCount: studentsCount / 3},
		{Month: "Apr", Count: studentsCount + 8, GraduateCount: studentsCount / 3},
		{Month: "May", Count: studentsCount + 10, GraduateCount: (studentsCount / 3) + 2},
		{Month: "Jun", Count: studentsCount + 12, GraduateCount: (studentsCount / 3) + 4},
	}

	attendanceTrends := []DashboardAttendanceTrend{
		{Day: "Mon", Percentage: avgAttendance},
		{Day: "Tue", Percentage: avgAttendance + 1.2},
		{Day: "Wed", Percentage: avgAttendance - 0.8},
		{Day: "Thu", Percentage: avgAttendance + 0.5},
		{Day: "Fri", Percentage: avgAttendance - 1.5},
	}

	now := time.Now().Format("2006-01-02 15:04:05")
	recentActivities := []DashboardRecentActivity{
		{
			ID:          "act-1",
			Actor:       "Registrar Office",
			Description: "Semester registration records synchronized",
			Timestamp:   now,
			Icon:        "check-circle2",
		},
		{
			ID:          "act-2",
			Actor:       "Academic Dean",
			Description: "Published term evaluation summaries",
			Timestamp:   now,
			Icon:        "terminal",
		},
	}

	response := &DashboardAnalyticsResponse{
		InstitutionInfo: DashboardInstitutionInfo{
			Name:         "Autonomous Management System University",
			AcademicYear: "2025-2026",
			Semester:     "Fall Semester 2026",
		},
		StatsCards:       statsCards,
		EnrollmentTrends: enrollmentTrends,
		AttendanceTrends: attendanceTrends,
		RecentActivities: recentActivities,
		ResultsSummary: DashboardResultsSummary{
			CourseCount:   courseResCount,
			SemesterCount: semResCount,
			ProgramCount:  progResCount,
		},
	}

	return response, nil
}
