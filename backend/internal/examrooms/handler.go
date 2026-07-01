package examrooms

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

// ListExamRooms godoc
// @Summary      List Exam Rooms
// @Description  Retrieve a paginated list of exam rooms with optional filtering and search
// @Tags         ExamRooms
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page       query      int     false  "Page number"   default(1)
// @Param        limit      query      int     false  "Page size"     default(20)
// @Param        search     query      string  false  "Search by building, room number or name"
// @Param        status     query      string  false  "Filter by status"
// @Param        room_type  query      string  false  "Filter by room type"
// @Success      200        {object}   response.SuccessResponse{data=[]ExamRoomResponse}
// @Failure      400        {object}   response.ErrorResponse
// @Failure      401        {object}   response.ErrorResponse
// @Failure      500        {object}   response.ErrorResponse
// @Router       /exam-rooms [get]
func (h *Handler) ListExamRooms(c *gin.Context) {
	page := response.GetPage(c)
	limit := response.GetLimit(c)
	search := c.Query("search")
	status := c.Query("status")
	roomType := c.Query("room_type")

	offset := (page - 1) * limit

	rooms, err := h.service.ListPaginated(
		c.Request.Context(),
		int32(limit),
		int32(offset),
		search,
		status,
		roomType,
	)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	total, err := h.service.Count(c.Request.Context(), search, status, roomType)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.SuccessWithMeta(
		c,
		http.StatusOK,
		"exam rooms fetched successfully",
		ToResponses(rooms),
		response.PaginationMeta{
			Page:  page,
			Limit: limit,
			Total: int(total),
		},
	)
}

// GetExamRoom godoc
// @Summary      Get Exam Room
// @Description  Retrieve details of a single exam room
// @Tags         ExamRooms
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Exam Room ID"
// @Success      200  {object}  response.SuccessResponse{data=ExamRoomResponse}
// @Failure      400  {object}  response.ErrorResponse
// @Failure      401  {object}  response.ErrorResponse
// @Failure      404  {object}  response.ErrorResponse
// @Router       /exam-rooms/{id} [get]
func (h *Handler) GetExamRoom(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	room, err := h.service.Get(c.Request.Context(), id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "exam room not found")
		return
	}

	response.Success(c, http.StatusOK, "exam room fetched successfully", ToResponse(room))
}

// CreateExamRoom godoc
// @Summary      Create Exam Room
// @Description  Create a new exam room profile
// @Tags         ExamRooms
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request body      CreateExamRoomRequest  true  "Create Exam Room Payload"
// @Success      201     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /exam-rooms [post]
func (h *Handler) CreateExamRoom(c *gin.Context) {
	var req CreateExamRoomRequest
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

	response.Success(c, http.StatusCreated, "exam room created successfully", nil)
}

// UpdateExamRoom godoc
// @Summary      Update Exam Room
// @Description  Update details of an existing exam room
// @Tags         ExamRooms
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id      path      string                 true  "Exam Room ID"
// @Param        request body      UpdateExamRoomRequest  true  "Update Exam Room Payload"
// @Success      200     {object}  response.SuccessResponse
// @Failure      400     {object}  response.ErrorResponse
// @Failure      401     {object}  response.ErrorResponse
// @Router       /exam-rooms/{id} [put]
func (h *Handler) UpdateExamRoom(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	var req UpdateExamRoomRequest
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

	response.Success(c, http.StatusOK, "exam room updated successfully", nil)
}

// DeleteExamRoom godoc
// @Summary      Delete Exam Room
// @Description  Soft delete an exam room
// @Tags         ExamRooms
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Exam Room ID"
// @Success      200  {object}  response.SuccessResponse
// @Failure      400  {object}  response.ErrorResponse
// @Failure      401  {object}  response.ErrorResponse
// @Router       /exam-rooms/{id} [delete]
func (h *Handler) DeleteExamRoom(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, http.StatusBadRequest, "id parameter is required")
		return
	}

	err := h.service.SoftDelete(c.Request.Context(), id)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "exam room deleted successfully", nil)
}

func ToResponse(room generated.ExamRoom) ExamRoomResponse {
	var createdAtStr, updatedAtStr string
	if room.CreatedAt.Valid {
		createdAtStr = room.CreatedAt.Time.Format(time.RFC3339)
	}
	if room.UpdatedAt.Valid {
		updatedAtStr = room.UpdatedAt.Time.Format(time.RFC3339)
	}

	return ExamRoomResponse{
		ExamRoomID:           room.ExamRoomID.String(),
		Building:             room.Building,
		RoomNumber:           room.RoomNumber,
		RoomName:             room.RoomName,
		Floor:                room.Floor,
		Block:                room.Block.String,
		Capacity:             room.Capacity,
		RoomType:             room.RoomType,
		Status:               room.Status,
		HasProjector:         room.HasProjector,
		HasAc:                room.HasAc,
		WheelchairAccessible: room.WheelchairAccessible,
		InstitutionID:        room.InstitutionID.String(),
		CreatedAt:            createdAtStr,
		UpdatedAt:            updatedAtStr,
	}
}

func ToResponses(rooms []generated.ExamRoom) []ExamRoomResponse {
	res := make([]ExamRoomResponse, 0, len(rooms))
	for _, r := range rooms {
		res = append(res, ToResponse(r))
	}
	return res
}
