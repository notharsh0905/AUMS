package userroles

import (
	"context"

	"aums/backend/internal/db/generated"

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

func (s *Service) HasRole(
	ctx context.Context,
	userID pgtype.UUID,
	roleCode string,
) (bool, error) {

	roles, err := s.repository.GetUserRoles(
		ctx,
		userID,
	)

	if err != nil {
		return false, err
	}

	for _, role := range roles {
		if role.RoleCode == roleCode {
			return true, nil
		}
	}

	return false, nil
}

func (s *Service) GetUserRoles(
	ctx context.Context,
	userID pgtype.UUID,
) ([]generated.Role, error) {

	return s.repository.GetUserRoles(
		ctx,
		userID,
	)
}
