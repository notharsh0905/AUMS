package students

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
			"student.read",
		),
		handler.ListStudents,
	)

	router.POST(
		"",
		middleware.RequirePermission(
			rolePermissionService,
			"student.create",
		),
		handler.CreateStudent,
	)
}
