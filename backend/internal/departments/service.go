package departments

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
) ([]generated.Department, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateDepartmentRequest,
) error {

	departmentID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	schoolID, err := aumsuuid.Parse(
		req.SchoolID,
	)

	if err != nil {
		return err
	}

	return s.repository.Create(
		ctx,
		generated.CreateDepartmentParams{
			DepartmentID:   departmentID,
			SchoolID:       schoolID,
			DepartmentCode: req.DepartmentCode,
			DepartmentName: req.DepartmentName,

			Description: pgtype.Text{
				String: req.Description,
				Valid:  req.Description != "",
			},
		},
	)
}

func (s *Service) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]generated.Department, error) {

	return s.repository.ListPaginated(
		ctx,
		limit,
		offset,
	)
}

func (s *Service) Count(
	ctx context.Context,
) (int64, error) {

	return s.repository.Count(ctx)
}
