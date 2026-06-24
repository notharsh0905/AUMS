package courses

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
) ([]generated.Course, error) {

	return r.queries.ListCourses(
		ctx,
	)
}

func (r *Repository) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]generated.Course, error) {

	return r.queries.ListCoursesPaginated(
		ctx,
		generated.ListCoursesPaginatedParams{
			Limit:  limit,
			Offset: offset,
		},
	)
}

func (r *Repository) Count(
	ctx context.Context,
) (int64, error) {

	return r.queries.CountCourses(
		ctx,
	)
}

func (r *Repository) Create(
	ctx context.Context,
	params generated.CreateCourseParams,
) error {

	return r.queries.CreateCourse(
		ctx,
		params,
	)
}
