package timetableentries

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
) ([]generated.TimetableEntry, error) {

	return r.queries.ListTimetableEntries(
		ctx,
	)
}

func (r *Repository) ListForFaculty(
	ctx context.Context,
	facultyProfileID pgtype.UUID,
) ([]generated.TimetableEntry, error) {

	return r.queries.ListTimetableEntriesForFaculty(
		ctx,
		facultyProfileID,
	)
}

func (r *Repository) ListForStudent(
	ctx context.Context,
	studentProfileID pgtype.UUID,
) ([]generated.TimetableEntry, error) {

	return r.queries.ListTimetableEntriesForStudent(
		ctx,
		studentProfileID,
	)
}

func (r *Repository) GetByID(
	ctx context.Context,
	id pgtype.UUID,
) (generated.TimetableEntry, error) {

	return r.queries.GetTimetableEntryByID(
		ctx,
		id,
	)
}

func (r *Repository) Create(
	ctx context.Context,
	params generated.CreateTimetableEntryParams,
) error {

	return r.queries.CreateTimetableEntry(
		ctx,
		params,
	)
}

func (r *Repository) Delete(
	ctx context.Context,
	id pgtype.UUID,
) error {

	return r.queries.DeleteTimetableEntry(
		ctx,
		id,
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

func (r *Repository) GetStudentProfileByUserID(
	ctx context.Context,
	userID pgtype.UUID,
) (generated.StudentProfile, error) {

	return r.queries.GetStudentProfileByUserID(
		ctx,
		userID,
	)
}
