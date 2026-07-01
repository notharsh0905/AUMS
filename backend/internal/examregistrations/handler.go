package examregistrations

import (
	"net/http"
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
// @Summary      List Exam Registrations
// @Description  Retrieve a paginated list of exam registrations with filtering
// @Tags         ExamRegistrations
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page           query      int     false  "Page number"   default(1)
// @Param        limit          query      int     false  "Page size"     default(20)
// @Param        exam_id        query      string  false  "Filter by Exam ID"
// @Param        enrollment_id  query      string  false  "Filter by Enrollment ID"
// @Param        status         query      string  false  "Filter by status"
// @Success      200            {object}   response.SuccessResponse{data=[]ExamRegistrationResponse}
// @Failure      400            {object}   response.ErrorResponse
// @Failure      401            {object}   response.ErrorResponse
// @Failure      500            {object}   response.ErrorResponse
// @Router       /exam-registrations [get]
func (h *Handler) List(c *gin.Context) {
	page := response.GetPage(c)
	limit := response.GetLimit(c)
	examID := c.Query("exam_id")
	enrollmentID := c.Query("enrollment_id")
	status := c.Query("status")

	offset := (page - 1) * limit

	registrations, err := h.service.ListPaginated(
		c.Request.Context(),
		int32(limit),
		int32(offset),
		examID,
		enrollmentID,
		status,
	)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	total, err := h.service.Count(c.Request.Context(), examID, enrollmentID, status)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.SuccessWithMeta(
		c,
		http.StatusOK,
		"exam registrations fetched successfully",
		ToResponses(registrations),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

// Get godoc
// @Summary      Get Exam Registration
// @Description  Retrieve details of a single exam registration
// @Tags         ExamRegistrations
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Exam Registration ID"
// @Success      200  {object}  response.SuccessResponse{data=ExamRegistrationResponse}
// @Failure      400  {object}  response.ErrorResponse
// @Failure      401  {object}  response.ErrorResponse
// @Failure      404  {object}  response.ErrorResponse
// @Router       /exam-registrations/{id} [get]
func (h *Handler) Get(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	reg, err := h.service.Get(c.Request.Context(), id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "exam registration not found")
		return
	}

	response.Success(c, http.StatusOK, "exam registration fetched successfully", ToResponse(reg))
}

// Create godoc
// @Summary      Create Exam Registration
// @Description  Register a student for a scheduled exam
// @Tags         ExamRegistrations
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateExamRegistrationRequest  true  "Create Registration Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /exam-registrations [post]
func (h *Handler) Create(c *gin.Context) {
	var req CreateExamRegistrationRequest
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

	response.Success(c, http.StatusCreated, "exam registration created successfully", nil)
}

// Update godoc
// @Summary      Update Exam Registration
// @Description  Update details of an existing exam registration
// @Tags         ExamRegistrations
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id      path      string                         true  "Exam Registration ID"
// @Param        request body      UpdateExamRegistrationRequest  true  "Update Registration Payload"
// @Success      200     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /exam-registrations/{id} [put]
func (h *Handler) Update(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	var req UpdateExamRegistrationRequest
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

	response.Success(c, http.StatusOK, "exam registration updated successfully", nil)
}

// Delete godoc
// @Summary      Delete Exam Registration
// @Description  Hard delete an exam registration record
// @Tags         ExamRegistrations
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Exam Registration ID"
// @Success      200  {object}  response.SuccessResponse
// @Failure      400  {object}  response.ErrorResponse
// @Failure      401  {object}  response.ErrorResponse
// @Router       /exam-registrations/{id} [delete]
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

	response.Success(c, http.StatusOK, "exam registration deleted successfully", nil)
}

func ToResponse(reg generated.ExamRegistration) ExamRegistrationResponse {
	var registeredAtStr, createdAtStr, updatedAtStr string
	if reg.RegisteredAt.Valid {
		registeredAtStr = reg.RegisteredAt.Time.Format(time.RFC3339)
	}
	if reg.CreatedAt.Valid {
		createdAtStr = reg.CreatedAt.Time.Format(time.RFC3339)
	}
	if reg.UpdatedAt.Valid {
		updatedAtStr = reg.UpdatedAt.Time.Format(time.RFC3339)
	}

	return ExamRegistrationResponse{
		ExamRegistrationID: reg.ExamRegistrationID.String(),
		ExamID:             reg.ExamID.String(),
		EnrollmentID:       reg.EnrollmentID.String(),
		RegistrationStatus: string(reg.RegistrationStatus),
		RegisteredAt:       registeredAtStr,
		CreatedAt:          createdAtStr,
		UpdatedAt:          updatedAtStr,
	}
}

func ToResponses(registrations []generated.ExamRegistration) []ExamRegistrationResponse {
	res := make([]ExamRegistrationResponse, 0, len(registrations))
	for _, r := range registrations {
		res = append(res, ToResponse(r))
	}
	return res
}
