package students

import (
	"context"
	"time"

	"aums/backend/internal/db/generated"
	"aums/backend/internal/userroles"
	aumsuuid "aums/backend/pkg/uuid"

	"github.com/jackc/pgx/v5/pgtype"
)

type Service struct {
	repository       *Repository
	userRolesService *userroles.Service
}

func NewService(
	repository *Repository,
	userRolesService *userroles.Service,
) *Service {

	return &Service{
		repository:       repository,
		userRolesService: userRolesService,
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

func (s *Service) ListPaginatedScoped(
	ctx context.Context,
	callerUserID pgtype.UUID,
	page int,
	limit int,
) (
	[]generated.StudentProfile,
	int64,
	error,
) {
	if s.userRolesService != nil {
		// Scoping for student: only own student profile
		isStudent, _ := s.userRolesService.HasRole(ctx, callerUserID, "STUDENT")
		if isStudent {
			profile, err := s.repository.GetByUserID(ctx, callerUserID)
			if err != nil {
				return []generated.StudentProfile{}, 0, nil
			}
			return []generated.StudentProfile{profile}, 1, nil
		}

		// Scoping for parent: only linked children
		isParent, _ := s.userRolesService.HasRole(ctx, callerUserID, "PARENT")
		if isParent {
			profiles, err := s.repository.ListByParentUserID(ctx, callerUserID)
			if err != nil {
				return []generated.StudentProfile{}, 0, nil
			}
			return profiles, int64(len(profiles)), nil
		}
	}

	// Default administrative & academic listing
	return s.ListPaginated(ctx, page, limit)
}

func (s *Service) GetByID(
	ctx context.Context,
	callerUserID pgtype.UUID,
	studentProfileID pgtype.UUID,
) (generated.StudentProfile, bool, error) {
	profile, err := s.repository.GetByID(ctx, studentProfileID)
	if err != nil {
		return generated.StudentProfile{}, false, err
	}

	if s.userRolesService != nil {
		isStudent, _ := s.userRolesService.HasRole(ctx, callerUserID, "STUDENT")
		if isStudent {
			if profile.UserID != callerUserID {
				return generated.StudentProfile{}, false, nil
			}
		}

		isParent, _ := s.userRolesService.HasRole(ctx, callerUserID, "PARENT")
		if isParent {
			wards, _ := s.repository.ListByParentUserID(ctx, callerUserID)
			isWard := false
			for _, w := range wards {
				if w.StudentProfileID == studentProfileID {
					isWard = true
					break
				}
			}
			if !isWard {
				return generated.StudentProfile{}, false, nil
			}
		}
	}

	return profile, true, nil
}
