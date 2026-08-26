package analytics

type DashboardInstitutionInfo struct {
	Name         string `json:"name"`
	AcademicYear string `json:"academic_year"`
	Semester     string `json:"semester"`
}

type DashboardStatsCard struct {
	ID               string  `json:"id"`
	Title            string  `json:"title"`
	Value            any     `json:"value"`
	Icon             string  `json:"icon"`
	PercentageChange float64 `json:"percentage_change"`
	Trend            string  `json:"trend"`
}

type DashboardEnrollmentTrend struct {
	Month         string `json:"month"`
	Count         int64  `json:"count"`
	GraduateCount int64  `json:"graduate_count"`
}

type DashboardAttendanceTrend struct {
	Day        string  `json:"day"`
	Percentage float64 `json:"percentage"`
}

type DashboardResultsSummary struct {
	CourseCount   int64 `json:"course_count"`
	SemesterCount int64 `json:"semester_count"`
	ProgramCount  int64 `json:"program_count"`
}

type DashboardRecentActivity struct {
	ID          string `json:"id"`
	Actor       string `json:"actor"`
	Description string `json:"description"`
	Timestamp   string `json:"timestamp"`
	Icon        string `json:"icon"`
}

type DashboardAnalyticsResponse struct {
	InstitutionInfo  DashboardInstitutionInfo   `json:"institution_info"`
	StatsCards       []DashboardStatsCard       `json:"stats_cards"`
	EnrollmentTrends []DashboardEnrollmentTrend `json:"enrollment_trends"`
	AttendanceTrends []DashboardAttendanceTrend `json:"attendance_trends"`
	RecentActivities []DashboardRecentActivity  `json:"recent_activities"`
	ResultsSummary   DashboardResultsSummary    `json:"results_summary"`
}
