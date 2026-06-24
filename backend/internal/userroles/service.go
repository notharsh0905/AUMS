package userroles

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

func (s *Service) HasRole(
	ctx context.Context,
	userID pgtype.UUID,
	roleCode string,
) (bool, error) {

	roles, err := s.repository.GetUserRoles(
		ctx,
		userID,
	)

	println("ROLES FOUND:", len(roles))

	if err != nil {
		return false, err
	}

	println("ROLES FOUND:", len(roles))

	for _, role := range roles {

		println("ROLE:", role.RoleCode)

		if role.RoleCode == roleCode {
			return true, nil
		}
	}

	return false, nil
}
