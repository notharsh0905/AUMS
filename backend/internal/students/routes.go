package students

import "github.com/gin-gonic/gin"

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
) {

	router.GET(
		"",
		handler.ListStudents,
	)

	router.POST(
		"",
		handler.CreateStudent,
	)
}
