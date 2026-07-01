package courseresults

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

func NewService(repository *Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) List(ctx context.Context) ([]db.CourseResult, error) {
	return s.repository.List(ctx)
}

func (s *Service) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
	enrollmentID string,
	courseOfferingID string,
	status string,
) ([]db.CourseResult, error) {
	return s.repository.ListPaginated(ctx, limit, offset, enrollmentID, courseOfferingID, status)
}

func (s *Service) Count(
	ctx context.Context,
	enrollmentID string,
	courseOfferingID string,
	status string,
) (int64, error) {
	return s.repository.Count(ctx, enrollmentID, courseOfferingID, status)
}

func (s *Service) Get(ctx context.Context, idStr string) (db.CourseResult, error) {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return db.CourseResult{}, err
	}
	return s.repository.Get(ctx, id)
}

func (s *Service) Create(ctx context.Context, req CreateCourseResultRequest) error {
	courseResultID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	enrollmentID, err := aumsuuid.Parse(req.EnrollmentID)
	if err != nil {
		return err
	}

	courseOfferingID, err := aumsuuid.Parse(req.CourseOfferingID)
	if err != nil {
		return err
	}

	gradeScaleID, err := aumsuuid.Parse(req.GradeScaleID)
	if err != nil {
		return err
	}

	var totalMarks pgtype.Numeric
	if err := totalMarks.Scan(fmt.Sprintf("%.2f", req.TotalMarks)); err != nil {
		return err
	}

	var marksObtained pgtype.Numeric
	if err := marksObtained.Scan(fmt.Sprintf("%.2f", req.MarksObtained)); err != nil {
		return err
	}

	var percentage pgtype.Numeric
	if err := percentage.Scan(fmt.Sprintf("%.2f", req.Percentage)); err != nil {
		return err
	}

	publishedAt, err := time.Parse(time.RFC3339, req.PublishedAt)
	if err != nil {
		return err
	}

	status := db.ResultStatusDRAFT
	if req.ResultStatus != "" {
		status = db.ResultStatus(req.ResultStatus)
	}

	return s.repository.Create(
		ctx,
		db.CreateCourseResultParams{
			CourseResultID:   courseResultID,
			EnrollmentID:     enrollmentID,
			CourseOfferingID: courseOfferingID,
			TotalMarks:       totalMarks,
			MarksObtained:    marksObtained,
			Percentage:       percentage,
			GradeScaleID:     gradeScaleID,
			ResultStatus:     status,
			PublishedAt: pgtype.Timestamptz{
				Time:  publishedAt,
				Valid: true,
			},
		},
	)
}

func (s *Service) Update(ctx context.Context, idStr string, req UpdateCourseResultRequest) error {
	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return err
	}

	gradeScaleID, err := aumsuuid.Parse(req.GradeScaleID)
	if err != nil {
		return err
	}

	var totalMarks pgtype.Numeric
	if err := totalMarks.Scan(fmt.Sprintf("%.2f", req.TotalMarks)); err != nil {
		return err
	}

	var marksObtained pgtype.Numeric
	if err := marksObtained.Scan(fmt.Sprintf("%.2f", req.MarksObtained)); err != nil {
		return err
	}

	var percentage pgtype.Numeric
	if err := percentage.Scan(fmt.Sprintf("%.2f", req.Percentage)); err != nil {
		return err
	}

	publishedAt, err := time.Parse(time.RFC3339, req.PublishedAt)
	if err != nil {
		return err
	}

	status := db.ResultStatusDRAFT
	if req.ResultStatus != "" {
		status = db.ResultStatus(req.ResultStatus)
	}

	return s.repository.Update(
		ctx,
		db.UpdateCourseResultParams{
			CourseResultID: id,
			TotalMarks:     totalMarks,
			MarksObtained:  marksObtained,
			Percentage:     percentage,
			GradeScaleID:   gradeScaleID,
			ResultStatus:   status,
			PublishedAt: pgtype.Timestamptz{
				Time:  publishedAt,
				Valid: true,
			},
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
