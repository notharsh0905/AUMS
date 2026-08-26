package assignmentsubmissions

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

func (r *Repository) GetByID(
	ctx context.Context,
	id pgtype.UUID,
) (generated.GetAssignmentSubmissionByIDRow, error) {

	return r.queries.GetAssignmentSubmissionByID(
		ctx,
		id,
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

func (r *Repository) UpsertGrade(
	ctx context.Context,
	params generated.UpsertAssignmentGradeParams,
) error {

	return r.queries.UpsertAssignmentGrade(
		ctx,
		params,
	)
}

func (r *Repository) GetGradeBySubmissionID(
	ctx context.Context,
	submissionID pgtype.UUID,
) (generated.AssignmentGrade, error) {

	return r.queries.GetAssignmentGradeBySubmissionID(
		ctx,
		submissionID,
	)
}

func (r *Repository) ListGrades(
	ctx context.Context,
) ([]generated.AssignmentGrade, error) {

	return r.queries.ListAssignmentGrades(
		ctx,
	)
}

func (r *Repository) GetFacultyProfileByUserID(
	ctx context.Context,
	userID pgtype.UUID,
) (generated.FacultyProfile, error) {

	return r.queries.GetFacultyProfileByUserID(
		ctx,
		userID,
	)
}
