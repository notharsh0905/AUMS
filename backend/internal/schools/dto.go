package schools

type CreateSchoolRequest struct {
	CampusID string `json:"campus_id" validate:"required,uuid"`

	SchoolCode string `json:"school_code" validate:"required"`

	SchoolName string `json:"school_name" validate:"required"`

	Description string `json:"description,omitempty"`
}
