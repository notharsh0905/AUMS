package semesters

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
) ([]generated.Semester, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateSemesterRequest,
) error {

	semesterID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	academicYearID, err := aumsuuid.Parse(
		req.AcademicYearID,
	)

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
		generated.CreateSemesterParams{
			SemesterID:     semesterID,
			AcademicYearID: academicYearID,
			SemesterNumber: req.SemesterNumber,
			SemesterName:   req.SemesterName,

			StartDate: pgtype.Date{
				Time:  startDate,
				Valid: true,
			},

			EndDate: pgtype.Date{
				Time:  endDate,
				Valid: true,
			},

			IsActive: req.IsActive,
		},
	)
}
func (s *Service) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]generated.Semester, error) {

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
