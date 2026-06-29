package users

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"aums/backend/pkg/response"
	"aums/backend/pkg/validator"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

// ListUsers godoc
// @Summary      List Users
// @Description  Retrieve a paginated list of users
// @Tags         Users
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page   query      int  false  "Page number"   default(1)
// @Param        limit  query      int  false  "Page size"     default(20)
// @Success      200    {object}   response.SuccessResponse{data=[]UserResponse}
// @Failure      400    {object}   response.ErrorResponse
// @Failure      401    {object}   response.ErrorResponse
// @Failure      500    {object}   response.ErrorResponse
// @Router       /users [get]
func (h *Handler) ListUsers(c *gin.Context) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)
	offset := (page - 1) * limit

	users, err := h.service.List(
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

	response.SuccessWithMeta(
		c,
		http.StatusOK,
		"users retrieved successfully",
		ToResponses(users),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
		},
	)
}

// CreateUser godoc
// @Summary      Create User
// @Description  Create a new user profile
// @Tags         Users
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateUserRequest  true  "Create User Payload"
// @Success      201     {object}  response.SuccessResponse{data=UserResponse}
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Failure      500     {object}  response.ErrorResponse
// @Router       /users [post]
func (h *Handler) CreateUser(
	c *gin.Context,
) {

	var req CreateUserRequest

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

	user, err := h.service.Create(
		c.Request.Context(),
		req,
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
		http.StatusCreated,
		"user created successfully",
		ToResponse(user),
	)
}
