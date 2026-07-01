package examattempts

import (
	"context"
	"fmt"
	"time"

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

func (s *Service) List(ctx context.Context) ([]generated.ExamAttempt, error) {
	return s.repository.List(ctx)
}

func (s *Service) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
	examID string,
	registrationID string,
	enrollmentID string,
	status string,
) ([]generated.ExamAttempt, error) {
	return s.repository.ListPaginated(ctx, limit, offset, examID, registrationID, enrollmentID, status)
}

func (s *Service) Count(
	ctx context.Context,
	examID string,
	registrationID string,
	enrollmentID string,
	status string,
) (int64, error) {
	return s.repository.Count(ctx, examID, registrationID, enrollmentID, status)
}

func (s *Service) Get(ctx context.Context, idStr string) (generated.ExamAttempt, error) {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return generated.ExamAttempt{}, err
	}
	return s.repository.Get(ctx, id)
}

func (s *Service) Create(ctx context.Context, req CreateExamAttemptRequest) error {
	examAttemptID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	examRegistrationID, err := aumsuuid.Parse(req.ExamRegistrationID)
	if err != nil {
		return err
	}

	evaluatorID, err := aumsuuid.Parse(req.EvaluatorID)
	if err != nil {
		return err
	}

	evaluatedAt, err := time.Parse(time.RFC3339, req.EvaluatedAt)
	if err != nil {
		return err
	}

	var marksObtained pgtype.Numeric
	err = marksObtained.Scan(fmt.Sprintf("%.2f", req.MarksObtained))
	if err != nil {
		return err
	}

	return s.repository.Create(
		ctx,
		generated.CreateExamAttemptParams{
			ExamAttemptID:      examAttemptID,
			ExamRegistrationID: examRegistrationID,
			AttemptNumber:      req.AttemptNumber,
			MarksObtained:      marksObtained,
			EvaluatorID:        evaluatorID,
			EvaluatedAt: pgtype.Timestamptz{
				Time:  evaluatedAt,
				Valid: true,
			},
			Remarks: pgtype.Text{
				String: req.Remarks,
				Valid:  req.Remarks != "",
			},
		},
	)
}

func (s *Service) Update(ctx context.Context, idStr string, req UpdateExamAttemptRequest) error {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return err
	}

	evaluatorID, err := aumsuuid.Parse(req.EvaluatorID)
	if err != nil {
		return err
	}

	evaluatedAt, err := time.Parse(time.RFC3339, req.EvaluatedAt)
	if err != nil {
		return err
	}

	var marksObtained pgtype.Numeric
	err = marksObtained.Scan(fmt.Sprintf("%.2f", req.MarksObtained))
	if err != nil {
		return err
	}

	return s.repository.Update(
		ctx,
		generated.UpdateExamAttemptParams{
			ExamAttemptID: id,
			MarksObtained: marksObtained,
			EvaluatorID:   evaluatorID,
			EvaluatedAt: pgtype.Timestamptz{
				Time:  evaluatedAt,
				Valid: true,
			},
			Remarks: pgtype.Text{
				String: req.Remarks,
				Valid:  req.Remarks != "",
			},
		},
	)
}

func (s *Service) Delete(ctx context.Context, idStr string) error {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return err
	}
	return s.repository.Delete(ctx, id)
}
