package courses

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
// @Summary      List Courses
// @Description  Retrieve a paginated list of courses
// @Tags         Courses
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page   query      int  false  "Page number"   default(1)
// @Param        limit  query      int  false  "Page size"     default(20)
// @Success      200    {object}   response.SuccessResponse
// @Failure      400    {object}   response.ErrorResponse
// @Failure      401    {object}   response.ErrorResponse
// @Failure      500    {object}   response.ErrorResponse
// @Router       /courses [get]
func (h *Handler) List(
	c *gin.Context,
) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)

	offset := (page - 1) * limit

	courses, err := h.service.ListPaginated(
		c.Request.Context(),
		int32(limit),
		int32(offset),
	)

	if err != nil {

		response.Error(
			c,
			http.StatusInternalServerError,
			err.Error(),
		)

		return
	}

	total, err := h.service.Count(
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

	response.SuccessWithMeta(
		c,
		http.StatusOK,
		"courses fetched successfully",
		courses,
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

// Create godoc
// @Summary      Create Course
// @Description  Create a new course profile
// @Tags         Courses
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateCourseRequest  true  "Create Course Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /courses [post]
func (h *Handler) Create(
	c *gin.Context,
) {

	var req CreateCourseRequest

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
		"course created successfully",
		nil,
	)
}
