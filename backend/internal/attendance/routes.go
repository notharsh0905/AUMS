package attendance

import (
	"aums/backend/internal/middleware"
	"aums/backend/internal/rolepermissions"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
	rolePermissionsService *rolepermissions.Service,
) {

	router.GET(
		"",
		handler.List,
	)

	router.POST(
		"",
		middleware.RequirePermission(
			rolePermissionsService,
			"attendance.create",
		),
		handler.Create,
	)

	router.POST(
		"/bulk",
		middleware.RequirePermission(
			rolePermissionsService,
			"attendance.create",
		),
		handler.BulkCreate,
	)
}
