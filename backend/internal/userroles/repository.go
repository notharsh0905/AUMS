package userroles

import (
	"context"

	"aums/backend/internal/db/generated"

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

func (r *Repository) AssignRole(
	ctx context.Context,
	params generated.AssignRoleToUserParams,
) error {

	return r.queries.AssignRoleToUser(
		ctx,
		params,
	)
}

func (r *Repository) GetUserRoles(
	ctx context.Context,
	userID pgtype.UUID,
) ([]generated.Role, error) {

	return r.queries.GetUserRoles(
		ctx,
		userID,
	)
}
