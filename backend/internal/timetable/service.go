package timetable

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
) ([]generated.Timetable, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateTimetableRequest,
) error {

	timetableID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	academicYearID, err := aumsuuid.Parse(
		req.AcademicYearID,
	)

	if err != nil {
		return err
	}

	semesterID, err := aumsuuid.Parse(
		req.SemesterID,
	)

	if err != nil {
		return err
	}

	effectiveFrom, err := time.Parse(
		"2006-01-02",
		req.EffectiveFrom,
	)

	if err != nil {
		return err
	}

	var effectiveTo pgtype.Date

	if req.EffectiveTo != "" {

		date, err := time.Parse(
			"2006-01-02",
			req.EffectiveTo,
		)

		if err != nil {
			return err
		}

		effectiveTo = pgtype.Date{
			Time:  date,
			Valid: true,
		}
	}

	return s.repository.Create(
		ctx,
		generated.CreateTimetableParams{
			TimetableID:    timetableID,
			TimetableName:  req.TimetableName,
			AcademicYearID: academicYearID,
			SemesterID:     semesterID,

			EffectiveFrom: pgtype.Date{
				Time:  effectiveFrom,
				Valid: true,
			},

			EffectiveTo: effectiveTo,

			IsActive: req.IsActive,
		},
	)
}
