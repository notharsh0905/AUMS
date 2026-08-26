package parents

import (
	"context"

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

func (s *Service) GetProfile(
	ctx context.Context,
	userID pgtype.UUID,
) (ParentProfileResponse, error) {

	profile, err := s.repository.GetProfileByUserID(ctx, userID)
	if err != nil {
		return ParentProfileResponse{}, err
	}

	income, _ := profile.AnnualIncome.Float64Value()

	return ParentProfileResponse{
		ParentProfileID: profile.ParentProfileID.String(),
		UserID:          profile.UserID.String(),
		Occupation:      profile.Occupation.String,
		AnnualIncome:    income.Float64,
		EmployerName:    profile.EmployerName.String,
		OfficeAddress:   profile.OfficeAddress.String,
	}, nil
}

func (s *Service) ListWards(
	ctx context.Context,
	userID pgtype.UUID,
) ([]ParentWardResponse, error) {

	rows, err := s.repository.ListWards(ctx, userID)
	if err != nil {
		return nil, err
	}

	wards := make([]ParentWardResponse, 0, len(rows))
	for _, r := range rows {
		wards = append(wards, ParentWardResponse{
			StudentProfileID:  r.StudentProfileID.String(),
			StudentUserID:     r.StudentUserID.String(),
			FirstName:         r.FirstName,
			LastName:          r.LastName.String,
			Email:             r.Email,
			RelationshipType:  string(r.RelationshipType),
			IsPrimaryContact:  r.IsPrimaryContact,
			CanViewAttendance: r.CanViewAttendance,
			CanViewResults:    r.CanViewResults,
		})
	}

	return wards, nil
}
