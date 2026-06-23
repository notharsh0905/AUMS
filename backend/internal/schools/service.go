package schools

import (
	"context"

	"aums/backend/internal/db/generated"
	aumsuuid "aums/backend/pkg/uuid"

	"github.com/jackc/pgx/v5/pgtype"
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
) ([]generated.School, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateSchoolRequest,
) error {

	schoolID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	return s.repository.Create(
		ctx,
		generated.CreateSchoolParams{
			SchoolID:   schoolID,
			SchoolCode: req.SchoolCode,
			SchoolName: req.SchoolName,
			Description: pgtype.Text{
				String: req.Description,
				Valid:  req.Description != "",
			},
		},
	)
}
