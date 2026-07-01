package examregistrations

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
			"exam_registrations.read",
		),
		handler.List,
	)

	router.GET(
		"/:id",
		middleware.RequirePermission(
			rolePermissionService,
			"exam_registrations.read",
		),
		handler.Get,
	)

	router.POST(
		"",
		middleware.RequirePermission(
			rolePermissionService,
			"exam_registrations.create",
		),
		handler.Create,
	)

	router.PUT(
		"/:id",
		middleware.RequirePermission(
			rolePermissionService,
			"exam_registrations.update",
		),
		handler.Update,
	)

	router.DELETE(
		"/:id",
		middleware.RequirePermission(
			rolePermissionService,
			"exam_registrations.delete",
		),
		handler.Delete,
	)
}
