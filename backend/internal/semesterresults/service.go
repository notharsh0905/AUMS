package semesterresults

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

func (s *Service) List(ctx context.Context) ([]db.SemesterResult, error) {
	return s.repository.List(ctx)
}

func (s *Service) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
	semesterID string,
	studentID string,
	programID string,
	academicYearID string,
	status string,
) ([]db.SemesterResult, error) {
	return s.repository.ListPaginated(ctx, limit, offset, semesterID, studentID, programID, academicYearID, status)
}

func (s *Service) Count(
	ctx context.Context,
	semesterID string,
	studentID string,
	programID string,
	academicYearID string,
	status string,
) (int64, error) {
	return s.repository.Count(ctx, semesterID, studentID, programID, academicYearID, status)
}

func (s *Service) Get(ctx context.Context, idStr string) (db.SemesterResult, error) {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return db.SemesterResult{}, err
	}
	return s.repository.Get(ctx, id)
}

func (s *Service) Create(ctx context.Context, req CreateSemesterResultRequest) error {
	semesterResultID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	enrollmentID, err := aumsuuid.Parse(req.EnrollmentID)
	if err != nil {
		return err
	}

	semesterID, err := aumsuuid.Parse(req.SemesterID)
	if err != nil {
		return err
	}

	totalCreditsVal := req.TotalCredits
	earnedCreditsVal := req.EarnedCredits
	sgpaVal := req.Sgpa

	// Automatically calculate if manual values are not supplied
	if totalCreditsVal == 0 && sgpaVal == 0 {
		tc, ec, sVal, err := s.CalculateSGPAValues(ctx, enrollmentID, semesterID)
		if err != nil {
			return err
		}
		totalCreditsVal = tc
		earnedCreditsVal = ec
		sgpaVal = sVal
	}

	var totalCredits pgtype.Numeric
	if err := totalCredits.Scan(fmt.Sprintf("%.2f", totalCreditsVal)); err != nil {
		return err
	}

	var earnedCredits pgtype.Numeric
	if err := earnedCredits.Scan(fmt.Sprintf("%.2f", earnedCreditsVal)); err != nil {
		return err
	}

	var sgpa pgtype.Numeric
	if err := sgpa.Scan(fmt.Sprintf("%.2f", sgpaVal)); err != nil {
		return err
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
		db.CreateSemesterResultParams{
			SemesterResultID: semesterResultID,
			EnrollmentID:     enrollmentID,
			SemesterID:       semesterID,
			TotalCredits:     totalCredits,
			EarnedCredits:    earnedCredits,
			Sgpa:             sgpa,
			ResultStatus:     status,
			PublishedAt:      publishedAt,
		},
	)
}

func (s *Service) Update(ctx context.Context, idStr string, req UpdateSemesterResultRequest) error {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return err
	}

	existing, err := s.repository.Get(ctx, id)
	if err != nil {
		return err
	}

	totalCreditsVal := req.TotalCredits
	earnedCreditsVal := req.EarnedCredits
	sgpaVal := req.Sgpa

	if totalCreditsVal == 0 && sgpaVal == 0 {
		tc, ec, sVal, err := s.CalculateSGPAValues(ctx, existing.EnrollmentID, existing.SemesterID)
		if err != nil {
			return err
		}
		totalCreditsVal = tc
		earnedCreditsVal = ec
		sgpaVal = sVal
	}

	var totalCredits pgtype.Numeric
	if err := totalCredits.Scan(fmt.Sprintf("%.2f", totalCreditsVal)); err != nil {
		return err
	}

	var earnedCredits pgtype.Numeric
	if err := earnedCredits.Scan(fmt.Sprintf("%.2f", earnedCreditsVal)); err != nil {
		return err
	}

	var sgpa pgtype.Numeric
	if err := sgpa.Scan(fmt.Sprintf("%.2f", sgpaVal)); err != nil {
		return err
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
		db.UpdateSemesterResultParams{
			SemesterResultID: id,
			TotalCredits:     totalCredits,
			EarnedCredits:    earnedCredits,
			Sgpa:             sgpa,
			ResultStatus:     status,
			PublishedAt:      publishedAt,
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

func (s *Service) CalculateSGPAValues(
	ctx context.Context,
	enrollmentID pgtype.UUID,
	semesterID pgtype.UUID,
) (totalCredits float64, earnedCredits float64, sgpa float64, err error) {
	rows, err := s.repository.GetCourseResultsForSGPA(ctx, enrollmentID, semesterID)
	if err != nil {
		return 0, 0, 0, err
	}

	var totalPoints float64
	for _, row := range rows {
		var crCredits float64
		if row.Credits.Valid {
			var str string
			if errScan := row.Credits.Scan(&str); errScan == nil {
				if val, errParse := strconv.ParseFloat(str, 64); errParse == nil {
					crCredits = val
				}
			}
		}

		var crGradePoint float64
		if row.GradePoint.Valid {
			var str string
			if errScan := row.GradePoint.Scan(&str); errScan == nil {
				if val, errParse := strconv.ParseFloat(str, 64); errParse == nil {
					crGradePoint = val
				}
			}
		}

		totalCredits += crCredits
		if row.IsPassing.Bool {
			earnedCredits += crCredits
		}
		totalPoints += crCredits * crGradePoint
	}

	if totalCredits > 0 {
		sgpa = totalPoints / totalCredits
	}

	return totalCredits, earnedCredits, sgpa, nil
}
