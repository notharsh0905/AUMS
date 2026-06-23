package facultycourseallocations

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
) ([]generated.FacultyCourseAllocation, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateFacultyCourseAllocationRequest,
) error {

	allocationID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	facultyID, err := aumsuuid.Parse(
		req.FacultyProfileID,
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

	return s.repository.Create(
		ctx,
		generated.CreateFacultyCourseAllocationParams{
			FacultyCourseAllocationID: allocationID,
			FacultyProfileID:          facultyID,
			CourseOfferingID:          courseOfferingID,
		},
	)
}
