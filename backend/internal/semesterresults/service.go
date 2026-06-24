package semesterresults

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
	req CreateSemesterResultRequest,
) error {

	semesterResultID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	var enrollmentID pgtype.UUID
	if err := enrollmentID.Scan(req.EnrollmentID); err != nil {
		return err
	}

	var semesterID pgtype.UUID
	if err := semesterID.Scan(req.SemesterID); err != nil {
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

	var sgpa pgtype.Numeric
	if err := sgpa.Scan(
		fmt.Sprintf("%.2f", req.Sgpa),
	); err != nil {
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
		db.CreateSemesterResultParams{
			SemesterResultID: semesterResultID,
			EnrollmentID:     enrollmentID,
			SemesterID:       semesterID,
			TotalCredits:     totalCredits,
			EarnedCredits:    earnedCredits,
			Sgpa:             sgpa,
			ResultStatus:     status,
			PublishedAt: pgtype.Timestamptz{
				Time:  publishedAt,
				Valid: true,
			},
		},
	)
}

func (s *Service) List(
	ctx context.Context,
) ([]db.SemesterResult, error) {

	return s.repository.List(
		ctx,
	)
}
