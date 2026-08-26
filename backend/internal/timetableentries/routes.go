package timetableentries

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
		middleware.RequirePermission(
			rolePermissionService,
			"timetable_entries.create",
		),
		handler.Create,
	)

	router.DELETE(
		"/:id",
		middleware.RequirePermission(
			rolePermissionService,
			"timetable_entries.delete",
		),
		handler.Delete,
	)
}
