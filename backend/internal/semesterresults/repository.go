package semesterresults

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
	params db.CreateSemesterResultParams,
) error {

	return r.queries.CreateSemesterResult(
		ctx,
		params,
	)
}

func (r *Repository) List(
	ctx context.Context,
) ([]db.SemesterResult, error) {

	return r.queries.ListSemesterResults(
		ctx,
	)
}
