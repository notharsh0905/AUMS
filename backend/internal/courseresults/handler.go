package courseresults

import (
	"net/http"
	"strconv"
	"time"

	db "aums/backend/internal/db/generated"
	"aums/backend/pkg/response"
	"aums/backend/pkg/validator"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
// @Summary      List Course Results
// @Description  Retrieve a paginated list of course results with filtering
// @Tags         CourseResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page                query      int     false  "Page number"   default(1)
// @Param        limit               query      int     false  "Page size"     default(20)
// @Param        enrollment_id       query      string  false  "Filter by Enrollment ID"
// @Param        course_offering_id  query      string  false  "Filter by Course Offering ID"
// @Param        status              query      string  false  "Filter by result status"
// @Success      200                 {object}   response.SuccessResponse{data=[]CourseResultResponse}
// @Failure      400                 {object}   response.ErrorResponse
// @Failure      401                 {object}   response.ErrorResponse
// @Failure      500                 {object}   response.ErrorResponse
// @Router       /course-results [get]
func (h *Handler) List(c *gin.Context) {
	page := response.GetPage(c)
	limit := response.GetLimit(c)
	enrollmentID := c.Query("enrollment_id")
	courseOfferingID := c.Query("course_offering_id")
	status := c.Query("status")

	callerUserID := c.GetString("user_id")

	// If filtering explicitly, use paginated query
	if enrollmentID != "" || courseOfferingID != "" || status != "" {
		offset := (page - 1) * limit
		results, err := h.service.ListPaginated(
			c.Request.Context(),
			int32(limit),
			int32(offset),
			enrollmentID,
			courseOfferingID,
			status,
		)
		if err != nil {
			response.Error(c, http.StatusInternalServerError, err.Error())
			return
		}

		total, err := h.service.Count(c.Request.Context(), enrollmentID, courseOfferingID, status)
		if err != nil {
			response.Error(c, http.StatusInternalServerError, err.Error())
			return
		}

		response.SuccessWithMeta(
			c,
			http.StatusOK,
			"course results fetched successfully",
			ToResponses(results),
			response.PaginationMeta{
				Page:  page,
				Limit: limit,
				Total: int(total),
			},
		)
		return
	}

	// Scoped listing for current user
	results, err := h.service.ListScoped(c.Request.Context(), callerUserID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	start := (page - 1) * limit
	if start > len(results) {
		start = len(results)
	}

	end := start + limit
	if end > len(results) {
		end = len(results)
	}

	paginatedData := results[start:end]

	response.SuccessWithMeta(
		c,
		http.StatusOK,
		"course results fetched successfully",
		ToResponses(paginatedData),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: len(results),
		},
	)
}

// Get godoc
// @Summary      Get Course Result
// @Description  Retrieve details of a single course result
// @Tags         CourseResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Course Result ID"
// @Success      200  {object}  response.SuccessResponse{data=CourseResultResponse}
// @Failure      400  {object}  response.ErrorResponse
// @Failure      401  {object}  response.ErrorResponse
// @Failure      404  {object}  response.ErrorResponse
// @Router       /course-results/{id} [get]
func (h *Handler) Get(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	res, err := h.service.Get(c.Request.Context(), id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "course result not found")
		return
	}

	response.Success(c, http.StatusOK, "course result fetched successfully", ToResponse(res))
}

// Create godoc
// @Summary      Create or Upsert Course Result
// @Description  Record or update course result details (internal assessment / semester marks)
// @Tags         CourseResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateCourseResultRequest  true  "Create Course Result Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Failure      403     {object}  response.ErrorResponse
// @Router       /course-results [post]
func (h *Handler) Create(c *gin.Context) {
	var req CreateCourseResultRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	if err := validator.Validate.Struct(req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	callerUserID := c.GetString("user_id")

	err := h.service.Create(c.Request.Context(), callerUserID, req)
	if err != nil {
		if err.Error() == "forbidden: students cannot modify course marks" ||
			err.Error() == "unauthorized: faculty can only grade allocated courses" {
			response.Error(c, http.StatusForbidden, err.Error())
			return
		}

		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "course result recorded successfully", nil)
}

// Update godoc
// @Summary      Update Course Result
// @Description  Update details of an existing course result
// @Tags         CourseResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id      path      string                     true  "Course Result ID"
// @Param        request body      UpdateCourseResultRequest  true  "Update Course Result Payload"
// @Success      200     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /course-results/{id} [put]
func (h *Handler) Update(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	var req UpdateCourseResultRequest
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

	response.Success(c, http.StatusOK, "course result updated successfully", nil)
}

// Delete godoc
// @Summary      Delete Course Result
// @Description  Delete a course result record
// @Tags         CourseResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Course Result ID"
// @Success      200  {object}  response.SuccessResponse
// @Failure      400  {object}  response.ErrorResponse
// @Failure      404  {object}  response.ErrorResponse
// @Router       /course-results/{id} [delete]
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

	response.Success(c, http.StatusOK, "course result deleted successfully", nil)
}

func ToResponse(r db.CourseResult) CourseResultResponse {
	totalMarks, _ := strconv.ParseFloat(r.TotalMarks.Int.String(), 64)
	if r.TotalMarks.Exp < 0 {
		for i := 0; i < int(-r.TotalMarks.Exp); i++ {
			totalMarks /= 10
		}
	}

	marksObtained, _ := strconv.ParseFloat(r.MarksObtained.Int.String(), 64)
	if r.MarksObtained.Exp < 0 {
		for i := 0; i < int(-r.MarksObtained.Exp); i++ {
			marksObtained /= 10
		}
	}

	percentage, _ := strconv.ParseFloat(r.Percentage.Int.String(), 64)
	if r.Percentage.Exp < 0 {
		for i := 0; i < int(-r.Percentage.Exp); i++ {
			percentage /= 10
		}
	}

	gradeScaleID := ""
	if r.GradeScaleID.Valid {
		gradeScaleID = uuid.UUID(r.GradeScaleID.Bytes).String()
	}

	publishedAt := ""
	if r.PublishedAt.Valid {
		publishedAt = r.PublishedAt.Time.Format(time.RFC3339)
	}

	return CourseResultResponse{
		CourseResultID:   uuid.UUID(r.CourseResultID.Bytes).String(),
		EnrollmentID:     uuid.UUID(r.EnrollmentID.Bytes).String(),
		CourseOfferingID: uuid.UUID(r.CourseOfferingID.Bytes).String(),
		TotalMarks:       totalMarks,
		MarksObtained:    marksObtained,
		Percentage:       percentage,
		GradeScaleID:     gradeScaleID,
		ResultStatus:     string(r.ResultStatus),
		PublishedAt:      publishedAt,
		CreatedAt:        r.CreatedAt.Time.Format(time.RFC3339),
		UpdatedAt:        r.UpdatedAt.Time.Format(time.RFC3339),
	}
}

func ToResponses(results []db.CourseResult) []CourseResultResponse {
	responses := make([]CourseResultResponse, len(results))
	for i, r := range results {
		responses[i] = ToResponse(r)
	}
	return responses
}
