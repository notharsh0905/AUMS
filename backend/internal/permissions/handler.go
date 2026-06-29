package permissions

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"aums/backend/internal/db/generated"
	"aums/backend/pkg/response"
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

// ListPermissions godoc
// @Summary      List Permissions
// @Description  Retrieve a paginated list of user permissions
// @Tags         Permissions
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page   query      int  false  "Page number"   default(1)
// @Param        limit  query      int  false  "Page size"     default(20)
// @Success      200    {object}   response.SuccessResponse{data=[]PermissionResponse}
// @Failure      400    {object}   response.ErrorResponse
// @Failure      401    {object}   response.ErrorResponse
// @Failure      500    {object}   response.ErrorResponse
// @Router       /permissions [get]
func (h *Handler) ListPermissions(
	c *gin.Context,
) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)

	permissions, err := h.service.List(
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
	if start > len(permissions) {
		start = len(permissions)
	}

	end := start + limit
	if end > len(permissions) {
		end = len(permissions)
	}

	paginatedPermissions := permissions[start:end]

	response.SuccessWithMeta(
		c,
		http.StatusOK,
		"permissions retrieved successfully",
		ToResponses(paginatedPermissions),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: len(permissions),
		},
	)
}

func ToResponse(permission generated.Permission) PermissionResponse {
	return PermissionResponse{
		PermissionID:   permission.PermissionID.String(),
		PermissionCode: permission.PermissionCode,
		PermissionName: permission.PermissionName,
		Description:    permission.Description.String,
	}
}

func ToResponses(permissions []generated.Permission) []PermissionResponse {
	res := make([]PermissionResponse, 0, len(permissions))
	for _, p := range permissions {
		res = append(res, ToResponse(p))
	}
	return res
}
