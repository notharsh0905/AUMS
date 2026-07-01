package semesterresults

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

func (r *Repository) List(ctx context.Context) ([]db.SemesterResult, error) {
	return r.queries.ListSemesterResults(ctx)
}

func (r *Repository) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
	semesterID string,
	studentID string,
	programID string,
	academicYearID string,
	status string,
) ([]db.SemesterResult, error) {
	return r.queries.ListSemesterResultsPaginated(
		ctx,
		db.ListSemesterResultsPaginatedParams{
			Limit:   limit,
			Offset:  offset,
			Column3: semesterID,
			Column4: studentID,
			Column5: programID,
			Column6: academicYearID,
			Column7: status,
		},
	)
}

func (r *Repository) Count(
	ctx context.Context,
	semesterID string,
	studentID string,
	programID string,
	academicYearID string,
	status string,
) (int64, error) {
	return r.queries.CountSemesterResults(
		ctx,
		db.CountSemesterResultsParams{
			Column1: semesterID,
			Column2: studentID,
			Column3: programID,
			Column4: academicYearID,
			Column5: status,
		},
	)
}

func (r *Repository) Get(ctx context.Context, id pgtype.UUID) (db.SemesterResult, error) {
	return r.queries.GetSemesterResult(ctx, id)
}

func (r *Repository) Create(ctx context.Context, params db.CreateSemesterResultParams) error {
	return r.queries.CreateSemesterResult(ctx, params)
}

func (r *Repository) Update(ctx context.Context, params db.UpdateSemesterResultParams) error {
	return r.queries.UpdateSemesterResult(ctx, params)
}

func (r *Repository) Delete(ctx context.Context, id pgtype.UUID) error {
	return r.queries.DeleteSemesterResult(ctx, id)
}

func (r *Repository) GetCourseResultsForSGPA(
	ctx context.Context,
	enrollmentID pgtype.UUID,
	semesterID pgtype.UUID,
) ([]db.GetCourseResultsForSGPARow, error) {
	return r.queries.GetCourseResultsForSGPA(ctx, db.GetCourseResultsForSGPAParams{
		EnrollmentID: enrollmentID,
		SemesterID:   semesterID,
	})
}
