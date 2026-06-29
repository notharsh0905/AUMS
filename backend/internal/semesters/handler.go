package semesters

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

// ListSemesters godoc
// @Summary      List Semesters
// @Description  Retrieve a paginated list of semesters
// @Tags         Semesters
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page   query      int  false  "Page number"   default(1)
// @Param        limit  query      int  false  "Page size"     default(20)
// @Success      200    {object}   response.SuccessResponse{data=[]SemesterResponse}
// @Failure      400    {object}   response.ErrorResponse
// @Failure      401    {object}   response.ErrorResponse
// @Failure      500    {object}   response.ErrorResponse
// @Router       /semesters [get]
func (h *Handler) ListSemesters(
	c *gin.Context,
) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)

	semesters, total, err := h.service.ListPaginated(
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
		"semesters fetched successfully",
		ToResponses(semesters),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

// CreateSemester godoc
// @Summary      Create Semester
// @Description  Create a new semester
// @Tags         Semesters
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateSemesterRequest  true  "Create Semester Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /semesters [post]
func (h *Handler) CreateSemester(
	c *gin.Context,
) {

	var req CreateSemesterRequest

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
		"semester created successfully",
		nil,
	)
}

func ToResponse(sem generated.Semester) SemesterResponse {
	var startStr, endStr string
	if sem.StartDate.Valid {
		startStr = sem.StartDate.Time.Format("2006-01-02")
	}
	if sem.EndDate.Valid {
		endStr = sem.EndDate.Time.Format("2006-01-02")
	}
	return SemesterResponse{
		SemesterID:     sem.SemesterID.String(),
		AcademicYearID: sem.AcademicYearID.String(),
		SemesterNumber: sem.SemesterNumber,
		SemesterName:   sem.SemesterName,
		StartDate:      startStr,
		EndDate:        endStr,
	}
}

func ToResponses(semesters []generated.Semester) []SemesterResponse {
	res := make([]SemesterResponse, 0, len(semesters))
	for _, s := range semesters {
		res = append(res, ToResponse(s))
	}
	return res
}
