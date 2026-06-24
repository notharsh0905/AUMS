package semesters

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

func (r *Repository) List(
	ctx context.Context,
) ([]generated.Semester, error) {

	return r.queries.ListSemesters(
		ctx,
	)
}

func (r *Repository) Create(
	ctx context.Context,
	params generated.CreateSemesterParams,
) error {

	return r.queries.CreateSemester(
		ctx,
		params,
	)
}
func (r *Repository) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]generated.Semester, error) {

	return r.queries.ListSemestersPaginated(
		ctx,
		generated.ListSemestersPaginatedParams{
			Limit:  limit,
			Offset: offset,
		},
	)
}

func (r *Repository) Count(
	ctx context.Context,
) (int64, error) {

	return r.queries.CountSemesters(ctx)
}
