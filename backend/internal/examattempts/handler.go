package examattempts

import (
	"net/http"
	"strconv"
	"time"

	"aums/backend/internal/db/generated"
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
// @Summary      List Exam Attempts
// @Description  Retrieve a paginated list of exam attempts with filtering
// @Tags         ExamAttempts
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page             query      int     false  "Page number"   default(1)
// @Param        limit            query      int     false  "Page size"     default(20)
// @Param        exam_id          query      string  false  "Filter by Exam ID"
// @Param        registration_id  query      string  false  "Filter by Exam Registration ID"
// @Param        enrollment_id    query      string  false  "Filter by Enrollment ID"
// @Param        status           query      string  false  "Filter by Exam Registration Status"
// @Success      200              {object}   response.SuccessResponse{data=[]ExamAttemptResponse}
// @Failure      400              {object}   response.ErrorResponse
// @Failure      401              {object}   response.ErrorResponse
// @Failure      500              {object}   response.ErrorResponse
// @Router       /exam-attempts [get]
func (h *Handler) List(c *gin.Context) {
	page := response.GetPage(c)
	limit := response.GetLimit(c)
	examID := c.Query("exam_id")
	registrationID := c.Query("registration_id")
	enrollmentID := c.Query("enrollment_id")
	status := c.Query("status")

	offset := (page - 1) * limit

	attempts, err := h.service.ListPaginated(
		c.Request.Context(),
		int32(limit),
		int32(offset),
		examID,
		registrationID,
		enrollmentID,
		status,
	)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	total, err := h.service.Count(c.Request.Context(), examID, registrationID, enrollmentID, status)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.SuccessWithMeta(
		c,
		http.StatusOK,
		"exam attempts fetched successfully",
		ToResponses(attempts),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

// Get godoc
// @Summary      Get Exam Attempt
// @Description  Retrieve details of a single exam attempt
// @Tags         ExamAttempts
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Exam Attempt ID"
// @Success      200  {object}  response.SuccessResponse{data=ExamAttemptResponse}
// @Failure      400  {object}  response.ErrorResponse
// @Failure      401  {object}  response.ErrorResponse
// @Failure      404  {object}  response.ErrorResponse
// @Router       /exam-attempts/{id} [get]
func (h *Handler) Get(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	attempt, err := h.service.Get(c.Request.Context(), id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "exam attempt not found")
		return
	}

	response.Success(c, http.StatusOK, "exam attempt fetched successfully", ToResponse(attempt))
}

// Create godoc
// @Summary      Create Exam Attempt
// @Description  Record marks and presence for a student's exam attempt
// @Tags         ExamAttempts
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateExamAttemptRequest  true  "Create Attempt Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /exam-attempts [post]
func (h *Handler) Create(c *gin.Context) {
	var req CreateExamAttemptRequest
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

	response.Success(c, http.StatusCreated, "exam attempt created successfully", nil)
}

// Update godoc
// @Summary      Update Exam Attempt
// @Description  Update details of an existing exam attempt
// @Tags         ExamAttempts
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id      path      string                    true  "Exam Attempt ID"
// @Param        request body      UpdateExamAttemptRequest  true  "Update Attempt Payload"
// @Success      200     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /exam-attempts/{id} [put]
func (h *Handler) Update(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	var req UpdateExamAttemptRequest
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

	response.Success(c, http.StatusOK, "exam attempt updated successfully", nil)
}

// Delete godoc
// @Summary      Delete Exam Attempt
// @Description  Delete an exam attempt record
// @Tags         ExamAttempts
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Exam Attempt ID"
// @Success      200  {object}  response.SuccessResponse
// @Failure      400  {object}  response.ErrorResponse
// @Failure      401  {object}  response.ErrorResponse
// @Router       /exam-attempts/{id} [delete]
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

	response.Success(c, http.StatusOK, "exam attempt deleted successfully", nil)
}

func ToResponse(attempt generated.ExamAttempt) ExamAttemptResponse {
	var evaluatedAtStr, createdAtStr, updatedAtStr string
	if attempt.EvaluatedAt.Valid {
		evaluatedAtStr = attempt.EvaluatedAt.Time.Format(time.RFC3339)
	}
	if attempt.CreatedAt.Valid {
		createdAtStr = attempt.CreatedAt.Time.Format(time.RFC3339)
	}
	if attempt.UpdatedAt.Valid {
		updatedAtStr = attempt.UpdatedAt.Time.Format(time.RFC3339)
	}

	var marksVal float64
	if attempt.MarksObtained.Valid {
		// pgtype.Numeric supports scanning or parsing
		var mStr string
		err := attempt.MarksObtained.Scan(&mStr)
		if err == nil {
			val, err := strconv.ParseFloat(mStr, 64)
			if err == nil {
				marksVal = val
			}
		}
	}

	return ExamAttemptResponse{
		ExamAttemptID:      attempt.ExamAttemptID.String(),
		ExamRegistrationID: attempt.ExamRegistrationID.String(),
		AttemptNumber:      attempt.AttemptNumber,
		MarksObtained:      marksVal,
		EvaluatorID:        attempt.EvaluatorID.String(),
		EvaluatedAt:        evaluatedAtStr,
		Remarks:            attempt.Remarks.String,
		CreatedAt:          createdAtStr,
		UpdatedAt:          updatedAtStr,
	}
}

func ToResponses(attempts []generated.ExamAttempt) []ExamAttemptResponse {
	res := make([]ExamAttemptResponse, 0, len(attempts))
	for _, a := range attempts {
		res = append(res, ToResponse(a))
	}
	return res
}
