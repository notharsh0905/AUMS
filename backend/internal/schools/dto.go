package schools

type CreateSchoolRequest struct {
	SchoolCode string `json:"school_code" binding:"required"`
	SchoolName string `json:"school_name" binding:"required"`

	Description string `json:"description"`
}
