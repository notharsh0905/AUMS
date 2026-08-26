package analytics

import (
	"errors"
	"net/http"

	"aums/backend/internal/middleware"
	"aums/backend/pkg/response"
	uuidpkg "aums/backend/pkg/uuid"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetDashboardAnalytics(c *gin.Context) {
	userIDStr := middleware.GetUserID(c)
	userID, err := uuidpkg.Parse(userIDStr)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "invalid user id")
		return
	}

	analytics, err := h.service.GetDashboardAnalytics(c.Request.Context(), userID)
	if err != nil {
		if errors.Is(err, ErrForbidden) {
			response.Error(c, http.StatusForbidden, "insufficient permissions to access dashboard analytics")
			return
		}
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "dashboard analytics fetched successfully", analytics)
}
