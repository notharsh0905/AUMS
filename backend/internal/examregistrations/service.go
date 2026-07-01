package examregistrations

import (
	"context"

	"aums/backend/internal/db/generated"
	aumsuuid "aums/backend/pkg/uuid"
)

type Service struct {
	repository *Repository
}

func NewService(repository *Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) List(ctx context.Context) ([]generated.ExamRegistration, error) {
	return s.repository.List(ctx)
}

func (s *Service) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
	examID string,
	enrollmentID string,
	status string,
) ([]generated.ExamRegistration, error) {
	return s.repository.ListPaginated(ctx, limit, offset, examID, enrollmentID, status)
}

func (s *Service) Count(
	ctx context.Context,
	examID string,
	enrollmentID string,
	status string,
) (int64, error) {
	return s.repository.Count(ctx, examID, enrollmentID, status)
}

func (s *Service) Get(ctx context.Context, idStr string) (generated.ExamRegistration, error) {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return generated.ExamRegistration{}, err
	}
	return s.repository.Get(ctx, id)
}

func (s *Service) Create(ctx context.Context, req CreateExamRegistrationRequest) error {
	examRegistrationID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	examID, err := aumsuuid.Parse(req.ExamID)
	if err != nil {
		return err
	}

	enrollmentID, err := aumsuuid.Parse(req.EnrollmentID)
	if err != nil {
		return err
	}

	status := generated.ExamRegistrationStatusREGISTERED
	if req.RegistrationStatus != "" {
		status = generated.ExamRegistrationStatus(req.RegistrationStatus)
	}

	return s.repository.Create(
		ctx,
		generated.CreateExamRegistrationParams{
			ExamRegistrationID: examRegistrationID,
			ExamID:             examID,
			EnrollmentID:       enrollmentID,
			RegistrationStatus: status,
		},
	)
}

func (s *Service) Update(ctx context.Context, idStr string, req UpdateExamRegistrationRequest) error {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return err
	}

	return s.repository.Update(
		ctx,
		generated.UpdateExamRegistrationParams{
			ExamRegistrationID: id,
			RegistrationStatus: generated.ExamRegistrationStatus(req.RegistrationStatus),
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
