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
