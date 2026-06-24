package semesterresults

import (
	"context"

	db "aums/backend/internal/db/generated"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	queries *db.Queries
}

func NewRepository(
	database *pgxpool.Pool,
) *Repository {

	return &Repository{
		queries: db.New(database),
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
