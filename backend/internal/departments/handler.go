package departments

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"aums/backend/internal/db/generated"
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

// ListDepartments godoc
// @Summary      List Departments
// @Description  Retrieve a paginated list of departments
// @Tags         Departments
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page   query      int  false  "Page number"   default(1)
// @Param        limit  query      int  false  "Page size"     default(20)
// @Success      200    {object}   response.SuccessResponse{data=[]DepartmentResponse}
// @Failure      400    {object}   response.ErrorResponse
// @Failure      401    {object}   response.ErrorResponse
// @Failure      500    {object}   response.ErrorResponse
// @Router       /departments [get]
func (h *Handler) ListDepartments(
	c *gin.Context,
) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)

	offset := (page - 1) * limit

	departments, err := h.service.ListPaginated(
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
		"departments fetched successfully",
		ToResponses(departments),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

// CreateDepartment godoc
// @Summary      Create Department
// @Description  Create a new department profile
// @Tags         Departments
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateDepartmentRequest  true  "Create Department Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /departments [post]
func (h *Handler) CreateDepartment(
	c *gin.Context,
) {

	var req CreateDepartmentRequest

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
		"department created successfully",
		nil,
	)
}

func ToResponse(dept generated.Department) DepartmentResponse {
	return DepartmentResponse{
		DepartmentID:   dept.DepartmentID.String(),
		SchoolID:       dept.SchoolID.String(),
		DepartmentCode: dept.DepartmentCode,
		DepartmentName: dept.DepartmentName,
		Description:    dept.Description.String,
	}
}

func ToResponses(depts []generated.Department) []DepartmentResponse {
	res := make([]DepartmentResponse, 0, len(depts))
	for _, d := range depts {
		res = append(res, ToResponse(d))
	}
	return res
}
