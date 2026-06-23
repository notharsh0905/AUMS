package rolepermissions

import (
	"context"

	"aums/backend/internal/db/generated"
	uuidpkg "aums/backend/pkg/uuid"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db      *pgxpool.Pool
	queries *generated.Queries
}

func NewRepository(
	db *pgxpool.Pool,
) *Repository {

	return &Repository{
		db:      db,
		queries: generated.New(db),
	}
}

func (r *Repository) AssignPermissionToRole(
	ctx context.Context,
	roleID pgtype.UUID,
	permissionID pgtype.UUID,
) error {

	rolePermissionID, err := uuidpkg.New()
	if err != nil {
		return err
	}

	return r.queries.AssignPermissionToRole(
		ctx,
		generated.AssignPermissionToRoleParams{
			RolePermissionID: rolePermissionID,
			RoleID:           roleID,
			PermissionID:     permissionID,
		},
	)
}

func (r *Repository) GetRolePermissions(
	ctx context.Context,
	roleID pgtype.UUID,
) ([]generated.Permission, error) {

	return r.queries.GetRolePermissions(
		ctx,
		roleID,
	)
}

func (r *Repository) RemovePermissionFromRole(
	ctx context.Context,
	roleID pgtype.UUID,
	permissionID pgtype.UUID,
) error {

	return r.queries.RemovePermissionFromRole(
		ctx,
		generated.RemovePermissionFromRoleParams{
			RoleID:       roleID,
			PermissionID: permissionID,
		},
	)
}
