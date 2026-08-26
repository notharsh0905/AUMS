package assignmentsubmissions

import (
	"net/http"

	"aums/backend/pkg/response"
	"aums/backend/pkg/validator"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(
	service *Service,
) *Handler {

	return &Handler{
		service: service,
	}
}

// List godoc
// @Summary      List Assignment Submissions
// @Description  Retrieve a paginated list of assignment submissions
// @Tags         Assignment Submissions
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page   query      int  false  "Page number"   default(1)
// @Param        limit  query      int  false  "Page size"     default(20)
// @Success      200    {object}   response.SuccessResponse
// @Failure      400    {object}   response.ErrorResponse
// @Failure      401    {object}   response.ErrorResponse
// @Failure      500    {object}   response.ErrorResponse
// @Router       /assignment-submissions [get]
func (h *Handler) List(
	c *gin.Context,
) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)

	data, err := h.service.List(
		c.Request.Context(),
	)

	if err != nil {

		response.Error(
			c,
			http.StatusInternalServerError,
			err.Error(),
		)

		return
	}

	start := (page - 1) * limit
	if start > len(data) {
		start = len(data)
	}

	end := start + limit
	if end > len(data) {
		end = len(data)
	}

	paginatedData := data[start:end]

	response.SuccessWithMeta(
		c,
		http.StatusOK,
		"assignment submissions fetched successfully",
		paginatedData,
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: len(data),
		},
	)
}

// Create godoc
// @Summary      Create Assignment Submission
// @Description  Submit an assignment for grading
// @Tags         Assignment Submissions
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateAssignmentSubmissionRequest  true  "Create Submission Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /assignment-submissions [post]
func (h *Handler) Create(
	c *gin.Context,
) {

	var req CreateAssignmentSubmissionRequest

	if err := c.ShouldBindJSON(&req); err != nil {

		response.ValidationError(
			c,
			validator.FormatErrors(err),
		)

		return
	}

	if err := validator.Validate.Struct(req); err != nil {

		response.ValidationError(
			c,
			validator.FormatErrors(err),
		)

		return
	}

	err := h.service.Create(
		c.Request.Context(),
		req,
	)

	if err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	response.Success(
		c,
		http.StatusCreated,
		"assignment submission created successfully",
		nil,
	)
}

// Grade godoc
// @Summary      Grade Assignment Submission
// @Description  Record marks and feedback for a student assignment submission
// @Tags         Assignment Submissions
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id      path      string                            true  "Assignment Submission ID"
// @Param        request body      GradeAssignmentSubmissionRequest  true  "Grade Submission Payload"
// @Success      200     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Failure      403     {object}  response.ErrorResponse
// @Router       /assignment-submissions/{id}/grade [put]
func (h *Handler) Grade(
	c *gin.Context,
) {

	submissionID := c.Param("id")
	if submissionID == "" {
		response.Error(
			c,
			http.StatusBadRequest,
			"submission id is required",
		)
		return
	}

	callerUserID := c.GetString("user_id")
	if callerUserID == "" {
		response.Error(
			c,
			http.StatusUnauthorized,
			"unauthenticated user",
		)
		return
	}

	var req GradeAssignmentSubmissionRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(
			c,
			validator.FormatErrors(err),
		)
		return
	}

	if err := validator.Validate.Struct(req); err != nil {
		response.ValidationError(
			c,
			validator.FormatErrors(err),
		)
		return
	}

	err := h.service.Grade(
		c.Request.Context(),
		submissionID,
		callerUserID,
		req,
	)

	if err != nil {
		status := http.StatusBadRequest
		if err.Error() == "forbidden: faculty can only grade assignments allocated to them" ||
			err.Error() == "unauthorized: caller is not a registered faculty member" {
			status = http.StatusForbidden
		}

		response.Error(
			c,
			status,
			err.Error(),
		)
		return
	}

	response.Success(
		c,
		http.StatusOK,
		"assignment submission graded successfully",
		nil,
	)
}

// GetGrade godoc
// @Summary      Get Submission Grade
// @Description  Retrieve grade and feedback for an assignment submission
// @Tags         Assignment Submissions
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Assignment Submission ID"
// @Success      200  {object}  response.SuccessResponse
// @Failure      400  {object}  response.ErrorResponse
// @Failure      404  {object}  response.ErrorResponse
// @Router       /assignment-submissions/{id}/grade [get]
func (h *Handler) GetGrade(
	c *gin.Context,
) {

	submissionID := c.Param("id")
	if submissionID == "" {
		response.Error(
			c,
			http.StatusBadRequest,
			"submission id is required",
		)
		return
	}

	grade, err := h.service.GetGrade(
		c.Request.Context(),
		submissionID,
	)

	if err != nil {
		response.Error(
			c,
			http.StatusNotFound,
			"grade not found for this submission",
		)
		return
	}

	response.Success(
		c,
		http.StatusOK,
		"assignment submission grade fetched successfully",
		grade,
	)
}

// ListGrades godoc
// @Summary      List All Assignment Grades
// @Description  Retrieve all assignment grades
// @Tags         Assignment Submissions
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  response.SuccessResponse
// @Failure      500  {object}  response.ErrorResponse
// @Router       /assignment-submissions/grades [get]
func (h *Handler) ListGrades(
	c *gin.Context,
) {

	grades, err := h.service.ListGrades(
		c.Request.Context(),
	)

	if err != nil {
		response.Error(
			c,
			http.StatusInternalServerError,
			err.Error(),
		)
		return
	}

	response.Success(
		c,
		http.StatusOK,
		"assignment grades fetched successfully",
		grades,
	)
}
