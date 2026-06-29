package academicyears

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

// ListAcademicYears godoc
// @Summary      List Academic Years
// @Description  Retrieve a paginated list of academic years
// @Tags         Academic Years
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page   query      int  false  "Page number"   default(1)
// @Param        limit  query      int  false  "Page size"     default(20)
// @Success      200    {object}   response.SuccessResponse{data=[]AcademicYearResponse}
// @Failure      400    {object}   response.ErrorResponse
// @Failure      401    {object}   response.ErrorResponse
// @Failure      500    {object}   response.ErrorResponse
// @Router       /academic-years [get]
func (h *Handler) ListAcademicYears(
	c *gin.Context,
) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)

	years, total, err := h.service.ListPaginated(
		c.Request.Context(),
		page,
		limit,
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
		"academic years fetched successfully",
		ToResponses(years),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

// CreateAcademicYear godoc
// @Summary      Create Academic Year
// @Description  Create a new academic year
// @Tags         Academic Years
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateAcademicYearRequest  true  "Create Academic Year Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /academic-years [post]
func (h *Handler) CreateAcademicYear(
	c *gin.Context,
) {

	var req CreateAcademicYearRequest

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
		"academic year created successfully",
		nil,
	)
}

func ToResponse(year generated.AcademicYear) AcademicYearResponse {
	var startStr, endStr string
	if year.StartDate.Valid {
		startStr = year.StartDate.Time.Format("2006-01-02")
	}
	if year.EndDate.Valid {
		endStr = year.EndDate.Time.Format("2006-01-02")
	}
	return AcademicYearResponse{
		AcademicYearID:   year.AcademicYearID.String(),
		AcademicYearName: year.AcademicYearName,
		StartDate:        startStr,
		EndDate:          endStr,
		IsCurrent:        year.IsCurrent,
	}
}

func ToResponses(years []generated.AcademicYear) []AcademicYearResponse {
	res := make([]AcademicYearResponse, 0, len(years))
	for _, y := range years {
		res = append(res, ToResponse(y))
	}
	return res
}
