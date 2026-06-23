package faculty

type CreateFacultyRequest struct {
	UserID string `json:"user_id" binding:"required"`

	EmployeeCode string `json:"employee_code" binding:"required"`

	DepartmentID string `json:"department_id" binding:"required"`

	Designation string `json:"designation" binding:"required"`

	EmploymentType string `json:"employment_type" binding:"required"`

	JoiningDate string `json:"joining_date" binding:"required"`

	Status string `json:"status"`

	YearsOfExperience string `json:"years_of_experience"`

	OfficeLocation string `json:"office_location"`

	Bio string `json:"bio"`
}
