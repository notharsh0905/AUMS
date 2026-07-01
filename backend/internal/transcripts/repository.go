package transcripts

import (
	"context"

	"aums/backend/internal/db/generated"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	queries *generated.Queries
}

func NewRepository(database *pgxpool.Pool) *Repository {
	return &Repository{
		queries: generated.New(database),
	}
}

func (r *Repository) GetStudentInfo(ctx context.Context, studentProfileID pgtype.UUID) (generated.GetTranscriptStudentInfoRow, error) {
	return r.queries.GetTranscriptStudentInfo(ctx, studentProfileID)
}

func (r *Repository) GetSemesterSummary(ctx context.Context, enrollmentID pgtype.UUID) ([]generated.GetTranscriptSemesterSummaryRow, error) {
	return r.queries.GetTranscriptSemesterSummary(ctx, enrollmentID)
}

func (r *Repository) GetCourseSummary(ctx context.Context, enrollmentID pgtype.UUID) ([]generated.GetTranscriptCourseSummaryRow, error) {
	return r.queries.GetTranscriptCourseSummary(ctx, enrollmentID)
}

func (r *Repository) GetCGPASummary(ctx context.Context, enrollmentID pgtype.UUID) (generated.GetTranscriptCGPASummaryRow, error) {
	return r.queries.GetTranscriptCGPASummary(ctx, enrollmentID)
}
