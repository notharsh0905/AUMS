package transcripts

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
		"/:student_id",
		middleware.RequirePermission(
			rolePermissionService,
			"transcripts.read",
		),
		handler.GetTranscript,
	)

	router.GET(
		"/:student_id/summary",
		middleware.RequirePermission(
			rolePermissionService,
			"transcripts.read",
		),
		handler.GetTranscriptSummary,
	)

	router.GET(
		"/:student_id/semesters",
		middleware.RequirePermission(
			rolePermissionService,
			"transcripts.read",
		),
		handler.GetTranscriptSemesters,
	)

	router.GET(
		"/:student_id/courses",
		middleware.RequirePermission(
			rolePermissionService,
			"transcripts.read",
		),
		handler.GetTranscriptCourses,
	)
}
