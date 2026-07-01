package examrooms

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
			"exam_rooms.read",
		),
		handler.ListExamRooms,
	)

	router.GET(
		"/:id",
		middleware.RequirePermission(
			rolePermissionService,
			"exam_rooms.read",
		),
		handler.GetExamRoom,
	)

	router.POST(
		"",
		middleware.RequirePermission(
			rolePermissionService,
			"exam_rooms.create",
		),
		handler.CreateExamRoom,
	)

	router.PUT(
		"/:id",
		middleware.RequirePermission(
			rolePermissionService,
			"exam_rooms.update",
		),
		handler.UpdateExamRoom,
	)

	router.DELETE(
		"/:id",
		middleware.RequirePermission(
			rolePermissionService,
			"exam_rooms.delete",
		),
		handler.DeleteExamRoom,
	)
}
