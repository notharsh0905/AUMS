package parents

type ParentProfileResponse struct {
	ParentProfileID string  `json:"parent_profile_id"`
	UserID          string  `json:"user_id"`
	Occupation      string  `json:"occupation,omitempty"`
	AnnualIncome    float64 `json:"annual_income,omitempty"`
	EmployerName    string  `json:"employer_name,omitempty"`
	OfficeAddress   string  `json:"office_address,omitempty"`
}

type ParentWardResponse struct {
	StudentProfileID  string `json:"student_profile_id"`
	StudentUserID     string `json:"student_user_id"`
	FirstName         string `json:"first_name"`
	LastName          string `json:"last_name"`
	Email             string `json:"email"`
	RelationshipType  string `json:"relationship_type"`
	IsPrimaryContact  bool   `json:"is_primary_contact"`
	CanViewAttendance bool   `json:"can_view_attendance"`
	CanViewResults    bool   `json:"can_view_results"`
}
