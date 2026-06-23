package courseofferings

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
) ([]generated.CourseOffering, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateCourseOfferingRequest,
) error {

	offeringID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	courseID, err := aumsuuid.Parse(
		req.CourseID,
	)

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

	status := generated.OfferingStatusPLANNED

	if req.Status != "" {
		status = generated.OfferingStatus(
			req.Status,
		)
	}

	return s.repository.Create(
		ctx,
		generated.CreateCourseOfferingParams{
			CourseOfferingID: offeringID,
			CourseID:         courseID,
			AcademicYearID:   academicYearID,
			SemesterID:       semesterID,

			Section: pgtype.Text{
				String: req.Section,
				Valid:  req.Section != "",
			},

			Status: status,

			MaxCapacity: pgtype.Int4{
				Int32: req.MaxCapacity,
				Valid: req.MaxCapacity > 0,
			},
		},
	)
}
