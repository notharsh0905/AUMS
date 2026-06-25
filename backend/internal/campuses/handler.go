package campuses

import (
	"aums/backend/pkg/response"
	"aums/backend/pkg/validator"
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

func (h *Handler) ListCampuses(
	c *gin.Context,
) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)

	offset := (page - 1) * limit

	campuses, err := h.service.ListPaginated(
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
		"campuses fetched successfully",
		campuses,
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

func (h *Handler) CreateCampus(
	c *gin.Context,
) {

	var req CreateCampusRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		if err := validator.Validate.Struct(req); err != nil {

			response.ValidationError(
				c,
				validator.FormatErrors(err),
			)

			return
		}

		response.Error(
			c,
			http.StatusBadRequest,
			err.Error(),
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
		"campus created successfully",
		nil,
	)
}
