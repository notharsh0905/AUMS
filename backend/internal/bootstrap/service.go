package bootstrap

import (
	"context"
)

type Service struct {
}

func NewService() *Service {
	return &Service{}
}

func (s *Service) CreateSuperAdmin(
	ctx context.Context,
) error {

	return nil
}
