package server

import (
	"net/http"

	"aums/backend/internal/auth"
	"aums/backend/internal/sessions"
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

	// ==========================================
	// USERS MODULE
	// ==========================================

	userService := users.NewService(
		userRepository,
	)

	userHandler := users.NewHandler(
		userService,
	)

	users.RegisterRoutes(
		api.Group("/users"),
		userHandler,
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
