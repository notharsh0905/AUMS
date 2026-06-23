package studentenrollments

import "github.com/gin-gonic/gin"

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
) {

	router.GET(
		"",
		handler.ListStudentEnrollments,
	)

	router.POST(
		"",
		handler.CreateStudentEnrollment,
	)
}
