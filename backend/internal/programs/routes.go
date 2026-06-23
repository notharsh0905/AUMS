package programs

import "github.com/gin-gonic/gin"

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
) {

	router.GET(
		"",
		handler.ListPrograms,
	)

	router.POST(
		"",
		handler.CreateProgram,
	)
}
