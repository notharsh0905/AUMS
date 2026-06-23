package students

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
) ([]generated.StudentProfile, error) {

	return r.queries.ListStudents(ctx)
}

func (r *Repository) Create(
	ctx context.Context,
	params generated.CreateStudentParams,
) error {

	return r.queries.CreateStudent(
		ctx,
		params,
	)
}
