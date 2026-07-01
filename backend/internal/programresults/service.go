package programresults

import (
	"context"
	"fmt"
	"strconv"
	"time"

	db "aums/backend/internal/db/generated"
	aumsuuid "aums/backend/pkg/uuid"

	"github.com/jackc/pgx/v5/pgtype"
)

type Service struct {
	repository *Repository
}

func NewService(repository *Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) List(ctx context.Context) ([]db.ProgramResult, error) {
	return s.repository.List(ctx)
}

func (s *Service) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
	studentID string,
	programID string,
	batch string,
	status string,
) ([]db.ProgramResult, error) {
	return s.repository.ListPaginated(ctx, limit, offset, studentID, programID, batch, status)
}

func (s *Service) Count(
	ctx context.Context,
	studentID string,
	programID string,
	batch string,
	status string,
) (int64, error) {
	return s.repository.Count(ctx, studentID, programID, batch, status)
}

func (s *Service) Get(ctx context.Context, idStr string) (db.ProgramResult, error) {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return db.ProgramResult{}, err
	}
	return s.repository.Get(ctx, id)
}

func (s *Service) Create(ctx context.Context, req CreateProgramResultRequest) error {
	programResultID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	enrollmentID, err := aumsuuid.Parse(req.EnrollmentID)
	if err != nil {
		return err
	}

	cgpaVal := req.Cgpa
	totalCreditsVal := req.TotalCredits
	earnedCreditsVal := req.EarnedCredits

	// Automatically calculate if manual values are not supplied
	if cgpaVal == 0 && totalCreditsVal == 0 {
		cVal, tc, ec, err := s.CalculateCGPAValues(ctx, enrollmentID)
		if err != nil {
			return err
		}
		cgpaVal = cVal
		totalCreditsVal = tc
		earnedCreditsVal = ec
	}

	var cgpa pgtype.Numeric
	if err := cgpa.Scan(fmt.Sprintf("%.2f", cgpaVal)); err != nil {
		return err
	}

	var totalCredits pgtype.Numeric
	if err := totalCredits.Scan(fmt.Sprintf("%.2f", totalCreditsVal)); err != nil {
		return err
	}

	var earnedCredits pgtype.Numeric
	if err := earnedCredits.Scan(fmt.Sprintf("%.2f", earnedCreditsVal)); err != nil {
		return err
	}

	var completionDate pgtype.Date
	if req.CompletionDate != "" {
		cTime, err := time.Parse("2006-01-02", req.CompletionDate)
		if err != nil {
			return err
		}
		completionDate = pgtype.Date{
			Time:  cTime,
			Valid: true,
		}
	}

	var publishedAt pgtype.Timestamptz
	if req.PublishedAt != "" {
		pTime, err := time.Parse(time.RFC3339, req.PublishedAt)
		if err != nil {
			return err
		}
		publishedAt = pgtype.Timestamptz{
			Time:  pTime,
			Valid: true,
		}
	}

	status := db.ResultStatusDRAFT
	if req.ResultStatus != "" {
		status = db.ResultStatus(req.ResultStatus)
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
			CompletionDate:  completionDate,
			ResultStatus:    status,
			PublishedAt:     publishedAt,
		},
	)
}

func (s *Service) Update(ctx context.Context, idStr string, req UpdateProgramResultRequest) error {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return err
	}

	existing, err := s.repository.Get(ctx, id)
	if err != nil {
		return err
	}

	cgpaVal := req.Cgpa
	totalCreditsVal := req.TotalCredits
	earnedCreditsVal := req.EarnedCredits

	if cgpaVal == 0 && totalCreditsVal == 0 {
		cVal, tc, ec, err := s.CalculateCGPAValues(ctx, existing.EnrollmentID)
		if err != nil {
			return err
		}
		cgpaVal = cVal
		totalCreditsVal = tc
		earnedCreditsVal = ec
	}

	var cgpa pgtype.Numeric
	if err := cgpa.Scan(fmt.Sprintf("%.2f", cgpaVal)); err != nil {
		return err
	}

	var totalCredits pgtype.Numeric
	if err := totalCredits.Scan(fmt.Sprintf("%.2f", totalCreditsVal)); err != nil {
		return err
	}

	var earnedCredits pgtype.Numeric
	if err := earnedCredits.Scan(fmt.Sprintf("%.2f", earnedCreditsVal)); err != nil {
		return err
	}

	var completionDate pgtype.Date
	if req.CompletionDate != "" {
		cTime, err := time.Parse("2006-01-02", req.CompletionDate)
		if err != nil {
			return err
		}
		completionDate = pgtype.Date{
			Time:  cTime,
			Valid: true,
		}
	}

	var publishedAt pgtype.Timestamptz
	if req.PublishedAt != "" {
		pTime, err := time.Parse(time.RFC3339, req.PublishedAt)
		if err != nil {
			return err
		}
		publishedAt = pgtype.Timestamptz{
			Time:  pTime,
			Valid: true,
		}
	}

	status := db.ResultStatusDRAFT
	if req.ResultStatus != "" {
		status = db.ResultStatus(req.ResultStatus)
	}

	return s.repository.Update(
		ctx,
		db.UpdateProgramResultParams{
			ProgramResultID: id,
			Cgpa:            cgpa,
			TotalCredits:    totalCredits,
			EarnedCredits:   earnedCredits,
			DegreeCompleted: req.DegreeCompleted,
			CompletionDate:  completionDate,
			ResultStatus:    status,
			PublishedAt:     publishedAt,
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

func (s *Service) CalculateCGPAValues(
	ctx context.Context,
	enrollmentID pgtype.UUID,
) (cgpa float64, totalCredits float64, earnedCredits float64, err error) {
	rows, err := s.repository.GetSemesterResultsForCGPA(ctx, enrollmentID)
	if err != nil {
		return 0, 0, 0, err
	}

	var totalPoints float64
	for _, row := range rows {
		var semTotalCredits float64
		if row.TotalCredits.Valid {
			var str string
			if errScan := row.TotalCredits.Scan(&str); errScan == nil {
				if val, errParse := strconv.ParseFloat(str, 64); errParse == nil {
					semTotalCredits = val
				}
			}
		}

		var semEarnedCredits float64
		if row.EarnedCredits.Valid {
			var str string
			if errScan := row.EarnedCredits.Scan(&str); errScan == nil {
				if val, errParse := strconv.ParseFloat(str, 64); errParse == nil {
					semEarnedCredits = val
				}
			}
		}

		var semSGPA float64
		if row.Sgpa.Valid {
			var str string
			if errScan := row.Sgpa.Scan(&str); errScan == nil {
				if val, errParse := strconv.ParseFloat(str, 64); errParse == nil {
					semSGPA = val
				}
			}
		}

		totalCredits += semTotalCredits
		earnedCredits += semEarnedCredits
		totalPoints += semTotalCredits * semSGPA
	}

	if totalCredits > 0 {
		cgpa = totalPoints / totalCredits
	}

	return cgpa, totalCredits, earnedCredits, nil
}
