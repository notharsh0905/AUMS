package attendance

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
) ([]generated.AttendanceRecord, error) {

	return r.queries.ListAttendanceRecords(
		ctx,
	)
}

func (r *Repository) Create(
	ctx context.Context,
	params generated.CreateAttendanceRecordParams,
) error {

	return r.queries.CreateAttendanceRecord(
		ctx,
		params,
	)
}
