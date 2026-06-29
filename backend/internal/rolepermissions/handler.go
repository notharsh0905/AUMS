package rolepermissions

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"aums/backend/pkg/response"
	uuidpkg "aums/backend/pkg/uuid"
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

// GetRolePermissions godoc
// @Summary      Get Role Permissions
// @Description  Retrieve permissions assigned to a specific role
// @Tags         Roles
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Role ID"
// @Success      200  {object}  response.SuccessResponse
// @Failure      400  {object}  response.ErrorResponse
// @Failure      401  {object}  response.ErrorResponse
// @Failure      500  {object}  response.ErrorResponse
// @Router       /roles/{id}/permissions [get]
func (h *Handler) GetRolePermissions(
	c *gin.Context,
) {

	roleID, err := uuidpkg.Parse(
		c.Param("id"),
	)

	if err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			"invalid role id",
		)

		return
	}

	permissions, err := h.service.GetRolePermissions(
		c.Request.Context(),
		roleID,
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
		"role permissions fetched successfully",
		permissions,
	)
}

// AssignPermissionToRole godoc
// @Summary      Assign Permission to Role
// @Description  Assign a permission to a role
// @Tags         Roles
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id       path      string                   true  "Role ID"
// @Param        request  body      AssignPermissionRequest  true  "Assign Permission Payload"
// @Success      204      {object}  response.SuccessResponse
// @Failure      400      {object}  response.ErrorResponse
// @Failure      401      {object}  response.ErrorResponse
// @Failure      500      {object}  response.ErrorResponse
// @Router       /roles/{id}/permissions [post]
func (h *Handler) AssignPermissionToRole(
	c *gin.Context,
) {

	roleID, err := uuidpkg.Parse(
		c.Param("id"),
	)

	if err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			"invalid role id",
		)

		return
	}

	var request AssignPermissionRequest

	if err := c.ShouldBindJSON(&request); err != nil {

		response.ValidationError(
			c,
			validator.FormatErrors(err),
		)

		return
	}

	if err := validator.Validate.Struct(request); err != nil {

		response.ValidationError(
			c,
			validator.FormatErrors(err),
		)

		return
	}

	permissionID, err := uuidpkg.Parse(
		request.PermissionID,
	)

	if err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			"invalid permission id",
		)

		return
	}

	err = h.service.AssignPermissionToRole(
		c.Request.Context(),
		roleID,
		permissionID,
	)

	if err != nil {

		response.Error(
			c,
			http.StatusInternalServerError,
			err.Error(),
		)

		return
	}

	c.Status(
		http.StatusNoContent,
	)
}

// RemovePermissionFromRole godoc
// @Summary      Remove Permission from Role
// @Description  Remove a permission from a role
// @Tags         Roles
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id            path      string  true  "Role ID"
// @Param        permissionId  path      string  true  "Permission ID"
// @Success      204           {object}  response.SuccessResponse
// @Failure      400           {object}  response.ErrorResponse
// @Failure      401           {object}  response.ErrorResponse
// @Failure      500           {object}  response.ErrorResponse
// @Router       /roles/{id}/permissions/{permissionId} [delete]
func (h *Handler) RemovePermissionFromRole(
	c *gin.Context,
) {

	roleID, err := uuidpkg.Parse(
		c.Param("id"),
	)

	if err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			"invalid role id",
		)

		return
	}

	permissionID, err := uuidpkg.Parse(
		c.Param("permissionId"),
	)

	if err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			"invalid permission id",
		)

		return
	}

	err = h.service.RemovePermissionFromRole(
		c.Request.Context(),
		roleID,
		permissionID,
	)

	if err != nil {

		response.Error(
			c,
			http.StatusInternalServerError,
			err.Error(),
		)

		return
	}

	c.Status(
		http.StatusNoContent,
	)
}
