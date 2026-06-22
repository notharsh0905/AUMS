package users

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

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{
		db:      db,
		queries: generated.New(db),
	}
}

func (r *Repository) GetByID(
	ctx context.Context,
	userID pgtype.UUID,
) (generated.User, error) {

	return r.queries.GetUserByID(ctx, userID)
}

func (r *Repository) GetByEmail(
	ctx context.Context,
	email string,
) (generated.User, error) {

	return r.queries.GetUserByEmail(ctx, email)
}

func (r *Repository) Create(
	ctx context.Context,
	params generated.CreateUserParams,
) (generated.User, error) {

	return r.queries.CreateUser(ctx, params)
}

func (r *Repository) List(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]generated.User, error) {

	return r.queries.ListUsers(
		ctx,
		generated.ListUsersParams{
			Limit:  limit,
			Offset: offset,
		},
	)
}

func (r *Repository) VerifyEmail(
	ctx context.Context,
	userID pgtype.UUID,
) error {

	return r.queries.VerifyEmail(ctx, userID)
}

func (r *Repository) UpdateLastLogin(
	ctx context.Context,
	userID pgtype.UUID,
) error {

	return r.queries.UpdateLastLogin(ctx, userID)
}

func (r *Repository) SoftDelete(
	ctx context.Context,
	userID pgtype.UUID,
) error {

	return r.queries.SoftDeleteUser(ctx, userID)
}
