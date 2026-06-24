package faculty

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
) ([]generated.FacultyProfile, error) {

	return r.queries.ListFaculty(
		ctx,
	)
}

func (r *Repository) Create(
	ctx context.Context,
	params generated.CreateFacultyParams,
) error {

	return r.queries.CreateFaculty(
		ctx,
		params,
	)
}

func (r *Repository) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]generated.FacultyProfile, error) {

	return r.queries.ListFacultyPaginated(
		ctx,
		generated.ListFacultyPaginatedParams{
			Limit:  limit,
			Offset: offset,
		},
	)
}

func (r *Repository) Count(
	ctx context.Context,
) (int64, error) {

	return r.queries.CountFaculty(
		ctx,
	)
}
