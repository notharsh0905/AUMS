package parents

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
		"/me",
		middleware.RequirePermission(
			rolePermissionService,
			"parent_portal.access",
		),
		handler.GetProfile,
	)

	router.GET(
		"/wards",
		middleware.RequirePermission(
			rolePermissionService,
			"parent_portal.access",
		),
		handler.ListWards,
	)
}
