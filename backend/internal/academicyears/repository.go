package academicyears

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
) ([]generated.AcademicYear, error) {

	return r.queries.ListAcademicYears(
		ctx,
	)
}

func (r *Repository) Create(
	ctx context.Context,
	params generated.CreateAcademicYearParams,
) error {

	return r.queries.CreateAcademicYear(
		ctx,
		params,
	)
}
func (r *Repository) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]generated.AcademicYear, error) {

	return r.queries.ListAcademicYearsPaginated(
		ctx,
		generated.ListAcademicYearsPaginatedParams{
			Limit:  limit,
			Offset: offset,
		},
	)
}

func (r *Repository) Count(
	ctx context.Context,
) (int64, error) {

	return r.queries.CountAcademicYears(ctx)
}
