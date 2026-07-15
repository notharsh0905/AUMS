package auth

// LoginRequest represents the login request payload.
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`

	IPAddress string `json:"-"`

	UserAgent string `json:"-"`
}

// LoginResponse represents the response returned after successful login.
type LoginResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`

	TokenType string `json:"token_type"`

	ExpiresIn int64 `json:"expires_in"`
}

// RefreshRequest represents the request payload to refresh an access token.
type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

// RefreshResponse represents the response containing the new access token.
type RefreshResponse struct {
	AccessToken string `json:"access_token"`

	TokenType string `json:"token_type"`

	ExpiresIn int64 `json:"expires_in"`
}

// LogoutRequest represents the request payload to log out a user.
type LogoutRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

// GetMeResponse represents the response details of the authenticated user.
type GetMeResponse struct {
	UserID      string   `json:"user_id"`
	Username    string   `json:"username"`
	Email       string   `json:"email"`
	FirstName   string   `json:"first_name"`
	LastName    string   `json:"last_name"`
	Status      string   `json:"status"`
	Roles       []string `json:"roles"`
	Permissions []string `json:"permissions"`
}
