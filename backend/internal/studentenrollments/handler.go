package studentenrollments

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

// ListStudentEnrollments godoc
// @Summary      List Student Enrollments
// @Description  Retrieve a paginated list of student enrollments
// @Tags         Student Enrollments
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page   query      int  false  "Page number"   default(1)
// @Param        limit  query      int  false  "Page size"     default(20)
// @Success      200    {object}   response.SuccessResponse{data=[]StudentEnrollmentResponse}
// @Failure      400    {object}   response.ErrorResponse
// @Failure      401    {object}   response.ErrorResponse
// @Failure      500    {object}   response.ErrorResponse
// @Router       /student-enrollments [get]
func (h *Handler) ListStudentEnrollments(
	c *gin.Context,
) {

	page := response.GetPage(c)
	limit := response.GetLimit(c)

	enrollments, err := h.service.List(
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

	start := (page - 1) * limit
	if start > len(enrollments) {
		start = len(enrollments)
	}

	end := start + limit
	if end > len(enrollments) {
		end = len(enrollments)
	}

	paginatedEnrollments := enrollments[start:end]

	response.SuccessWithMeta(
		c,
		http.StatusOK,
		"student enrollments retrieved successfully",
		ToResponses(paginatedEnrollments),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: len(enrollments),
		},
	)
}

// CreateStudentEnrollment godoc
// @Summary      Create Student Enrollment
// @Description  Create a new student enrollment record
// @Tags         Student Enrollments
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateStudentEnrollmentRequest  true  "Create Enrollment Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /student-enrollments [post]
func (h *Handler) CreateStudentEnrollment(
	c *gin.Context,
) {

	var req CreateStudentEnrollmentRequest

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
		"student enrollment created successfully",
		nil,
	)
}

func ToResponse(enrollment generated.StudentEnrollment) StudentEnrollmentResponse {
	var enrollmentDateStr, graduationDateStr string
	if enrollment.EnrollmentDate.Valid {
		enrollmentDateStr = enrollment.EnrollmentDate.Time.Format("2006-01-02")
	}
	if enrollment.GraduationDate.Valid {
		graduationDateStr = enrollment.GraduationDate.Time.Format("2006-01-02")
	}
	return StudentEnrollmentResponse{
		EnrollmentID:     enrollment.EnrollmentID.String(),
		StudentProfileID: enrollment.StudentProfileID.String(),
		ProgramID:        enrollment.ProgramID.String(),
		EnrollmentNumber: enrollment.EnrollmentNumber,
		EnrollmentDate:   enrollmentDateStr,
		GraduationDate:   graduationDateStr,
		Status:           string(enrollment.Status),
		Remarks:          enrollment.Remarks.String,
	}
}

func ToResponses(enrollments []generated.StudentEnrollment) []StudentEnrollmentResponse {
	res := make([]StudentEnrollmentResponse, 0, len(enrollments))
	for _, e := range enrollments {
		res = append(res, ToResponse(e))
	}
	return res
}
