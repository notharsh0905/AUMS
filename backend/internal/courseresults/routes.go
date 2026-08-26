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
		middleware.RequireAnyPermission(
			rolePermissionService,
			"results.read",
			"grades.read",
			"course_results.read",
			"academic_records.read",
		),
		handler.List,
	)

	router.GET(
		"/:id",
		middleware.RequireAnyPermission(
			rolePermissionService,
			"results.read",
			"grades.read",
			"course_results.read",
			"academic_records.read",
		),
		handler.Get,
	)

	router.POST(
		"",
		middleware.RequireAnyPermission(
			rolePermissionService,
			"results.create",
			"grades.create",
			"course_results.create",
		),
		handler.Create,
	)

	router.PUT(
		"/:id",
		middleware.RequireAnyPermission(
			rolePermissionService,
			"results.update",
			"grades.update",
			"course_results.update",
		),
		handler.Update,
	)

	router.DELETE(
		"/:id",
		middleware.RequireAnyPermission(
			rolePermissionService,
			"results.delete",
			"grades.delete",
			"course_results.delete",
		),
		handler.Delete,
	)
}
