package departments

type CreateDepartmentRequest struct {
	SchoolID string `json:"school_id" validate:"required,uuid"`

	DepartmentCode string `json:"department_code" validate:"required"`

	DepartmentName string `json:"department_name" validate:"required"`

	Description string `json:"description,omitempty"`
}
