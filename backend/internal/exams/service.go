package exams

import (
	"context"
	"fmt"

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
) ([]generated.Exam, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateExamRequest,
) error {

	examID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	courseOfferingID, err := aumsuuid.Parse(
		req.CourseOfferingID,
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

	var passingMarks pgtype.Numeric

	err = passingMarks.Scan(
		fmt.Sprintf("%.2f", req.PassingMarks),
	)

	if err != nil {
		return err
	}

	status := generated.ExamStatusDRAFT

	if req.ExamStatus != "" {
		status = generated.ExamStatus(
			req.ExamStatus,
		)
	}

	return s.repository.Create(
		ctx,
		generated.CreateExamParams{
			ExamID:           examID,
			CourseOfferingID: courseOfferingID,
			ExamName:         req.ExamName,

			ExamType: generated.ExamType(
				req.ExamType,
			),

			TotalMarks:   totalMarks,
			PassingMarks: passingMarks,

			ExamStatus: status,

			Description: pgtype.Text{
				String: req.Description,
				Valid:  req.Description != "",
			},
		},
	)
}
