package auth

import (
	"context"

	"aums/backend/internal/users"
)

type Service struct {
	userRepository *users.Repository
}

func NewService(
	userRepository *users.Repository,
) *Service {

	return &Service{
		userRepository: userRepository,
	}
}

func (s *Service) Login(
	ctx context.Context,
	req LoginRequest,
) error {

	_, err := s.userRepository.GetByEmail(
		ctx,
		req.Email,
	)

	if err != nil {
		return err
	}

	return nil
}
