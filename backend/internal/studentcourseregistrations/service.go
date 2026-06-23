package studentcourseregistrations

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
) ([]generated.StudentCourseRegistration, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateStudentCourseRegistrationRequest,
) error {

	registrationID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	enrollmentID, err := aumsuuid.Parse(
		req.EnrollmentID,
	)

	if err != nil {
		return err
	}

	courseOfferingID, err := aumsuuid.Parse(
		req.CourseOfferingID,
	)

	if err != nil {
		return err
	}

	status := generated.RegistrationStatusREGISTERED

	if req.RegistrationStatus != "" {
		status = generated.RegistrationStatus(
			req.RegistrationStatus,
		)
	}

	return s.repository.Create(
		ctx,
		generated.CreateStudentCourseRegistrationParams{
			StudentCourseRegistrationID: registrationID,
			EnrollmentID:                enrollmentID,
			CourseOfferingID:            courseOfferingID,
			RegistrationStatus:          status,
		},
	)
}
