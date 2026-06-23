package server

import (
	"net/http"

	"aums/backend/internal/academicyears"
	"aums/backend/internal/audit"
	"aums/backend/internal/auth"
	"aums/backend/internal/campuses"
	"aums/backend/internal/departments"
	"aums/backend/internal/middleware"
	"aums/backend/internal/permissions"
	"aums/backend/internal/programs"
	"aums/backend/internal/rolepermissions"
	"aums/backend/internal/roles"
	"aums/backend/internal/schools"
	"aums/backend/internal/semesters"
	"aums/backend/internal/sessions"
	"aums/backend/internal/studentenrollments"
	"aums/backend/internal/students"
	"aums/backend/internal/userroles"
	"aums/backend/internal/users"
	"aums/backend/pkg/app"

	"github.com/gin-gonic/gin"
)

func New(application *app.Application) *gin.Engine {

	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":      "ok",
			"service":     "AUMS",
			"environment": application.Config.App.Environment,
			"version":     "v1",
		})
	})

	api := router.Group("/api/v1")

	// ==========================================
	// REPOSITORIES
	// ==========================================

	userRepository := users.NewRepository(
		application.DB,
	)

	sessionRepository := sessions.NewRepository(
		application.DB,
	)

	userRolesRepository := userroles.NewRepository(
		application.DB,
	)

	userRolesService := userroles.NewService(
		userRolesRepository,
	)

	rolesRepository := roles.NewRepository(
		application.DB,
	)

	rolesService := roles.NewService(
		rolesRepository,
	)
	rolesHandler := roles.NewHandler(
		rolesService,
	)

	permissionsRepository := permissions.NewRepository(
		application.DB,
	)

	permissionsService := permissions.NewService(
		permissionsRepository,
	)

	permissionsHandler := permissions.NewHandler(
		permissionsService,
	)

	auditRepository := audit.NewRepository(
		application.DB,
	)

	auditService := audit.NewService(
		auditRepository,
	)

	campusRepository := campuses.NewRepository(
		application.DB,
	)

	campusService := campuses.NewService(
		campusRepository,
	)

	campusHandler := campuses.NewHandler(
		campusService,
	)

	schoolRepository := schools.NewRepository(
		application.DB,
	)

	schoolService := schools.NewService(
		schoolRepository,
	)

	schoolHandler := schools.NewHandler(
		schoolService,
	)

	departmentRepository := departments.NewRepository(
		application.DB,
	)

	departmentService := departments.NewService(
		departmentRepository,
	)

	departmentHandler := departments.NewHandler(
		departmentService,
	)

	programRepository := programs.NewRepository(
		application.DB,
	)

	programService := programs.NewService(
		programRepository,
	)

	programHandler := programs.NewHandler(
		programService,
	)

	academicYearRepository := academicyears.NewRepository(
		application.DB,
	)

	academicYearService := academicyears.NewService(
		academicYearRepository,
	)

	academicYearHandler := academicyears.NewHandler(
		academicYearService,
	)

	semesterRepository := semesters.NewRepository(
		application.DB,
	)

	semesterService := semesters.NewService(
		semesterRepository,
	)

	semesterHandler := semesters.NewHandler(
		semesterService,
	)

	studentRepository := students.NewRepository(
		application.DB,
	)

	studentService := students.NewService(
		studentRepository,
	)

	studentHandler := students.NewHandler(
		studentService,
	)

	studentEnrollmentRepository := studentenrollments.NewRepository(
		application.DB,
	)

	studentEnrollmentService := studentenrollments.NewService(
		studentEnrollmentRepository,
	)

	studentEnrollmentHandler := studentenrollments.NewHandler(
		studentEnrollmentService,
	)
	// ==========================================
	// USERS MODULE
	// ==========================================

	userService := users.NewService(
		userRepository,
	)

	userHandler := users.NewHandler(
		userService,
	)

	usersGroup := api.Group("/users")

	usersGroup.Use(
		middleware.Auth(
			application.Config,
		),
	)

	usersGroup.Use(
		middleware.RequireRole(
			userRolesService,
			"SUPER_ADMIN",
		),
	)

	users.RegisterRoutes(
		usersGroup,
		userHandler,
	)

	rolePermissionsRepository := rolepermissions.NewRepository(
		application.DB,
	)

	rolePermissionsService := rolepermissions.NewService(
		rolePermissionsRepository,
	)

	rolePermissionsHandler := rolepermissions.NewHandler(
		rolePermissionsService,
	)

	// ==========================================
	// ROLES MODULE
	// ==========================================

	rolesGroup := api.Group("/roles")

	rolesGroup.Use(
		middleware.Auth(
			application.Config,
		),
	)

	rolesGroup.Use(
		middleware.RequireRole(
			userRolesService,
			"SUPER_ADMIN",
		),
	)

	roles.RegisterRoutes(
		rolesGroup,
		rolesHandler,
		rolePermissionsHandler,
	)

	// ==========================================
	// PERMISSIONS MODULE
	// ==========================================

	permissionsGroup := api.Group("/permissions")

	permissionsGroup.Use(
		middleware.Auth(
			application.Config,
		),
	)

	permissionsGroup.Use(
		middleware.RequireRole(
			userRolesService,
			"SUPER_ADMIN",
		),
	)

	permissions.RegisterRoutes(
		permissionsGroup,
		permissionsHandler,
	)

	// ==========================================
	// CAMPUSES MODULE
	// ==========================================

	campusesGroup := api.Group("/campuses")

	campusesGroup.Use(
		middleware.Auth(
			application.Config,
		),
	)

	campusesGroup.Use(
		middleware.RequireRole(
			userRolesService,
			"SUPER_ADMIN",
		),
	)

	campuses.RegisterRoutes(
		campusesGroup,
		campusHandler,
	)

	// ==========================================
	// SCHOOLS MODULE
	// ==========================================

	schoolsGroup := api.Group("/schools")

	schoolsGroup.Use(
		middleware.Auth(
			application.Config,
		),
	)

	schoolsGroup.Use(
		middleware.RequireRole(
			userRolesService,
			"SUPER_ADMIN",
		),
	)

	schools.RegisterRoutes(
		schoolsGroup,
		schoolHandler,
	)

	// ==========================================
	// DEPARTMENTS MODULE
	// ==========================================

	departmentsGroup := api.Group("/departments")

	departmentsGroup.Use(
		middleware.Auth(
			application.Config,
		),
	)

	departmentsGroup.Use(
		middleware.RequireRole(
			userRolesService,
			"SUPER_ADMIN",
		),
	)

	departments.RegisterRoutes(
		departmentsGroup,
		departmentHandler,
	)

	// ==========================================
	// PROGRAMS MODULE
	// ==========================================

	programsGroup := api.Group("/programs")

	programsGroup.Use(
		middleware.Auth(
			application.Config,
		),
	)

	programsGroup.Use(
		middleware.RequireRole(
			userRolesService,
			"SUPER_ADMIN",
		),
	)

	programs.RegisterRoutes(
		programsGroup,
		programHandler,
	)

	// ==========================================
	// ACADEMIC YEARS MODULE
	// ==========================================

	academicYearsGroup := api.Group("/academic-years")

	academicYearsGroup.Use(
		middleware.Auth(
			application.Config,
		),
	)

	academicYearsGroup.Use(
		middleware.RequireRole(
			userRolesService,
			"SUPER_ADMIN",
		),
	)

	// ==========================================
	// SEMESTERS MODULE
	// ==========================================

	semestersGroup := api.Group("/semesters")

	semestersGroup.Use(
		middleware.Auth(
			application.Config,
		),
	)

	semestersGroup.Use(
		middleware.RequireRole(
			userRolesService,
			"SUPER_ADMIN",
		),
	)

	semesters.RegisterRoutes(
		semestersGroup,
		semesterHandler,
	)

	academicyears.RegisterRoutes(
		academicYearsGroup,
		academicYearHandler,
	)
	// ==========================================
	// STUDENT MODULE
	// ==========================================

	studentsGroup := api.Group("/students")

	studentsGroup.Use(
		middleware.Auth(
			application.Config,
		),
	)

	studentsGroup.Use(
		middleware.RequireRole(
			userRolesService,
			"SUPER_ADMIN",
		),
	)

	students.RegisterRoutes(
		studentsGroup,
		studentHandler,
	)

	// ==========================================
	// STUDENT ENROLLMENT MODULE
	// ==========================================
	studentEnrollmentsGroup := api.Group(
		"/student-enrollments",
	)

	studentEnrollmentsGroup.Use(
		middleware.Auth(
			application.Config,
		),
	)

	studentEnrollmentsGroup.Use(
		middleware.RequireRole(
			userRolesService,
			"SUPER_ADMIN",
		),
	)

	studentenrollments.RegisterRoutes(
		studentEnrollmentsGroup,
		studentEnrollmentHandler,
	)
	// ==========================================
	// AUTH MODULE
	// ==========================================

	authService := auth.NewService(
		application.Config,
		userRepository,
		sessionRepository,
		auditService,
	)

	authHandler := auth.NewHandler(
		authService,
	)

	auth.RegisterRoutes(
		api.Group("/auth"),
		authHandler,
	)

	return router
}
