package campuses

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

// ListCampuses godoc
// @Summary      List Campuses
// @Description  Retrieve a paginated list of campuses
// @Tags         Campuses
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page   query      int  false  "Page number"   default(1)
// @Param        limit  query      int  false  "Page size"     default(20)
// @Success      200    {object}   response.SuccessResponse{data=[]CampusResponse}
// @Failure      400    {object}   response.ErrorResponse
// @Failure      401    {object}   response.ErrorResponse
// @Failure      500    {object}   response.ErrorResponse
// @Router       /campuses [get]
func (h *Handler) ListCampuses(
	c *gin.Context,
) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)

	offset := (page - 1) * limit

	campuses, err := h.service.ListPaginated(
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
		"campuses fetched successfully",
		ToResponses(campuses),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

// CreateCampus godoc
// @Summary      Create Campus
// @Description  Create a new campus profile
// @Tags         Campuses
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateCampusRequest  true  "Create Campus Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /campuses [post]
func (h *Handler) CreateCampus(
	c *gin.Context,
) {

	var req CreateCampusRequest

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
		"campus created successfully",
		nil,
	)
}

func ToResponse(campus generated.Campuse) CampusResponse {
	return CampusResponse{
		CampusID:     campus.CampusID.String(),
		CampusCode:   campus.CampusCode,
		CampusName:   campus.CampusName,
		AddressLine1: campus.AddressLine1.String,
		AddressLine2: campus.AddressLine2.String,
		City:         campus.City.String,
		State:        campus.State.String,
		Country:      campus.Country.String,
		PostalCode:   campus.PostalCode.String,
	}
}

func ToResponses(campuses []generated.Campuse) []CampusResponse {
	res := make([]CampusResponse, 0, len(campuses))
	for _, c := range campuses {
		res = append(res, ToResponse(c))
	}
	return res
}
