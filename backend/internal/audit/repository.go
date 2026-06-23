package audit

import (
	"context"

	"aums/backend/internal/db/generated"

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

func (r *Repository) CreateAuditLog(
	ctx context.Context,
	params generated.CreateAuditLogParams,
) error {

	return r.queries.CreateAuditLog(
		ctx,
		params,
	)
}

func (r *Repository) CreateLoginAuditLog(
	ctx context.Context,
	params generated.CreateLoginAuditLogParams,
) error {

	return r.queries.CreateLoginAuditLog(
		ctx,
		params,
	)
}
