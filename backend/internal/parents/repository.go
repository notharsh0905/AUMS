package parents

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

func (r *Repository) GetProfileByUserID(
	ctx context.Context,
	userID pgtype.UUID,
) (generated.ParentProfile, error) {

	return r.queries.GetParentProfileByUserID(
		ctx,
		userID,
	)
}

func (r *Repository) ListWards(
	ctx context.Context,
	userID pgtype.UUID,
) ([]generated.ListParentWardsRow, error) {

	return r.queries.ListParentWards(
		ctx,
		userID,
	)
}
