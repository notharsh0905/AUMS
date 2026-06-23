package studentenrollments

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
) ([]generated.StudentEnrollment, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateStudentEnrollmentRequest,
) error {

	enrollmentID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	studentProfileID, err := aumsuuid.Parse(
		req.StudentProfileID,
	)

	if err != nil {
		return err
	}

	programID, err := aumsuuid.Parse(
		req.ProgramID,
	)

	if err != nil {
		return err
	}

	enrollmentDate, err := time.Parse(
		"2006-01-02",
		req.EnrollmentDate,
	)

	if err != nil {
		return err
	}

	var graduationDate pgtype.Date

	if req.GraduationDate != "" {

		t, err := time.Parse(
			"2006-01-02",
			req.GraduationDate,
		)

		if err != nil {
			return err
		}

		graduationDate = pgtype.Date{
			Time:  t,
			Valid: true,
		}
	}

	status := generated.StudentStatusACTIVE

	if req.Status != "" {
		status = generated.StudentStatus(
			req.Status,
		)
	}

	return s.repository.Create(
		ctx,
		generated.CreateStudentEnrollmentParams{
			EnrollmentID:     enrollmentID,
			StudentProfileID: studentProfileID,
			ProgramID:        programID,

			EnrollmentNumber: req.EnrollmentNumber,

			EnrollmentDate: pgtype.Date{
				Time:  enrollmentDate,
				Valid: true,
			},

			GraduationDate: graduationDate,

			Status: status,

			Remarks: pgtype.Text{
				String: req.Remarks,
				Valid:  req.Remarks != "",
			},
		},
	)
}
