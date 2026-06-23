package rolepermissions

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

func (s *Service) AssignPermissionToRole(
	ctx context.Context,
	roleID pgtype.UUID,
	permissionID pgtype.UUID,
) error {

	return s.repository.AssignPermissionToRole(
		ctx,
		roleID,
		permissionID,
	)
}

func (s *Service) GetRolePermissions(
	ctx context.Context,
	roleID pgtype.UUID,
) ([]generated.Permission, error) {

	return s.repository.GetRolePermissions(
		ctx,
		roleID,
	)
}

/*func (s *Service) RemovePermissionFromRole(
	ctx context.Context,
	roleID pgtype.UUID,
	permissionID pgtype.UUID,
) error {

	return s.repository.RemovePermissionFromRole(
		ctx,
		roleID,
		permissionID,
	)
}*/

func (s *Service) HasPermission(
	ctx context.Context,
	userID pgtype.UUID,
	permissionCode string,
) (bool, error) {

	permissions, err := s.repository.GetUserPermissions(
		ctx,
		userID,
	)

	if err != nil {
		return false, err
	}

	for _, permission := range permissions {

		if permission.PermissionCode == permissionCode {
			return true, nil
		}
	}

	return false, nil
}

func (s *Service) RemovePermissionFromRole(
	ctx context.Context,
	roleID pgtype.UUID,
	permissionID pgtype.UUID,
) error {

	return s.repository.RemovePermissionFromRole(
		ctx,
		roleID,
		permissionID,
	)
}
