package examschedules

import "github.com/gin-gonic/gin"

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
) {

	router.GET(
		"",
		handler.List,
	)

	router.POST(
		"",
		handler.Create,
	)
}
