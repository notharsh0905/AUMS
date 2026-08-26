package assignmentsubmissions

import (
	"aums/backend/internal/middleware"
	"aums/backend/internal/rolepermissions"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
	rolePermissionService *rolepermissions.Service,
) {

	router.GET(
		"",
		handler.List,
	)

	router.POST(
		"",
		handler.Create,
	)

	router.GET(
		"/grades",
		middleware.RequirePermission(
			rolePermissionService,
			"grades.read",
		),
		handler.ListGrades,
	)

	router.GET(
		"/:id/grade",
		middleware.RequirePermission(
			rolePermissionService,
			"grades.read",
		),
		handler.GetGrade,
	)

	router.PUT(
		"/:id/grade",
		middleware.RequirePermission(
			rolePermissionService,
			"grades.create",
		),
		handler.Grade,
	)
}
