package campuses

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
) ([]generated.Campuse, error) {

	return s.repository.List(
		ctx,
	)
}
func (s *Service) Create(
	ctx context.Context,
	req CreateCampusRequest,
) error {

	campusID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	return s.repository.Create(
		ctx,
		generated.CreateCampusParams{
			CampusID: campusID,

			CampusCode: req.CampusCode,
			CampusName: req.CampusName,

			AddressLine1: pgtype.Text{
				String: req.AddressLine1,
				Valid:  req.AddressLine1 != "",
			},

			AddressLine2: pgtype.Text{
				String: req.AddressLine2,
				Valid:  req.AddressLine2 != "",
			},

			City: pgtype.Text{
				String: req.City,
				Valid:  req.City != "",
			},

			State: pgtype.Text{
				String: req.State,
				Valid:  req.State != "",
			},

			Country: pgtype.Text{
				String: req.Country,
				Valid:  req.Country != "",
			},

			PostalCode: pgtype.Text{
				String: req.PostalCode,
				Valid:  req.PostalCode != "",
			},
		},
	)
}
