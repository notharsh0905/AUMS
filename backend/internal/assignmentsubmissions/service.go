package assignmentsubmissions

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"aums/backend/internal/db/generated"
	"aums/backend/internal/userroles"
	aumsuuid "aums/backend/pkg/uuid"

	"github.com/jackc/pgx/v5/pgtype"
)

type Service struct {
	repository       *Repository
	userRolesService *userroles.Service
}

func NewService(
	repository *Repository,
	userRolesService *userroles.Service,
) *Service {

	return &Service{
		repository:       repository,
		userRolesService: userRolesService,
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

func (s *Service) Grade(
	ctx context.Context,
	submissionIDStr string,
	callerUserIDStr string,
	req GradeAssignmentSubmissionRequest,
) error {

	submissionID, err := aumsuuid.Parse(submissionIDStr)
	if err != nil {
		return errors.New("invalid submission id")
	}

	callerUserID, err := aumsuuid.Parse(callerUserIDStr)
	if err != nil {
		return errors.New("invalid caller user id")
	}

	// 1. Fetch submission details
	submission, err := s.repository.GetByID(ctx, submissionID)
	if err != nil {
		return fmt.Errorf("assignment submission not found: %w", err)
	}

	// 2. Determine caller role and faculty profile
	isAdmin, err := s.userRolesService.HasRole(ctx, callerUserID, "SUPER_ADMIN")
	if err != nil {
		return fmt.Errorf("failed to check caller roles: %w", err)
	}

	var facultyProfileID pgtype.UUID

	if !isAdmin {
		// Look up faculty profile for caller
		faculty, err := s.repository.GetFacultyProfileByUserID(ctx, callerUserID)
		if err != nil {
			return errors.New("unauthorized: caller is not a registered faculty member")
		}

		facultyProfileID = faculty.FacultyProfileID

		// Enforce ownership: submission's assignment faculty must match caller faculty
		if submission.AssignmentFacultyProfileID != facultyProfileID {
			return errors.New("forbidden: faculty can only grade assignments allocated to them")
		}
	} else {
		// For admin, assign assignment's faculty_profile_id as evaluator or first available
		facultyProfileID = submission.AssignmentFacultyProfileID
	}

	// 3. Validate maximum marks constraint
	if submission.AssignmentTotalMarks.Valid {
		var str string
		if err := submission.AssignmentTotalMarks.Scan(&str); err == nil {
			if maxMarks, err := strconv.ParseFloat(str, 64); err == nil && maxMarks > 0 {
				if req.MarksAwarded > maxMarks {
					return fmt.Errorf("marks awarded (%.2f) exceeds maximum total marks (%.2f)", req.MarksAwarded, maxMarks)
				}
			}
		}
	}

	// 4. Generate Grade ID & Numeric
	gradeID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	var marksAwardedNumeric pgtype.Numeric
	if err := marksAwardedNumeric.Scan(fmt.Sprintf("%.2f", req.MarksAwarded)); err != nil {
		return fmt.Errorf("invalid marks value: %w", err)
	}

	// 5. Persist grade record in PostgreSQL
	return s.repository.UpsertGrade(
		ctx,
		generated.UpsertAssignmentGradeParams{
			AssignmentGradeID:      gradeID,
			AssignmentSubmissionID: submissionID,
			EvaluatedBy:            facultyProfileID,
			MarksAwarded:           marksAwardedNumeric,
			Feedback: pgtype.Text{
				String: req.Feedback,
				Valid:  req.Feedback != "",
			},
		},
	)
}

func (s *Service) GetGrade(
	ctx context.Context,
	submissionIDStr string,
) (generated.AssignmentGrade, error) {

	submissionID, err := aumsuuid.Parse(submissionIDStr)
	if err != nil {
		return generated.AssignmentGrade{}, errors.New("invalid submission id")
	}

	return s.repository.GetGradeBySubmissionID(ctx, submissionID)
}

func (s *Service) ListGrades(
	ctx context.Context,
) ([]generated.AssignmentGrade, error) {

	return s.repository.ListGrades(ctx)
}
