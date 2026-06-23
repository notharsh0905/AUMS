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
