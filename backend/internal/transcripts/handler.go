package transcripts

import (
	"net/http"

	"aums/backend/pkg/response"
	aumsuuid "aums/backend/pkg/uuid"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

// GetTranscript godoc
// @Summary      Get Student Transcript
// @Description  Retrieve the complete structured academic transcript for a student
// @Tags         Transcripts
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        student_id  path      string  true  "Student Profile ID"
// @Success      200         {object}  response.SuccessResponse{data=TranscriptResponse}
// @Failure      400         {object}  response.ErrorResponse
// @Failure      401         {object}  response.ErrorResponse
// @Failure      404         {object}  response.ErrorResponse
// @Router       /transcripts/{student_id} [get]
func (h *Handler) GetTranscript(c *gin.Context) {
	studentID := c.Param("student_id")
	if studentID == "" {
		response.Error(c, http.StatusBadRequest, "student_id parameter is required")
		return
	}

	res, err := h.service.GetTranscript(c.Request.Context(), studentID)
	if err != nil {
		response.Error(c, http.StatusNotFound, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "transcript retrieved successfully", res)
}

// GetTranscriptSummary godoc
// @Summary      Get Transcript CGPA Summary
// @Description  Retrieve the overall CGPA, graduation standing, and credit summaries for a student
// @Tags         Transcripts
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        student_id  path      string  true  "Student Profile ID"
// @Success      200         {object}  response.SuccessResponse{data=TranscriptCGPASummary}
// @Failure      400         {object}  response.ErrorResponse
// @Failure      401         {object}  response.ErrorResponse
// @Failure      404         {object}  response.ErrorResponse
// @Router       /transcripts/{student_id}/summary [get]
func (h *Handler) GetTranscriptSummary(c *gin.Context) {
	studentID := c.Param("student_id")
	if studentID == "" {
		response.Error(c, http.StatusBadRequest, "student_id parameter is required")
		return
	}

	studentProfileID, err := aumsuuid.Parse(studentID)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "invalid student id")
		return
	}

	info, err := h.service.repository.GetStudentInfo(c.Request.Context(), studentProfileID)
	if err != nil {
		response.Error(c, http.StatusNotFound, err.Error())
		return
	}

	res, err := h.service.GetTranscriptSummary(c.Request.Context(), info.EnrollmentID.String())
	if err != nil {
		response.Error(c, http.StatusNotFound, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "transcript summary retrieved successfully", res)
}

// GetTranscriptSemesters godoc
// @Summary      Get Transcript Semesters Summary
// @Description  Retrieve a breakdown of semester-wise credit attempts and SGPA for a student
// @Tags         Transcripts
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        student_id  path      string  true  "Student Profile ID"
// @Success      200         {object}  response.SuccessResponse{data=[]TranscriptSemester}
// @Failure      400         {object}  response.ErrorResponse
// @Failure      401         {object}  response.ErrorResponse
// @Failure      404         {object}  response.ErrorResponse
// @Router       /transcripts/{student_id}/semesters [get]
func (h *Handler) GetTranscriptSemesters(c *gin.Context) {
	studentID := c.Param("student_id")
	if studentID == "" {
		response.Error(c, http.StatusBadRequest, "student_id parameter is required")
		return
	}

	studentProfileID, err := aumsuuid.Parse(studentID)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "invalid student id")
		return
	}

	info, err := h.service.repository.GetStudentInfo(c.Request.Context(), studentProfileID)
	if err != nil {
		response.Error(c, http.StatusNotFound, err.Error())
		return
	}

	res, err := h.service.GetTranscriptSemesters(c.Request.Context(), info.EnrollmentID.String())
	if err != nil {
		response.Error(c, http.StatusNotFound, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "semester summaries retrieved successfully", res)
}

// GetTranscriptCourses godoc
// @Summary      Get Transcript Course Results Breakdown
// @Description  Retrieve the complete detailed grade-wise breakdown of all courses taken by a student
// @Tags         Transcripts
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        student_id  path      string  true  "Student Profile ID"
// @Success      200         {object}  response.SuccessResponse{data=[]TranscriptCourse}
// @Failure      400         {object}  response.ErrorResponse
// @Failure      401         {object}  response.ErrorResponse
// @Failure      404         {object}  response.ErrorResponse
// @Router       /transcripts/{student_id}/courses [get]
func (h *Handler) GetTranscriptCourses(c *gin.Context) {
	studentID := c.Param("student_id")
	if studentID == "" {
		response.Error(c, http.StatusBadRequest, "student_id parameter is required")
		return
	}

	studentProfileID, err := aumsuuid.Parse(studentID)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "invalid student id")
		return
	}

	info, err := h.service.repository.GetStudentInfo(c.Request.Context(), studentProfileID)
	if err != nil {
		response.Error(c, http.StatusNotFound, err.Error())
		return
	}

	res, err := h.service.GetTranscriptCourses(c.Request.Context(), info.EnrollmentID.String())
	if err != nil {
		response.Error(c, http.StatusNotFound, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "course breakdowns retrieved successfully", res)
}
