package courseresults

import (
	"context"

	db "aums/backend/internal/db/generated"
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

func (s *Service) Create(
	ctx context.Context,
	params db.CreateCourseResultParams,
) error {
	return s.repository.Create(
		ctx,
		params,
	)
}

func (s *Service) List(
	ctx context.Context,
) ([]db.CourseResult, error) {
	return s.repository.List(
		ctx,
	)
}
