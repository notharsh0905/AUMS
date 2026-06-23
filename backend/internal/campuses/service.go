package campuses

import (
	"context"

	"aums/backend/internal/db/generated"
)

type Service struct {
	repository *Repository
}

func NewService(
	repository *Repository,
) *Service {

	return &Service{
		repository: repository,
	}
}

func (s *Service) List(
	ctx context.Context,
) ([]generated.Campuse, error) {

	return s.repository.List(
		ctx,
	)
}
