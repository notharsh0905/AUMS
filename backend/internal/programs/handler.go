package programs

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

// ListPrograms godoc
// @Summary      List Programs
// @Description  Retrieve a paginated list of programs
// @Tags         Programs
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page   query      int  false  "Page number"   default(1)
// @Param        limit  query      int  false  "Page size"     default(20)
// @Success      200    {object}   response.SuccessResponse{data=[]ProgramResponse}
// @Failure      400    {object}   response.ErrorResponse
// @Failure      401    {object}   response.ErrorResponse
// @Failure      500    {object}   response.ErrorResponse
// @Router       /programs [get]
func (h *Handler) ListPrograms(
	c *gin.Context,
) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)

	offset := (page - 1) * limit

	programs, err := h.service.ListPaginated(
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
		"programs fetched successfully",
		ToResponses(programs),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

// CreateProgram godoc
// @Summary      Create Program
// @Description  Create a new program profile
// @Tags         Programs
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateProgramRequest  true  "Create Program Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /programs [post]
func (h *Handler) CreateProgram(
	c *gin.Context,
) {

	var req CreateProgramRequest

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
		"program created successfully",
		nil,
	)
}

func ToResponse(prog generated.Program) ProgramResponse {
	return ProgramResponse{
		ProgramID:      prog.ProgramID.String(),
		DepartmentID:   prog.DepartmentID.String(),
		ProgramCode:    prog.ProgramCode,
		ProgramName:    prog.ProgramName,
		DegreeType:     string(prog.DegreeType),
		DurationValue:  prog.DurationValue,
		DurationUnit:   prog.DurationUnit,
		TotalSemesters: prog.TotalSemesters.Int32,
	}
}

func ToResponses(progs []generated.Program) []ProgramResponse {
	res := make([]ProgramResponse, 0, len(progs))
	for _, p := range progs {
		res = append(res, ToResponse(p))
	}
	return res
}
