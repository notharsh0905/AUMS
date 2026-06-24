package students

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
) ([]generated.StudentProfile, error) {

	return s.repository.List(ctx)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateStudentRequest,
) error {

	studentID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	userID, err := aumsuuid.Parse(
		req.UserID,
	)

	if err != nil {
		return err
	}

	var admissionDate pgtype.Date
	if req.AdmissionDate != "" {

		t, err := time.Parse(
			"2006-01-02",
			req.AdmissionDate,
		)

		if err != nil {
			return err
		}

		admissionDate = pgtype.Date{
			Time:  t,
			Valid: true,
		}
	}

	var dob pgtype.Date
	if req.DateOfBirth != "" {

		t, err := time.Parse(
			"2006-01-02",
			req.DateOfBirth,
		)

		if err != nil {
			return err
		}

		dob = pgtype.Date{
			Time:  t,
			Valid: true,
		}
	}

	return s.repository.Create(
		ctx,
		generated.CreateStudentParams{
			StudentProfileID: studentID,
			UserID:           userID,

			AdmissionDate: admissionDate,
			DateOfBirth:   dob,

			Gender: pgtype.Text{
				String: req.Gender,
				Valid:  req.Gender != "",
			},

			BloodGroup: pgtype.Text{
				String: req.BloodGroup,
				Valid:  req.BloodGroup != "",
			},

			Nationality: pgtype.Text{
				String: req.Nationality,
				Valid:  req.Nationality != "",
			},

			Category: pgtype.Text{
				String: req.Category,
				Valid:  req.Category != "",
			},

			Religion: pgtype.Text{
				String: req.Religion,
				Valid:  req.Religion != "",
			},

			EmergencyContactName: pgtype.Text{
				String: req.EmergencyContactName,
				Valid:  req.EmergencyContactName != "",
			},

			EmergencyContactPhone: pgtype.Text{
				String: req.EmergencyContactPhone,
				Valid:  req.EmergencyContactPhone != "",
			},
		},
	)
}

func (s *Service) ListPaginated(
	ctx context.Context,
	page int,
	limit int,
) (
	[]generated.StudentProfile,
	int64,
	error,
) {

	students, err := s.repository.ListPaginated(
		ctx,
		page,
		limit,
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

	return students, total, nil
}
