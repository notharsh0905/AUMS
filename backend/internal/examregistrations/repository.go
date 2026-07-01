package examregistrations

import (
	"context"

	"aums/backend/internal/db/generated"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db      *pgxpool.Pool
	queries *generated.Queries
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{
		db:      db,
		queries: generated.New(db),
	}
}

func (r *Repository) List(ctx context.Context) ([]generated.ExamRegistration, error) {
	return r.queries.ListExamRegistrations(ctx)
}

func (r *Repository) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
	examID string,
	enrollmentID string,
	status string,
) ([]generated.ExamRegistration, error) {
	return r.queries.ListExamRegistrationsPaginated(
		ctx,
		generated.ListExamRegistrationsPaginatedParams{
			Limit:   limit,
			Offset:  offset,
			Column3: examID,
			Column4: enrollmentID,
			Column5: status,
		},
	)
}

func (r *Repository) Count(
	ctx context.Context,
	examID string,
	enrollmentID string,
	status string,
) (int64, error) {
	return r.queries.CountExamRegistrations(
		ctx,
		generated.CountExamRegistrationsParams{
			Column1: examID,
			Column2: enrollmentID,
			Column3: status,
		},
	)
}

func (r *Repository) Get(ctx context.Context, id pgtype.UUID) (generated.ExamRegistration, error) {
	return r.queries.GetExamRegistration(ctx, id)
}

func (r *Repository) Create(ctx context.Context, params generated.CreateExamRegistrationParams) error {
	return r.queries.CreateExamRegistration(ctx, params)
}

func (r *Repository) Update(ctx context.Context, params generated.UpdateExamRegistrationParams) error {
	return r.queries.UpdateExamRegistration(ctx, params)
}

func (r *Repository) Delete(ctx context.Context, id pgtype.UUID) error {
	return r.queries.DeleteExamRegistration(ctx, id)
}
