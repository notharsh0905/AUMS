package students

type CreateStudentRequest struct {
	UserID string `json:"user_id" validate:"required,uuid"`

	AdmissionDate string `json:"admission_date,omitempty"`
	DateOfBirth   string `json:"date_of_birth,omitempty"`

	Gender string `json:"gender,omitempty" validate:"oneof=MALE FEMALE OTHER"`

	BloodGroup string `json:"blood_group,omitempty"`

	Nationality string `json:"nationality,omitempty"`
	Category    string `json:"category,omitempty"`
	Religion    string `json:"religion,omitempty"`

	EmergencyContactName string `json:"emergency_contact_name,omitempty"`

	EmergencyContactPhone string `json:"emergency_contact_phone,omitempty"`
}
