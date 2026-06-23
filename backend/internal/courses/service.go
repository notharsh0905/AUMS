package courses

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
) ([]generated.Course, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateCourseRequest,
) error {

	courseID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	var credits pgtype.Numeric

	err = credits.Scan(
		req.Credits,
	)

	if err != nil {
		return err
	}

	return s.repository.Create(
		ctx,
		generated.CreateCourseParams{
			CourseID:   courseID,
			CourseCode: req.CourseCode,
			CourseName: req.CourseName,

			CourseType: generated.CourseType(
				req.CourseType,
			),

			Credits: credits,

			ContactHours: pgtype.Int4{
				Int32: req.ContactHours,
				Valid: true,
			},

			Description: pgtype.Text{
				String: req.Description,
				Valid:  req.Description != "",
			},
		},
	)
}
