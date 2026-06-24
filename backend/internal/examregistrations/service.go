package examregistrations

import (
	"context"

	"aums/backend/internal/db/generated"
	aumsuuid "aums/backend/pkg/uuid"
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
) ([]generated.ExamRegistration, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateExamRegistrationRequest,
) error {

	examRegistrationID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	examID, err := aumsuuid.Parse(
		req.ExamID,
	)

	if err != nil {
		return err
	}

	enrollmentID, err := aumsuuid.Parse(
		req.EnrollmentID,
	)

	if err != nil {
		return err
	}

	status :=
		generated.ExamRegistrationStatusREGISTERED

	if req.RegistrationStatus != "" {

		status =
			generated.ExamRegistrationStatus(
				req.RegistrationStatus,
			)
	}

	return s.repository.Create(
		ctx,
		generated.CreateExamRegistrationParams{
			ExamRegistrationID: examRegistrationID,

			ExamID: examID,

			EnrollmentID: enrollmentID,

			RegistrationStatus: status,
		},
	)
}
