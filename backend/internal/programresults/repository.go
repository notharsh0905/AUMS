package programresults

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
	params db.CreateProgramResultParams,
) error {

	return r.queries.CreateProgramResult(
		ctx,
		params,
	)
}

func (r *Repository) List(
	ctx context.Context,
) ([]db.ProgramResult, error) {

	return r.queries.ListProgramResults(
		ctx,
	)
}
