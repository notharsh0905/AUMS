package courseresults

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
		middleware.RequirePermission(
			rolePermissionService,
			"course_results.read",
		),
		handler.List,
	)

	router.GET(
		"/:id",
		middleware.RequirePermission(
			rolePermissionService,
			"course_results.read",
		),
		handler.Get,
	)

	router.POST(
		"",
		middleware.RequirePermission(
			rolePermissionService,
			"course_results.create",
		),
		handler.Create,
	)

	router.PUT(
		"/:id",
		middleware.RequirePermission(
			rolePermissionService,
			"course_results.update",
		),
		handler.Update,
	)

	router.DELETE(
		"/:id",
		middleware.RequirePermission(
			rolePermissionService,
			"course_results.delete",
		),
		handler.Delete,
	)
}
