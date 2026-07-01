package programresults

import (
	"context"

	db "aums/backend/internal/db/generated"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	queries *db.Queries
}

func NewRepository(database *pgxpool.Pool) *Repository {
	return &Repository{
		queries: db.New(database),
	}
}

func (r *Repository) List(ctx context.Context) ([]db.ProgramResult, error) {
	return r.queries.ListProgramResults(ctx)
}

func (r *Repository) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
	studentID string,
	programID string,
	batch string,
	status string,
) ([]db.ProgramResult, error) {
	return r.queries.ListProgramResultsPaginated(
		ctx,
		db.ListProgramResultsPaginatedParams{
			Limit:   limit,
			Offset:  offset,
			Column3: studentID,
			Column4: programID,
			Column5: batch,
			Column6: status,
		},
	)
}

func (r *Repository) Count(
	ctx context.Context,
	studentID string,
	programID string,
	batch string,
	status string,
) (int64, error) {
	return r.queries.CountProgramResults(
		ctx,
		db.CountProgramResultsParams{
			Column1: studentID,
			Column2: programID,
			Column3: batch,
			Column4: status,
		},
	)
}

func (r *Repository) Get(ctx context.Context, id pgtype.UUID) (db.ProgramResult, error) {
	return r.queries.GetProgramResult(ctx, id)
}

func (r *Repository) Create(ctx context.Context, params db.CreateProgramResultParams) error {
	return r.queries.CreateProgramResult(ctx, params)
}

func (r *Repository) Update(ctx context.Context, params db.UpdateProgramResultParams) error {
	return r.queries.UpdateProgramResult(ctx, params)
}

func (r *Repository) Delete(ctx context.Context, id pgtype.UUID) error {
	return r.queries.DeleteProgramResult(ctx, id)
}

func (r *Repository) GetSemesterResultsForCGPA(
	ctx context.Context,
	enrollmentID pgtype.UUID,
) ([]db.GetSemesterResultsForCGPARow, error) {
	return r.queries.GetSemesterResultsForCGPA(ctx, enrollmentID)
}
