package academicyears

import "github.com/gin-gonic/gin"

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
) {

	router.GET(
		"",
		handler.ListAcademicYears,
	)

	router.POST(
		"",
		handler.CreateAcademicYear,
	)
}
