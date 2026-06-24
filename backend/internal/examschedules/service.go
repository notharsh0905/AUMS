package examschedules

import (
	"context"
	"time"

	"aums/backend/internal/db/generated"
	aumsuuid "aums/backend/pkg/uuid"

	"github.com/jackc/pgx/v5/pgtype"
)

type Service struct {
	repository *Repository
}

func NewService(
	repository *Repository,
) *Service {

	return &Service{
		repository: repository,
	}
}

func (s *Service) List(
	ctx context.Context,
) ([]generated.ExamSchedule, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateExamScheduleRequest,
) error {

	examScheduleID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	examID, err := aumsuuid.Parse(
		req.ExamID,
	)

	if err != nil {
		return err
	}

	roomID, err := aumsuuid.Parse(
		req.RoomID,
	)

	if err != nil {
		return err
	}

	examDate, err := time.Parse(
		"2006-01-02",
		req.ExamDate,
	)

	if err != nil {
		return err
	}

	startTime, err := time.Parse(
		"15:04:05",
		req.StartTime,
	)

	if err != nil {
		return err
	}

	endTime, err := time.Parse(
		"15:04:05",
		req.EndTime,
	)

	if err != nil {
		return err
	}

	return s.repository.Create(
		ctx,
		generated.CreateExamScheduleParams{
			ExamScheduleID: examScheduleID,
			ExamID:         examID,
			RoomID:         roomID,

			ExamDate: pgtype.Date{
				Time:  examDate,
				Valid: true,
			},

			StartTime: pgtype.Time{
				Microseconds: int64(
					startTime.Hour()*3600+
						startTime.Minute()*60+
						startTime.Second(),
				) * 1000000,
				Valid: true,
			},

			EndTime: pgtype.Time{
				Microseconds: int64(
					endTime.Hour()*3600+
						endTime.Minute()*60+
						endTime.Second(),
				) * 1000000,
				Valid: true,
			},
		},
	)
}
