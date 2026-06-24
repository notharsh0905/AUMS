package students

import (
	"aums/backend/pkg/response"
	"net/http"

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

// ListStudents godoc
//
// @Summary List students
// @Description Get paginated list of students
// @Tags Students
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page Number"
// @Param limit query int false "Page Size"
// @Success 200 {object} response.SuccessResponse
// @Failure 401 {object response.ErrorResponse
// @Failure 403 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /students [get]

func (h *Handler) ListStudents(
	c *gin.Context,
) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)

	students, total, err := h.service.ListPaginated(
		c.Request.Context(),
		page,
		limit,
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
		"students fetched successfully",
		students,
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

// CreateStudent godoc
//
// @Summary Create student
// @Description Create a new student profile
// @Tags Students
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body CreateStudentRequest true "Student Payload"
// @Success 201 {object} response.SuccessResponse
// @Failure 400 {object} response.ErrorResponse
// @Failure 401 {object} response.ErrorResponse
// @Failure 403 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /students [post]
func (h *Handler) CreateStudent(
	c *gin.Context,
) {

	var req CreateStudentRequest

	if err := c.ShouldBindJSON(&req); err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
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
		"student created successfully",
		nil,
	)
}
