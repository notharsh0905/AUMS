package faculty

type CreateFacultyRequest struct {
	UserID string `json:"user_id" validate:"required,uuid"`

	EmployeeCode string `json:"employee_code" validate:"required"`

	DepartmentID string `json:"department_id" validate:"required,uuid"`

	Designation string `json:"designation" validate:"required"`

	EmploymentType string `json:"employment_type" validate:"required"`

	JoiningDate string `json:"joining_date" validate:"required"`

	Status string `json:"status" validate:"required"`

	YearsOfExperience string `json:"years_of_experience,omitempty"`

	OfficeLocation string `json:"office_location,omitempty"`

	Bio string `json:"bio,omitempty"`
}
