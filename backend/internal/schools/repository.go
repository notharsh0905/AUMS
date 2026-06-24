package schools

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
) ([]generated.School, error) {

	return r.queries.ListSchools(
		ctx,
	)
}

func (r *Repository) Create(
	ctx context.Context,
	params generated.CreateSchoolParams,
) error {

	return r.queries.CreateSchool(
		ctx,
		params,
	)
}
func (r *Repository) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]generated.School, error) {

	return r.queries.ListSchoolsPaginated(
		ctx,
		generated.ListSchoolsPaginatedParams{
			Limit:  limit,
			Offset: offset,
		},
	)
}

func (r *Repository) Count(
	ctx context.Context,
) (int64, error) {

	return r.queries.CountSchools(ctx)
}
