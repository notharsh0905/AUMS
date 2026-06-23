package auth

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`

	IPAddress string `json:"-"`

	UserAgent string `json:"-"`
}

type LoginResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`

	TokenType string `json:"token_type"`

	ExpiresIn int64 `json:"expires_in"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token"`
}

type RefreshResponse struct {
	AccessToken string `json:"access_token"`

	TokenType string `json:"token_type"`

	ExpiresIn int64 `json:"expires_in"`
}

type LogoutRequest struct {
	RefreshToken string `json:"refresh_token"`
}
