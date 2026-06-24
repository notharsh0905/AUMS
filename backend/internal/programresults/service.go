package programresults

import (
	"context"
	"fmt"
	"time"

	db "aums/backend/internal/db/generated"
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

func (s *Service) Create(
	ctx context.Context,
	req CreateProgramResultRequest,
) error {

	programResultID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	var enrollmentID pgtype.UUID
	if err := enrollmentID.Scan(req.EnrollmentID); err != nil {
		return err
	}

	var cgpa pgtype.Numeric
	if err := cgpa.Scan(
		fmt.Sprintf("%.2f", req.Cgpa),
	); err != nil {
		return err
	}

	var totalCredits pgtype.Numeric
	if err := totalCredits.Scan(
		fmt.Sprintf("%.2f", req.TotalCredits),
	); err != nil {
		return err
	}

	var earnedCredits pgtype.Numeric
	if err := earnedCredits.Scan(
		fmt.Sprintf("%.2f", req.EarnedCredits),
	); err != nil {
		return err
	}

	completionDate, err := time.Parse(
		"2006-01-02",
		req.CompletionDate,
	)

	if err != nil {
		return err
	}

	publishedAt, err := time.Parse(
		time.RFC3339,
		req.PublishedAt,
	)

	if err != nil {
		return err
	}

	status := db.ResultStatusDRAFT

	if req.ResultStatus != "" {
		status = db.ResultStatus(
			req.ResultStatus,
		)
	}

	return s.repository.Create(
		ctx,
		db.CreateProgramResultParams{
			ProgramResultID: programResultID,
			EnrollmentID:    enrollmentID,
			Cgpa:            cgpa,
			TotalCredits:    totalCredits,
			EarnedCredits:   earnedCredits,
			DegreeCompleted: req.DegreeCompleted,
			CompletionDate: pgtype.Date{
				Time:  completionDate,
				Valid: true,
			},
			ResultStatus: status,
			PublishedAt: pgtype.Timestamptz{
				Time:  publishedAt,
				Valid: true,
			},
		},
	)
}

func (s *Service) List(
	ctx context.Context,
) ([]db.ProgramResult, error) {

	return s.repository.List(
		ctx,
	)
}
