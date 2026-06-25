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
			SemesterID: semesterID,

			AcademicYearID: academicYearID,

			SemesterNumber: req.SemesterNumber,

			SemesterName: req.SemesterName,

			StartDate: pgtype.Date{
				Time:  startDate,
				Valid: true,
			},

			EndDate: pgtype.Date{
				Time:  endDate,
				Valid: true,
			},
			IsActive: true,
		},
	)
}

func (s *Service) ListPaginated(
	ctx context.Context,
	page int,
	limit int,
) ([]generated.Semester, int64, error) {

	offset := (page - 1) * limit

	data, err := s.repository.ListPaginated(
		ctx,
		int32(limit),
		int32(offset),
	)

	if err != nil {
		return nil, 0, err
	}

	total, err := s.repository.Count(
		ctx,
	)

	if err != nil {
		return nil, 0, err
	}

	return data, total, nil
}
