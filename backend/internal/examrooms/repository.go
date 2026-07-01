package examrooms

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

func (r *Repository) List(ctx context.Context) ([]generated.ExamRoom, error) {
	return r.queries.ListExamRooms(ctx)
}

func (r *Repository) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
	search string,
	status string,
	roomType string,
) ([]generated.ExamRoom, error) {
	return r.queries.ListExamRoomsPaginated(
		ctx,
		generated.ListExamRoomsPaginatedParams{
			Limit:   limit,
			Offset:  offset,
			Column3: search,
			Column4: status,
			Column5: roomType,
		},
	)
}

func (r *Repository) Count(
	ctx context.Context,
	search string,
	status string,
	roomType string,
) (int64, error) {
	return r.queries.CountExamRooms(
		ctx,
		generated.CountExamRoomsParams{
			Column1: search,
			Column2: status,
			Column3: roomType,
		},
	)
}

func (r *Repository) Get(ctx context.Context, id pgtype.UUID) (generated.ExamRoom, error) {
	return r.queries.GetExamRoom(ctx, id)
}

func (r *Repository) Create(ctx context.Context, params generated.CreateExamRoomParams) error {
	return r.queries.CreateExamRoom(ctx, params)
}

func (r *Repository) Update(ctx context.Context, params generated.UpdateExamRoomParams) error {
	return r.queries.UpdateExamRoom(ctx, params)
}

func (r *Repository) SoftDelete(ctx context.Context, id pgtype.UUID) error {
	return r.queries.SoftDeleteExamRoom(ctx, id)
}
