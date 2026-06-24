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
	req CreateCourseResultRequest,
) error {

	// conversion logic goes here

	return nil
}

func (s *Service) List(
	ctx context.Context,
) ([]db.CourseResult, error) {
	return s.repository.List(
		ctx,
	)
}
