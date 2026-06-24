package courseresults

import (
	"context"

	db "aums/backend/internal/db/generated"
)

type Repository struct {
	queries *db.Queries
}

func NewRepository(
	queries *db.Queries,
) *Repository {
	return &Repository{
		queries: queries,
	}
}

func (r *Repository) Create(
	ctx context.Context,
	params db.CreateCourseResultParams,
) error {
	return r.queries.CreateCourseResult(
		ctx,
		params,
	)
}

func (r *Repository) List(
	ctx context.Context,
) ([]db.CourseResult, error) {
	return r.queries.ListCourseResults(
		ctx,
	)
}
