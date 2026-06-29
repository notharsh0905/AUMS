package campuses

// CreateCampusRequest represents the request payload for creating a new campus.
type CreateCampusRequest struct {
	CampusCode string `json:"campus_code" validate:"required"`

	CampusName string `json:"campus_name" validate:"required"`

	Address string `json:"address,omitempty"`

	City string `json:"city,omitempty"`

	State string `json:"state,omitempty"`

	Country string `json:"country,omitempty"`

	PostalCode string `json:"postal_code,omitempty"`
}

// CampusResponse represents the response details of a campus.
type CampusResponse struct {
	CampusID     string `json:"campus_id"`
	CampusCode   string `json:"campus_code"`
	CampusName   string `json:"campus_name"`
	AddressLine1 string `json:"address_line_1"`
	AddressLine2 string `json:"address_line_2"`
	City         string `json:"city"`
	State        string `json:"state"`
	Country      string `json:"country"`
	PostalCode   string `json:"postal_code"`
}
