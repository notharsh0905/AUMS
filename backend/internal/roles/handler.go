package roles

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

// ListRoles godoc
// @Summary      List Roles
// @Description  Retrieve a paginated list of user roles
// @Tags         Roles
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page   query      int  false  "Page number"   default(1)
// @Param        limit  query      int  false  "Page size"     default(20)
// @Success      200    {object}   response.SuccessResponse{data=[]RoleResponse}
// @Failure      400    {object}   response.ErrorResponse
// @Failure      401    {object}   response.ErrorResponse
// @Failure      500    {object}   response.ErrorResponse
// @Router       /roles [get]
func (h *Handler) ListRoles(
	c *gin.Context,
) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)

	roles, err := h.service.List(
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
	if start > len(roles) {
		start = len(roles)
	}

	end := start + limit
	if end > len(roles) {
		end = len(roles)
	}

	paginatedRoles := roles[start:end]

	response.SuccessWithMeta(
		c,
		http.StatusOK,
		"roles retrieved successfully",
		ToResponses(paginatedRoles),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: len(roles),
		},
	)
}

func ToResponse(role generated.Role) RoleResponse {
	return RoleResponse{
		RoleID:      role.RoleID.String(),
		RoleCode:    role.RoleCode,
		RoleName:    role.RoleName,
		Description: role.Description.String,
	}
}

func ToResponses(roles []generated.Role) []RoleResponse {
	res := make([]RoleResponse, 0, len(roles))
	for _, role := range roles {
		res = append(res, ToResponse(role))
	}
	return res
}
