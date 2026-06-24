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

func NewService(
	repository *Repository,
) *Service {

	return &Service{
		repository: repository,
	}
}

func (s *Service) Create(
	ctx context.Context,
	req CreateCourseResultRequest,
) error {

	courseResultID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	var enrollmentID pgtype.UUID
	if err := enrollmentID.Scan(req.EnrollmentID); err != nil {
		return err
	}

	var courseOfferingID pgtype.UUID
	if err := courseOfferingID.Scan(req.CourseOfferingID); err != nil {
		return err
	}

	var gradeScaleID pgtype.UUID
	if err := gradeScaleID.Scan(req.GradeScaleID); err != nil {
		return err
	}

	var totalMarks pgtype.Numeric
	if err := totalMarks.Scan(
		fmt.Sprintf("%.2f", req.TotalMarks),
	); err != nil {
		return err
	}

	var marksObtained pgtype.Numeric
	if err := marksObtained.Scan(
		fmt.Sprintf("%.2f", req.MarksObtained),
	); err != nil {
		return err
	}

	var percentage pgtype.Numeric
	if err := percentage.Scan(
		fmt.Sprintf("%.2f", req.Percentage),
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

func (s *Service) List(
	ctx context.Context,
) ([]db.CourseResult, error) {

	return s.repository.List(
		ctx,
	)
}
