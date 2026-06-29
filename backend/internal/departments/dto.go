package departments

// CreateDepartmentRequest represents the request payload for creating a new department.
type CreateDepartmentRequest struct {
	SchoolID string `json:"school_id" validate:"required,uuid"`

	DepartmentCode string `json:"department_code" validate:"required"`

	DepartmentName string `json:"department_name" validate:"required"`

	Description string `json:"description,omitempty"`
}

// DepartmentResponse represents the response details of a department.
type DepartmentResponse struct {
	DepartmentID   string `json:"department_id"`
	SchoolID       string `json:"school_id"`
	DepartmentCode string `json:"department_code"`
	DepartmentName string `json:"department_name"`
	Description    string `json:"description"`
}
