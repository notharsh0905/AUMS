package server

import (
	"net/http"

	"aums/backend/internal/auth"
	"aums/backend/internal/middleware"
	"aums/backend/internal/permissions"
	"aums/backend/internal/roles"
	"aums/backend/internal/sessions"
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
	// AUTH MODULE
	// ==========================================

	authService := auth.NewService(
		application.Config,
		userRepository,
		sessionRepository,
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
