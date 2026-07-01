package semesterresults

import (
	"net/http"
	"strconv"
	"time"

	db "aums/backend/internal/db/generated"
	"aums/backend/pkg/response"
	"aums/backend/pkg/validator"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

// List godoc
// @Summary      List Semester Results
// @Description  Retrieve a paginated list of semester results with filtering
// @Tags         SemesterResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page              query      int     false  "Page number"   default(1)
// @Param        limit             query      int     false  "Page size"     default(20)
// @Param        semester_id       query      string  false  "Filter by Semester ID"
// @Param        student_id        query      string  false  "Filter by Student ID (profile)"
// @Param        program_id        query      string  false  "Filter by Program ID"
// @Param        academic_year_id  query      string  false  "Filter by Academic Year ID"
// @Param        status            query      string  false  "Filter by result status"
// @Success      200               {object}   response.SuccessResponse{data=[]SemesterResultResponse}
// @Failure      400               {object}   response.ErrorResponse
// @Failure      401               {object}   response.ErrorResponse
// @Failure      500               {object}   response.ErrorResponse
// @Router       /semester-results [get]
func (h *Handler) List(c *gin.Context) {
	page := response.GetPage(c)
	limit := response.GetLimit(c)
	semesterID := c.Query("semester_id")
	studentID := c.Query("student_id")
	programID := c.Query("program_id")
	academicYearID := c.Query("academic_year_id")
	status := c.Query("status")

	offset := (page - 1) * limit

	results, err := h.service.ListPaginated(
		c.Request.Context(),
		int32(limit),
		int32(offset),
		semesterID,
		studentID,
		programID,
		academicYearID,
		status,
	)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	total, err := h.service.Count(c.Request.Context(), semesterID, studentID, programID, academicYearID, status)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.SuccessWithMeta(
		c,
		http.StatusOK,
		"semester results fetched successfully",
		ToResponses(results),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

// Get godoc
// @Summary      Get Semester Result
// @Description  Retrieve details of a single semester result
// @Tags         SemesterResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Semester Result ID"
// @Success      200  {object}  response.SuccessResponse{data=SemesterResultResponse}
// @Failure      400  {object}  response.ErrorResponse
// @Failure      401  {object}  response.ErrorResponse
// @Failure      404  {object}  response.ErrorResponse
// @Router       /semester-results/{id} [get]
func (h *Handler) Get(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	res, err := h.service.Get(c.Request.Context(), id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "semester result not found")
		return
	}

	response.Success(c, http.StatusOK, "semester result fetched successfully", ToResponse(res))
}

// Create godoc
// @Summary      Create Semester Result
// @Description  Record a new semester result details (calculates SGPA automatically if credits/sgpa are empty)
// @Tags         SemesterResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateSemesterResultRequest  true  "Create Semester Result Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /semester-results [post]
func (h *Handler) Create(c *gin.Context) {
	var req CreateSemesterResultRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	if err := validator.Validate.Struct(req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "semester result created successfully", nil)
}

// Update godoc
// @Summary      Update Semester Result
// @Description  Update details of an existing semester result
// @Tags         SemesterResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id      path      string                       true  "Semester Result ID"
// @Param        request body      UpdateSemesterResultRequest  true  "Update Semester Result Payload"
// @Success      200     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /semester-results/{id} [put]
func (h *Handler) Update(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	var req UpdateSemesterResultRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	if err := validator.Validate.Struct(req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	err := h.service.Update(c.Request.Context(), id, req)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "semester result updated successfully", nil)
}

// Delete godoc
// @Summary      Delete Semester Result
// @Description  Delete a semester result record
// @Tags         SemesterResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Semester Result ID"
// @Success      200  {object}  response.SuccessResponse
// @Failure      400  {object}  response.ErrorResponse
// @Failure      401  {object}  response.ErrorResponse
// @Router       /semester-results/{id} [delete]
func (h *Handler) Delete(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	err := h.service.Delete(c.Request.Context(), id)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "semester result deleted successfully", nil)
}

func ToResponse(res db.SemesterResult) SemesterResultResponse {
	var publishedAtStr, createdAtStr, updatedAtStr string
	if res.PublishedAt.Valid {
		publishedAtStr = res.PublishedAt.Time.Format(time.RFC3339)
	}
	if res.CreatedAt.Valid {
		createdAtStr = res.CreatedAt.Time.Format(time.RFC3339)
	}
	if res.UpdatedAt.Valid {
		updatedAtStr = res.UpdatedAt.Time.Format(time.RFC3339)
	}

	var totalCreditsVal float64
	if res.TotalCredits.Valid {
		var str string
		err := res.TotalCredits.Scan(&str)
		if err == nil {
			val, err := strconv.ParseFloat(str, 64)
			if err == nil {
				totalCreditsVal = val
			}
		}
	}

	var earnedCreditsVal float64
	if res.EarnedCredits.Valid {
		var str string
		err := res.EarnedCredits.Scan(&str)
		if err == nil {
			val, err := strconv.ParseFloat(str, 64)
			if err == nil {
				earnedCreditsVal = val
			}
		}
	}

	var sgpaVal float64
	if res.Sgpa.Valid {
		var str string
		err := res.Sgpa.Scan(&str)
		if err == nil {
			val, err := strconv.ParseFloat(str, 64)
			if err == nil {
				sgpaVal = val
			}
		}
	}

	return SemesterResultResponse{
		SemesterResultID: res.SemesterResultID.String(),
		EnrollmentID:     res.EnrollmentID.String(),
		SemesterID:       res.SemesterID.String(),
		TotalCredits:     totalCreditsVal,
		EarnedCredits:    earnedCreditsVal,
		Sgpa:             sgpaVal,
		ResultStatus:     string(res.ResultStatus),
		PublishedAt:      publishedAtStr,
		CreatedAt:        createdAtStr,
		UpdatedAt:        updatedAtStr,
	}
}

func ToResponses(results []db.SemesterResult) []SemesterResultResponse {
	res := make([]SemesterResultResponse, 0, len(results))
	for _, r := range results {
		res = append(res, ToResponse(r))
	}
	return res
}
