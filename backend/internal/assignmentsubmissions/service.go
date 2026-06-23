package assignmentsubmissions

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
) ([]generated.AssignmentSubmission, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateAssignmentSubmissionRequest,
) error {

	submissionID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	assignmentID, err := aumsuuid.Parse(
		req.AssignmentID,
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

	submittedAt, err := time.Parse(
		time.RFC3339,
		req.SubmittedAt,
	)

	if err != nil {
		return err
	}

	return s.repository.Create(
		ctx,
		generated.CreateAssignmentSubmissionParams{
			AssignmentSubmissionID: submissionID,
			AssignmentID:           assignmentID,
			EnrollmentID:           enrollmentID,

			SubmissionStatus: generated.SubmissionStatus(
				req.SubmissionStatus,
			),

			SubmittedAt: pgtype.Timestamptz{
				Time:  submittedAt,
				Valid: true,
			},

			Remarks: pgtype.Text{
				String: req.Remarks,
				Valid:  req.Remarks != "",
			},
		},
	)
}
