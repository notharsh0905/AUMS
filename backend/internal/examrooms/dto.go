package examrooms

type CreateExamRoomRequest struct {
	Building             string `json:"building" validate:"required"`
	RoomNumber           string `json:"room_number" validate:"required"`
	RoomName             string `json:"room_name" validate:"required"`
	Floor                int32  `json:"floor" validate:"required,min=0"`
	Block                string `json:"block,omitempty"`
	Capacity             int32  `json:"capacity" validate:"required,min=1"`
	RoomType             string `json:"room_type" validate:"required"`
	Status               string `json:"status" validate:"required"`
	HasProjector         bool   `json:"has_projector"`
	HasAc                bool   `json:"has_ac"`
	WheelchairAccessible bool   `json:"wheelchair_accessible"`
	InstitutionID        string `json:"institution_id" validate:"required,uuid"`
}

type UpdateExamRoomRequest struct {
	Building             string `json:"building" validate:"required"`
	RoomNumber           string `json:"room_number" validate:"required"`
	RoomName             string `json:"room_name" validate:"required"`
	Floor                int32  `json:"floor" validate:"required,min=0"`
	Block                string `json:"block,omitempty"`
	Capacity             int32  `json:"capacity" validate:"required,min=1"`
	RoomType             string `json:"room_type" validate:"required"`
	Status               string `json:"status" validate:"required"`
	HasProjector         bool   `json:"has_projector"`
	HasAc                bool   `json:"has_ac"`
	WheelchairAccessible bool   `json:"wheelchair_accessible"`
}

type ExamRoomResponse struct {
	ExamRoomID           string `json:"exam_room_id"`
	Building             string `json:"building"`
	RoomNumber           string `json:"room_number"`
	RoomName             string `json:"room_name"`
	Floor                int32  `json:"floor"`
	Block                string `json:"block,omitempty"`
	Capacity             int32  `json:"capacity"`
	RoomType             string `json:"room_type"`
	Status               string `json:"status"`
	HasProjector         bool   `json:"has_projector"`
	HasAc                bool   `json:"has_ac"`
	WheelchairAccessible bool   `json:"wheelchair_accessible"`
	InstitutionID        string `json:"institution_id"`
	CreatedAt            string `json:"created_at"`
	UpdatedAt            string `json:"updated_at"`
}
