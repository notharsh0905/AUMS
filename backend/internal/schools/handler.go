package schools

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

// ListSchools godoc
// @Summary      List Schools
// @Description  Retrieve a paginated list of schools
// @Tags         Schools
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page   query      int  false  "Page number"   default(1)
// @Param        limit  query      int  false  "Page size"     default(20)
// @Success      200    {object}   response.SuccessResponse{data=[]SchoolResponse}
// @Failure      400    {object}   response.ErrorResponse
// @Failure      401    {object}   response.ErrorResponse
// @Failure      500    {object}   response.ErrorResponse
// @Router       /schools [get]
func (h *Handler) ListSchools(
	c *gin.Context,
) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)

	offset := (page - 1) * limit

	schools, err := h.service.ListPaginated(
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
		"schools fetched successfully",
		ToResponses(schools),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

// CreateSchool godoc
// @Summary      Create School
// @Description  Create a new school profile
// @Tags         Schools
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateSchoolRequest  true  "Create School Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /schools [post]
func (h *Handler) CreateSchool(
	c *gin.Context,
) {

	var req CreateSchoolRequest

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
		"school created successfully",
		nil,
	)
}

func ToResponse(school generated.School) SchoolResponse {
	return SchoolResponse{
		SchoolID:    school.SchoolID.String(),
		SchoolCode:  school.SchoolCode,
		SchoolName:  school.SchoolName,
		Description: school.Description.String,
	}
}

func ToResponses(schools []generated.School) []SchoolResponse {
	res := make([]SchoolResponse, 0, len(schools))
	for _, s := range schools {
		res = append(res, ToResponse(s))
	}
	return res
}
