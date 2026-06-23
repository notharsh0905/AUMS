package campuses

type CreateCampusRequest struct {
	CampusCode string `json:"campus_code" binding:"required"`
	CampusName string `json:"campus_name" binding:"required"`

	AddressLine1 string `json:"address_line_1"`
	AddressLine2 string `json:"address_line_2"`
	City         string `json:"city"`
	State        string `json:"state"`
	Country      string `json:"country"`
	PostalCode   string `json:"postal_code"`
}
