package assignmentsubmissions

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
) ([]generated.AssignmentSubmission, error) {

	return r.queries.ListAssignmentSubmissions(
		ctx,
	)
}

func (r *Repository) Create(
	ctx context.Context,
	params generated.CreateAssignmentSubmissionParams,
) error {

	return r.queries.CreateAssignmentSubmission(
		ctx,
		params,
	)
}
