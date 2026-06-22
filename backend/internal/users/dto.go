package users

type CreateUserRequest struct {
	Username string `json:"username" validate:"required,min=3,max=100"`

	Email string `json:"email" validate:"required,email"`

	Password string `json:"password" validate:"required,min=8"`

	PhoneNumber string `json:"phone_number"`

	FirstName string `json:"first_name" validate:"required"`

	MiddleName string `json:"middle_name"`

	LastName string `json:"last_name"`
}

type UserResponse struct {
	UserID string `json:"user_id"`

	Username string `json:"username"`

	Email string `json:"email"`

	PhoneNumber string `json:"phone_number"`

	FirstName string `json:"first_name"`

	MiddleName string `json:"middle_name"`

	LastName string `json:"last_name"`

	Status string `json:"status"`
}
