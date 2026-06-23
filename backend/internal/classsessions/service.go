package classsessions

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
) ([]generated.ClassSession, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateClassSessionRequest,
) error {

	sessionID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	timetableEntryID, err := aumsuuid.Parse(
		req.TimetableEntryID,
	)

	if err != nil {
		return err
	}

	sessionDate, err := time.Parse(
		"2006-01-02",
		req.SessionDate,
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

	status := generated.SessionStatusSCHEDULED

	if req.SessionStatus != "" {
		status = generated.SessionStatus(
			req.SessionStatus,
		)
	}

	var conductedBy pgtype.UUID

	if req.ConductedBy != "" {

		id, err := aumsuuid.Parse(
			req.ConductedBy,
		)

		if err != nil {
			return err
		}

		conductedBy = id
	}

	return s.repository.Create(
		ctx,
		generated.CreateClassSessionParams{
			ClassSessionID:   sessionID,
			TimetableEntryID: timetableEntryID,

			SessionDate: pgtype.Date{
				Time:  sessionDate,
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

			SessionStatus: status,

			ConductedBy: conductedBy,

			Remarks: pgtype.Text{
				String: req.Remarks,
				Valid:  req.Remarks != "",
			},
		},
	)
}
