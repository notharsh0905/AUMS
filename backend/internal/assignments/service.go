package assignments

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

func NewService(
	repository *Repository,
) *Service {

	return &Service{
		repository: repository,
	}
}

func (s *Service) List(
	ctx context.Context,
) ([]generated.Assignment, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateAssignmentRequest,
) error {

	assignmentID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	courseOfferingID, err := aumsuuid.Parse(
		req.CourseOfferingID,
	)

	if err != nil {
		return err
	}

	facultyProfileID, err := aumsuuid.Parse(
		req.FacultyProfileID,
	)

	if err != nil {
		return err
	}

	publishAt, err := time.Parse(
		time.RFC3339,
		req.PublishAt,
	)

	if err != nil {
		return err
	}

	dueAt, err := time.Parse(
		time.RFC3339,
		req.DueAt,
	)

	if err != nil {
		return err
	}

	var totalMarks pgtype.Numeric

	err = totalMarks.Scan(
		fmt.Sprintf("%.2f", req.TotalMarks),
	)

	if err != nil {
		return err
	}

	status := generated.AssignmentStatusDRAFT

	if req.AssignmentStatus != "" {
		status = generated.AssignmentStatus(
			req.AssignmentStatus,
		)
	}

	return s.repository.Create(
		ctx,
		generated.CreateAssignmentParams{
			AssignmentID:     assignmentID,
			CourseOfferingID: courseOfferingID,
			FacultyProfileID: facultyProfileID,

			Title: req.Title,

			Description: pgtype.Text{
				String: req.Description,
				Valid:  req.Description != "",
			},

			TotalMarks: totalMarks,

			PublishAt: pgtype.Timestamptz{
				Time:  publishAt,
				Valid: true,
			},

			DueAt: pgtype.Timestamptz{
				Time:  dueAt,
				Valid: true,
			},

			AssignmentStatus: status,
		},
	)
}
