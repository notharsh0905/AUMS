package schools

// CreateSchoolRequest represents the request payload for creating a new school.
type CreateSchoolRequest struct {
	CampusID string `json:"campus_id" validate:"required,uuid"`

	SchoolCode string `json:"school_code" validate:"required"`

	SchoolName string `json:"school_name" validate:"required"`

	Description string `json:"description,omitempty"`
}

// SchoolResponse represents the response details of a school.
type SchoolResponse struct {
	SchoolID    string `json:"school_id"`
	SchoolCode  string `json:"school_code"`
	SchoolName  string `json:"school_name"`
	Description string `json:"description"`
}
