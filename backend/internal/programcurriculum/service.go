package programcurriculum

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
) ([]generated.ProgramCurriculum, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateProgramCurriculumRequest,
) error {

	curriculumID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	programID, err := aumsuuid.Parse(
		req.ProgramID,
	)

	if err != nil {
		return err
	}

	courseID, err := aumsuuid.Parse(
		req.CourseID,
	)

	if err != nil {
		return err
	}

	return s.repository.Create(
		ctx,
		generated.CreateProgramCurriculumParams{
			ProgramCurriculumID: curriculumID,
			ProgramID:           programID,
			CourseID:            courseID,
			SemesterNumber:      req.SemesterNumber,
			IsMandatory:         req.IsMandatory,
		},
	)
}
