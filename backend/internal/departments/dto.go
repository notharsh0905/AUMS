package departments

type CreateDepartmentRequest struct {
	SchoolID string `json:"school_id" binding:"required"`

	DepartmentCode string `json:"department_code" binding:"required"`
	DepartmentName string `json:"department_name" binding:"required"`

	Description string `json:"description"`
}
