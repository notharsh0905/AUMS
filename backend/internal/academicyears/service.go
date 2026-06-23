package academicyears

import (
	"context"
	"time"

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
) ([]generated.AcademicYear, error) {

	return s.repository.List(ctx)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateAcademicYearRequest,
) error {

	academicYearID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	startDate, err := time.Parse(
		"2006-01-02",
		req.StartDate,
	)

	if err != nil {
		return err
	}

	endDate, err := time.Parse(
		"2006-01-02",
		req.EndDate,
	)

	if err != nil {
		return err
	}

	return s.repository.Create(
		ctx,
		generated.CreateAcademicYearParams{
			AcademicYearID:   academicYearID,
			AcademicYearName: req.AcademicYearName,

			StartDate: pgtype.Date{
				Time:  startDate,
				Valid: true,
			},

			EndDate: pgtype.Date{
				Time:  endDate,
				Valid: true,
			},

			IsCurrent: req.IsCurrent,
		},
	)
}
