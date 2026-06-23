package departments

import "github.com/gin-gonic/gin"

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
) {

	router.GET(
		"",
		handler.ListDepartments,
	)

	router.POST(
		"",
		handler.CreateDepartment,
	)
}
