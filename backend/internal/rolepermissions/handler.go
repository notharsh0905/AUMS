package rolepermissions

import (
	"net/http"

	"aums/backend/internal/middleware"

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

func (h *Handler) GetRolePermissions(
	c *gin.Context,
) {

	roleID, err := middleware.ParseUUID(
		c.Param("id"),
	)

	if err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "invalid role id",
			},
		)

		return
	}

	permissions, err := h.service.GetRolePermissions(
		c.Request.Context(),
		roleID,
	)

	if err != nil {

		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)

		return
	}

	c.JSON(
		http.StatusOK,
		permissions,
	)
}

func (h *Handler) AssignPermissionToRole(
	c *gin.Context,
) {

	roleID, err := middleware.ParseUUID(
		c.Param("id"),
	)

	if err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "invalid role id",
			},
		)

		return
	}

	var request AssignPermissionRequest

	if err := c.ShouldBindJSON(&request); err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
		)

		return
	}

	permissionID, err := middleware.ParseUUID(
		request.PermissionID,
	)

	if err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "invalid permission id",
			},
		)

		return
	}

	err = h.service.AssignPermissionToRole(
		c.Request.Context(),
		roleID,
		permissionID,
	)

	if err != nil {

		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)

		return
	}

	c.Status(
		http.StatusNoContent,
	)
}
