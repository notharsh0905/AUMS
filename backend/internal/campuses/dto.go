package campuses

type CreateCampusRequest struct {
	CampusCode string `json:"campus_code" validate:"required"`

	CampusName string `json:"campus_name" validate:"required"`

	Address string `json:"address,omitempty"`

	City string `json:"city,omitempty"`

	State string `json:"state,omitempty"`

	Country string `json:"country,omitempty"`

	PostalCode string `json:"postal_code,omitempty"`
}
