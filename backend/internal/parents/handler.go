package parents

import (
	"net/http"

	"aums/backend/internal/middleware"
	"aums/backend/pkg/response"
	aumsuuid "aums/backend/pkg/uuid"

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

// GetProfile godoc
// @Summary      Get Parent Profile
// @Tags         Parents
// @Produce      json
// @Security     BearerAuth
// @Router       /parents/me [get]
func (h *Handler) GetProfile(
	c *gin.Context,
) {

	userIDString := middleware.GetUserID(c)
	callerUserID, err := aumsuuid.Parse(userIDString)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "invalid user id")
		return
	}

	profile, err := h.service.GetProfile(c.Request.Context(), callerUserID)
	if err != nil {
		response.Error(c, http.StatusNotFound, "parent profile not found")
		return
	}

	response.Success(c, http.StatusOK, "parent profile fetched successfully", profile)
}

// ListWards godoc
// @Summary      List Linked Wards / Children
// @Tags         Parents
// @Produce      json
// @Security     BearerAuth
// @Router       /parents/wards [get]
func (h *Handler) ListWards(
	c *gin.Context,
) {

	userIDString := middleware.GetUserID(c)
	callerUserID, err := aumsuuid.Parse(userIDString)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "invalid user id")
		return
	}

	wards, err := h.service.ListWards(c.Request.Context(), callerUserID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "parent wards fetched successfully", wards)
}
