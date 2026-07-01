package programresults

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
// @Summary      List Program Results
// @Description  Retrieve a paginated list of program results with filtering
// @Tags         ProgramResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page        query      int     false  "Page number"   default(1)
// @Param        limit       query      int     false  "Page size"     default(20)
// @Param        student_id  query      string  false  "Filter by Student ID (profile)"
// @Param        program_id  query      string  false  "Filter by Program ID"
// @Param        batch       query      string  false  "Filter by Admission Year or enrollment substring"
// @Param        status      query      string  false  "Filter by result status"
// @Success      200         {object}   response.SuccessResponse{data=[]ProgramResultResponse}
// @Failure      400         {object}   response.ErrorResponse
// @Failure      401         {object}   response.ErrorResponse
// @Failure      500         {object}   response.ErrorResponse
// @Router       /program-results [get]
func (h *Handler) List(c *gin.Context) {
	page := response.GetPage(c)
	limit := response.GetLimit(c)
	studentID := c.Query("student_id")
	programID := c.Query("program_id")
	batch := c.Query("batch")
	status := c.Query("status")

	offset := (page - 1) * limit

	results, err := h.service.ListPaginated(
		c.Request.Context(),
		int32(limit),
		int32(offset),
		studentID,
		programID,
		batch,
		status,
	)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	total, err := h.service.Count(c.Request.Context(), studentID, programID, batch, status)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.SuccessWithMeta(
		c,
		http.StatusOK,
		"program results fetched successfully",
		ToResponses(results),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

// Get godoc
// @Summary      Get Program Result
// @Description  Retrieve details of a single program result
// @Tags         ProgramResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Program Result ID"
// @Success      200  {object}  response.SuccessResponse{data=ProgramResultResponse}
// @Failure      400  {object}  response.ErrorResponse
// @Failure      401  {object}  response.ErrorResponse
// @Failure      404  {object}  response.ErrorResponse
// @Router       /program-results/{id} [get]
func (h *Handler) Get(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	res, err := h.service.Get(c.Request.Context(), id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "program result not found")
		return
	}

	response.Success(c, http.StatusOK, "program result fetched successfully", ToResponse(res))
}

// Create godoc
// @Summary      Create Program Result
// @Description  Record a new program result (calculates CGPA/Credits automatically if values are empty)
// @Tags         ProgramResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateProgramResultRequest  true  "Create Program Result Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /program-results [post]
func (h *Handler) Create(c *gin.Context) {
	var req CreateProgramResultRequest
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

	response.Success(c, http.StatusCreated, "program result created successfully", nil)
}

// Update godoc
// @Summary      Update Program Result
// @Description  Update details of an existing program result
// @Tags         ProgramResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id      path      string                      true  "Program Result ID"
// @Param        request body      UpdateProgramResultRequest  true  "Update Program Result Payload"
// @Success      200     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /program-results/{id} [put]
func (h *Handler) Update(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	var req UpdateProgramResultRequest
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

	response.Success(c, http.StatusOK, "program result updated successfully", nil)
}

// Delete godoc
// @Summary      Delete Program Result
// @Description  Delete a program result record
// @Tags         ProgramResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Program Result ID"
// @Success      200  {object}  response.SuccessResponse
// @Failure      400  {object}  response.ErrorResponse
// @Failure      401  {object}  response.ErrorResponse
// @Router       /program-results/{id} [delete]
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

	response.Success(c, http.StatusOK, "program result deleted successfully", nil)
}

func ToResponse(res db.ProgramResult) ProgramResultResponse {
	var publishedAtStr, completionDateStr, createdAtStr, updatedAtStr string
	if res.PublishedAt.Valid {
		publishedAtStr = res.PublishedAt.Time.Format(time.RFC3339)
	}
	if res.CompletionDate.Valid {
		completionDateStr = res.CompletionDate.Time.Format("2006-01-02")
	}
	if res.CreatedAt.Valid {
		createdAtStr = res.CreatedAt.Time.Format(time.RFC3339)
	}
	if res.UpdatedAt.Valid {
		updatedAtStr = res.UpdatedAt.Time.Format(time.RFC3339)
	}

	var cgpaVal float64
	if res.Cgpa.Valid {
		var str string
		err := res.Cgpa.Scan(&str)
		if err == nil {
			val, err := strconv.ParseFloat(str, 64)
			if err == nil {
				cgpaVal = val
			}
		}
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

	// Calculate standard credit settings (assuming default required of 120.0 credits)
	requiredCredits := 120.0
	creditsRemaining := requiredCredits - earnedCreditsVal
	if creditsRemaining < 0 {
		creditsRemaining = 0
	}

	overallPercentage := cgpaVal * 10.0

	// Determine Degree Classification
	degreeClassification := "Fail"
	if cgpaVal >= 8.5 {
		degreeClassification = "First Class with Distinction"
	} else if cgpaVal >= 6.5 {
		degreeClassification = "First Class"
	} else if cgpaVal >= 5.0 {
		degreeClassification = "Second Class"
	} else if cgpaVal >= 4.0 {
		degreeClassification = "Pass Class"
	}

	// Determine Graduation Eligibility
	graduationEligibility := "INELIGIBLE"
	if earnedCreditsVal >= requiredCredits && cgpaVal >= 4.0 {
		graduationEligibility = "ELIGIBLE"
	}

	// Determine Academic Standing
	academicStanding := "Academic Probation"
	if cgpaVal >= 8.5 {
		academicStanding = "Excellent"
	} else if cgpaVal >= 6.5 {
		academicStanding = "Good"
	} else if cgpaVal >= 4.0 {
		academicStanding = "Satisfactory"
	}

	return ProgramResultResponse{
		ProgramResultID:       res.ProgramResultID.String(),
		EnrollmentID:          res.EnrollmentID.String(),
		Cgpa:                  cgpaVal,
		TotalCredits:          totalCreditsVal,
		EarnedCredits:         earnedCreditsVal,
		CreditsRemaining:      creditsRemaining,
		OverallPercentage:     overallPercentage,
		DegreeClassification:  degreeClassification,
		GraduationEligibility: graduationEligibility,
		AcademicStanding:      academicStanding,
		DegreeCompleted:       res.DegreeCompleted,
		CompletionDate:        completionDateStr,
		ResultStatus:          string(res.ResultStatus),
		PublishedAt:           publishedAtStr,
		CreatedAt:             createdAtStr,
		UpdatedAt:             updatedAtStr,
	}
}

func ToResponses(results []db.ProgramResult) []ProgramResultResponse {
	res := make([]ProgramResultResponse, 0, len(results))
	for _, r := range results {
		res = append(res, ToResponse(r))
	}
	return res
}
