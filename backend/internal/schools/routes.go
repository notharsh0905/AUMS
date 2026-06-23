package schools

import "github.com/gin-gonic/gin"

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
) {

	router.GET(
		"",
		handler.ListSchools,
	)

	router.POST(
		"",
		handler.CreateSchool,
	)
}
