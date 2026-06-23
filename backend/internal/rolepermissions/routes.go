package rolepermissions

import "github.com/gin-gonic/gin"

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
) {

	router.GET(
		"",
		handler.GetRolePermissions,
	)

	router.POST(
		"",
		handler.AssignPermissionToRole,
	)
}
