package examattempts

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

func (r *Repository) List(ctx context.Context) ([]generated.ExamAttempt, error) {
	return r.queries.ListExamAttempts(ctx)
}

func (r *Repository) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
	examID string,
	registrationID string,
	enrollmentID string,
	status string,
) ([]generated.ExamAttempt, error) {
	return r.queries.ListExamAttemptsPaginated(
		ctx,
		generated.ListExamAttemptsPaginatedParams{
			Limit:   limit,
			Offset:  offset,
			Column3: examID,
			Column4: registrationID,
			Column5: enrollmentID,
			Column6: status,
		},
	)
}

func (r *Repository) Count(
	ctx context.Context,
	examID string,
	registrationID string,
	enrollmentID string,
	status string,
) (int64, error) {
	return r.queries.CountExamAttempts(
		ctx,
		generated.CountExamAttemptsParams{
			Column1: examID,
			Column2: registrationID,
			Column3: enrollmentID,
			Column4: status,
		},
	)
}

func (r *Repository) Get(ctx context.Context, id pgtype.UUID) (generated.ExamAttempt, error) {
	return r.queries.GetExamAttempt(ctx, id)
}

func (r *Repository) Create(ctx context.Context, params generated.CreateExamAttemptParams) error {
	return r.queries.CreateExamAttempt(ctx, params)
}

func (r *Repository) Update(ctx context.Context, params generated.UpdateExamAttemptParams) error {
	return r.queries.UpdateExamAttempt(ctx, params)
}

func (r *Repository) Delete(ctx context.Context, id pgtype.UUID) error {
	return r.queries.DeleteExamAttempt(ctx, id)
}
