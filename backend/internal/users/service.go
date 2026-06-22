package users

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

func (s *Service) GetByEmail(
	ctx context.Context,
	email string,
) (generated.User, error) {

	return s.repository.GetByEmail(
		ctx,
		email,
	)
}

func (s *Service) List(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]generated.User, error) {

	return s.repository.List(
		ctx,
		limit,
		offset,
	)
}
