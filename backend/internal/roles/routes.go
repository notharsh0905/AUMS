package roles

import (
	"aums/backend/internal/rolepermissions"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
	rolePermissionsHandler *rolepermissions.Handler,
) {

	router.GET(
		"",
		handler.ListRoles,
	)

	router.GET(
		"/:id/permissions",
		rolePermissionsHandler.GetRolePermissions,
	)

	router.POST(
		"/:id/permissions",
		rolePermissionsHandler.AssignPermissionToRole,
	)

	router.DELETE(
		"/:id/permissions/:permissionId",
		rolePermissionsHandler.RemovePermissionFromRole,
	)
}
