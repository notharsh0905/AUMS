package examrooms

import (
	"context"

	"aums/backend/internal/db/generated"
	aumsuuid "aums/backend/pkg/uuid"

	"github.com/jackc/pgx/v5/pgtype"
)

type Service struct {
	repository *Repository
}

func NewService(repository *Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) List(ctx context.Context) ([]generated.ExamRoom, error) {
	return s.repository.List(ctx)
}

func (s *Service) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
	search string,
	status string,
	roomType string,
) ([]generated.ExamRoom, error) {
	return s.repository.ListPaginated(ctx, limit, offset, search, status, roomType)
}

func (s *Service) Count(
	ctx context.Context,
	search string,
	status string,
	roomType string,
) (int64, error) {
	return s.repository.Count(ctx, search, status, roomType)
}

func (s *Service) Get(ctx context.Context, idStr string) (generated.ExamRoom, error) {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return generated.ExamRoom{}, err
	}
	return s.repository.Get(ctx, id)
}

func (s *Service) Create(ctx context.Context, req CreateExamRoomRequest) error {
	examRoomID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	institutionID, err := aumsuuid.Parse(req.InstitutionID)
	if err != nil {
		return err
	}

	var blockText pgtype.Text
	if req.Block != "" {
		blockText = pgtype.Text{
			String: req.Block,
			Valid:  true,
		}
	}

	return s.repository.Create(
		ctx,
		generated.CreateExamRoomParams{
			ExamRoomID:           examRoomID,
			Building:             req.Building,
			RoomNumber:           req.RoomNumber,
			RoomName:             req.RoomName,
			Floor:                req.Floor,
			Block:                blockText,
			Capacity:             req.Capacity,
			RoomType:             req.RoomType,
			Status:               req.Status,
			HasProjector:         req.HasProjector,
			HasAc:                req.HasAc,
			WheelchairAccessible: req.WheelchairAccessible,
			InstitutionID:        institutionID,
		},
	)
}

func (s *Service) Update(ctx context.Context, idStr string, req UpdateExamRoomRequest) error {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return err
	}

	var blockText pgtype.Text
	if req.Block != "" {
		blockText = pgtype.Text{
			String: req.Block,
			Valid:  true,
		}
	}

	return s.repository.Update(
		ctx,
		generated.UpdateExamRoomParams{
			ExamRoomID:           id,
			Building:             req.Building,
			RoomNumber:           req.RoomNumber,
			RoomName:             req.RoomName,
			Floor:                req.Floor,
			Block:                blockText,
			Capacity:             req.Capacity,
			RoomType:             req.RoomType,
			Status:               req.Status,
			HasProjector:         req.HasProjector,
			HasAc:                req.HasAc,
			WheelchairAccessible: req.WheelchairAccessible,
		},
	)
}

func (s *Service) SoftDelete(ctx context.Context, idStr string) error {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return err
	}
	return s.repository.SoftDelete(ctx, id)
}
