package sessions

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

func (r *Repository) Create(
	ctx context.Context,
	params generated.CreateSessionParams,
) error {

	return r.queries.CreateSession(
		ctx,
		params,
	)
}

func (r *Repository) Delete(
	ctx context.Context,
	sessionID pgtype.UUID,
) error {

	return r.queries.DeleteSession(
		ctx,
		sessionID,
	)
}

func (r *Repository) GetByUser(
	ctx context.Context,
	userID pgtype.UUID,
) ([]generated.UserSession, error) {

	return r.queries.GetSessionsByUser(
		ctx,
		userID,
	)
}

func (r *Repository) GetByRefreshTokenHash(
	ctx context.Context,
	hash string,
) (generated.UserSession, error) {

	return r.queries.GetSessionByRefreshTokenHash(
		ctx,
		hash,
	)
}
