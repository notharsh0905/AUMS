package courseresults

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
// @Summary      Create Course Result
// @Description  Record a new course result details
// @Tags         CourseResults
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateCourseResultRequest  true  "Create Course Result Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
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

	err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "course result created successfully", nil)
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
// @Failure      401  {object}  response.ErrorResponse
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

func ToResponse(res db.CourseResult) CourseResultResponse {
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

	var totalMarksVal float64
	if res.TotalMarks.Valid {
		var str string
		err := res.TotalMarks.Scan(&str)
		if err == nil {
			val, err := strconv.ParseFloat(str, 64)
			if err == nil {
				totalMarksVal = val
			}
		}
	}

	var marksObtainedVal float64
	if res.MarksObtained.Valid {
		var str string
		err := res.MarksObtained.Scan(&str)
		if err == nil {
			val, err := strconv.ParseFloat(str, 64)
			if err == nil {
				marksObtainedVal = val
			}
		}
	}

	var percentageVal float64
	if res.Percentage.Valid {
		var str string
		err := res.Percentage.Scan(&str)
		if err == nil {
			val, err := strconv.ParseFloat(str, 64)
			if err == nil {
				percentageVal = val
			}
		}
	}

	return CourseResultResponse{
		CourseResultID:   res.CourseResultID.String(),
		EnrollmentID:     res.EnrollmentID.String(),
		CourseOfferingID: res.CourseOfferingID.String(),
		TotalMarks:       totalMarksVal,
		MarksObtained:    marksObtainedVal,
		Percentage:       percentageVal,
		GradeScaleID:     res.GradeScaleID.String(),
		ResultStatus:     string(res.ResultStatus),
		PublishedAt:      publishedAtStr,
		CreatedAt:        createdAtStr,
		UpdatedAt:        updatedAtStr,
	}
}

func ToResponses(results []db.CourseResult) []CourseResultResponse {
	res := make([]CourseResultResponse, 0, len(results))
	for _, r := range results {
		res = append(res, ToResponse(r))
	}
	return res
}
