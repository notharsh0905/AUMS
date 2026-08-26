package courseresults

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

func (r *Repository) List(ctx context.Context) ([]db.CourseResult, error) {
	return r.queries.ListCourseResults(ctx)
}

func (r *Repository) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
	enrollmentID string,
	courseOfferingID string,
	status string,
) ([]db.CourseResult, error) {
	return r.queries.ListCourseResultsPaginated(
		ctx,
		db.ListCourseResultsPaginatedParams{
			Limit:   limit,
			Offset:  offset,
			Column3: enrollmentID,
			Column4: courseOfferingID,
			Column5: status,
		},
	)
}

func (r *Repository) ListForStudentUser(
	ctx context.Context,
	studentUserID pgtype.UUID,
) ([]db.CourseResult, error) {
	return r.queries.ListCourseResultsForStudentUser(
		ctx,
		studentUserID,
	)
}

func (r *Repository) ListForParentUser(
	ctx context.Context,
	parentUserID pgtype.UUID,
) ([]db.CourseResult, error) {
	return r.queries.ListCourseResultsForParentUser(
		ctx,
		parentUserID,
	)
}

func (r *Repository) ListForFaculty(
	ctx context.Context,
	facultyProfileID pgtype.UUID,
) ([]db.CourseResult, error) {
	return r.queries.ListCourseResultsForFaculty(
		ctx,
		facultyProfileID,
	)
}

func (r *Repository) Count(
	ctx context.Context,
	enrollmentID string,
	courseOfferingID string,
	status string,
) (int64, error) {
	return r.queries.CountCourseResults(
		ctx,
		db.CountCourseResultsParams{
			Column1: enrollmentID,
			Column2: courseOfferingID,
			Column3: status,
		},
	)
}

func (r *Repository) Get(ctx context.Context, id pgtype.UUID) (db.CourseResult, error) {
	return r.queries.GetCourseResult(ctx, id)
}

func (r *Repository) Create(ctx context.Context, params db.CreateCourseResultParams) error {
	return r.queries.CreateCourseResult(ctx, params)
}

func (r *Repository) Upsert(ctx context.Context, params db.UpsertCourseResultParams) error {
	return r.queries.UpsertCourseResult(ctx, params)
}

func (r *Repository) Update(ctx context.Context, params db.UpdateCourseResultParams) error {
	return r.queries.UpdateCourseResult(ctx, params)
}

func (r *Repository) Delete(ctx context.Context, id pgtype.UUID) error {
	return r.queries.DeleteCourseResult(ctx, id)
}

func (r *Repository) GetFacultyProfileByUserID(
	ctx context.Context,
	userID pgtype.UUID,
) (db.FacultyProfile, error) {
	return r.queries.GetFacultyProfileByUserID(
		ctx,
		userID,
	)
}

func (r *Repository) GetCourseOffering(
	ctx context.Context,
	offeringID pgtype.UUID,
) (db.CourseOffering, error) {
	return r.queries.GetCourseOffering(
		ctx,
		offeringID,
	)
}

func (r *Repository) ListFacultyCourseAllocations(
	ctx context.Context,
) ([]db.FacultyCourseAllocation, error) {
	return r.queries.ListFacultyCourseAllocations(ctx)
}
