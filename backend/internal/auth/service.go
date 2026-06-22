package auth

import (
	"context"
	"errors"
	"time"

	"aums/backend/configs"
	aumsjwt "aums/backend/pkg/jwt"
	"aums/backend/pkg/password"

	"aums/backend/internal/users"
)

type Service struct {
	config         *configs.Config
	userRepository *users.Repository
}

func NewService(
	config *configs.Config,
	userRepository *users.Repository,
) *Service {

	return &Service{
		config:         config,
		userRepository: userRepository,
	}
}

func (s *Service) Login(
	ctx context.Context,
	req LoginRequest,
) (*LoginResponse, error) {

	user, err := s.userRepository.GetByEmail(
		ctx,
		req.Email,
	)

	if err != nil {
		return nil, err
	}

	if !user.PasswordHash.Valid {
		return nil, errors.New("invalid credentials")
	}

	err = password.Verify(
		user.PasswordHash.String,
		req.Password,
	)

	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	token, err := aumsjwt.GenerateAccessToken(
		user.UserID.String(),
		s.config.JWT.Secret,
		s.config.JWT.Issuer,
		time.Duration(
			s.config.JWT.AccessTokenDurationMinutes,
		)*time.Minute,
	)

	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken: token,
		TokenType:   "Bearer",
		ExpiresIn: int64(
			s.config.JWT.AccessTokenDurationMinutes * 60,
		),
	}, nil
}
