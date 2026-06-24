package programs

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
) ([]generated.Program, error) {

	return s.repository.List(ctx)
}
func (s *Service) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]generated.Program, error) {

	return s.repository.ListPaginated(
		ctx,
		limit,
		offset,
	)
}

func (s *Service) Count(
	ctx context.Context,
) (int64, error) {

	return s.repository.Count(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateProgramRequest,
) error {

	programID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	departmentID, err := aumsuuid.Parse(
		req.DepartmentID,
	)

	if err != nil {
		return err
	}

	return s.repository.Create(
		ctx,
		generated.CreateProgramParams{
			ProgramID:     programID,
			DepartmentID:  departmentID,
			ProgramCode:   req.ProgramCode,
			ProgramName:   req.ProgramName,
			DegreeType:    generated.DegreeType(req.DegreeType),
			DurationValue: req.DurationValue,
			DurationUnit:  req.DurationUnit,
			TotalSemesters: pgtype.Int4{
				Int32: req.TotalSemesters,
				Valid: req.TotalSemesters > 0,
			},
		},
	)
}
