package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"aums/backend/pkg/response"
	"aums/backend/pkg/validator"
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

// Login godoc
// @Summary      User Login
// @Description  Authenticate user credentials and return access and refresh tokens
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        request body      LoginRequest  true  "Login Credentials"
// @Success      200     {object}  response.SuccessResponse{data=LoginResponse}
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /auth/login [post]
func (h *Handler) Login(
	c *gin.Context,
) {

	var req LoginRequest

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

	req.IPAddress = c.ClientIP()

	req.UserAgent = c.Request.UserAgent()

	resp, err := h.service.Login(
		c.Request.Context(),
		req,
	)

	if err != nil {

		response.Error(
			c,
			http.StatusUnauthorized,
			err.Error(),
		)

		return
	}

	response.Success(
		c,
		http.StatusOK,
		"logged in successfully",
		resp,
	)
}

// Refresh godoc
// @Summary      Refresh Access Token
// @Description  Generate a new access token using a valid refresh token
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        request body      RefreshRequest  true  "Refresh Token Payload"
// @Success      200     {object}  response.SuccessResponse{data=RefreshResponse}
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /auth/refresh [post]
func (h *Handler) Refresh(
	c *gin.Context,
) {

	var req RefreshRequest

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

	resp, err := h.service.Refresh(
		c.Request.Context(),
		req,
	)

	if err != nil {

		response.Error(
			c,
			http.StatusUnauthorized,
			err.Error(),
		)

		return
	}

	response.Success(
		c,
		http.StatusOK,
		"token refreshed successfully",
		resp,
	)
}

// Logout godoc
// @Summary      User Logout
// @Description  Invalidate the user's refresh token and log them out
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      LogoutRequest  true  "Logout Payload"
// @Success      200     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Router       /auth/logout [post]
func (h *Handler) Logout(
	c *gin.Context,
) {

	var req LogoutRequest

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

	err := h.service.Logout(
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
		http.StatusOK,
		"logged out successfully",
		nil,
	)
}
