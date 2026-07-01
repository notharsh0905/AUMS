package examattempts

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
			"exam_attempts.read",
		),
		handler.List,
	)

	router.GET(
		"/:id",
		middleware.RequirePermission(
			rolePermissionService,
			"exam_attempts.read",
		),
		handler.Get,
	)

	router.POST(
		"",
		middleware.RequirePermission(
			rolePermissionService,
			"exam_attempts.create",
		),
		handler.Create,
	)

	router.PUT(
		"/:id",
		middleware.RequirePermission(
			rolePermissionService,
			"exam_attempts.update",
		),
		handler.Update,
	)

	router.DELETE(
		"/:id",
		middleware.RequirePermission(
			rolePermissionService,
			"exam_attempts.delete",
		),
		handler.Delete,
	)
}
