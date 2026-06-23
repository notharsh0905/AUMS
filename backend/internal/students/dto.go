package students

type CreateStudentRequest struct {
	UserID string `json:"user_id" binding:"required"`

	AdmissionDate string `json:"admission_date"`
	DateOfBirth   string `json:"date_of_birth"`

	Gender     string `json:"gender"`
	BloodGroup string `json:"blood_group"`

	Nationality string `json:"nationality"`
	Category    string `json:"category"`
	Religion    string `json:"religion"`

	EmergencyContactName  string `json:"emergency_contact_name"`
	EmergencyContactPhone string `json:"emergency_contact_phone"`
}
