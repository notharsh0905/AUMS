package courseresults

import (
	"context"
	"errors"
	"fmt"
	"time"

	db "aums/backend/internal/db/generated"
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

func (s *Service) List(ctx context.Context) ([]db.CourseResult, error) {
	return s.repository.List(ctx)
}

func (s *Service) ListScoped(
	ctx context.Context,
	callerUserIDStr string,
) ([]db.CourseResult, error) {
	if callerUserIDStr == "" {
		return s.repository.List(ctx)
	}

	callerUserID, err := aumsuuid.Parse(callerUserIDStr)
	if err != nil {
		return s.repository.List(ctx)
	}

	if s.userRolesService != nil {
		isStudent, _ := s.userRolesService.HasRole(ctx, callerUserID, "STUDENT")
		if isStudent {
			return s.repository.ListForStudentUser(ctx, callerUserID)
		}

		isParent, _ := s.userRolesService.HasRole(ctx, callerUserID, "PARENT")
		if isParent {
			return s.repository.ListForParentUser(ctx, callerUserID)
		}

		isFaculty, _ := s.userRolesService.HasRole(ctx, callerUserID, "FACULTY")
		if isFaculty {
			facultyProfile, err := s.repository.GetFacultyProfileByUserID(ctx, callerUserID)
			if err == nil {
				return s.repository.ListForFaculty(ctx, facultyProfile.FacultyProfileID)
			}
		}
	}

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

func (s *Service) Create(
	ctx context.Context,
	callerUserIDStr string,
	req CreateCourseResultRequest,
) error {
	return s.Upsert(ctx, callerUserIDStr, req)
}

func (s *Service) Upsert(
	ctx context.Context,
	callerUserIDStr string,
	req CreateCourseResultRequest,
) error {
	if req.MarksObtained < 0 {
		return errors.New("marks obtained cannot be negative")
	}

	if req.MarksObtained > req.TotalMarks {
		return fmt.Errorf("marks obtained (%.2f) cannot exceed total marks (%.2f)", req.MarksObtained, req.TotalMarks)
	}

	if callerUserIDStr != "" && s.userRolesService != nil {
		callerUserID, err := aumsuuid.Parse(callerUserIDStr)
		if err == nil {
			isStudent, err := s.userRolesService.HasRole(ctx, callerUserID, "STUDENT")
			if err == nil && isStudent {
				return errors.New("forbidden: students cannot modify course marks")
			}

			isFaculty, err := s.userRolesService.HasRole(ctx, callerUserID, "FACULTY")
			if err == nil && isFaculty {
				facultyProfile, err := s.repository.GetFacultyProfileByUserID(ctx, callerUserID)
				if err != nil {
					return errors.New("faculty profile not found")
				}

				offeringID, err := aumsuuid.Parse(req.CourseOfferingID)
				if err != nil {
					return errors.New("invalid course offering id")
				}

				allocations, err := s.repository.ListFacultyCourseAllocations(ctx)
				if err == nil {
					isAllocated := false
					for _, alloc := range allocations {
						if alloc.FacultyProfileID == facultyProfile.FacultyProfileID && alloc.CourseOfferingID == offeringID {
							isAllocated = true
							break
						}
					}
					// If course offerings exist in DB, verify instructor allocation
					if !isAllocated && len(allocations) > 0 {
						return errors.New("unauthorized: faculty can only grade allocated courses")
					}
				}
			}
		}
	}

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
		publishedAt = time.Now()
	}

	status := db.ResultStatusDRAFT
	if req.ResultStatus != "" {
		status = db.ResultStatus(req.ResultStatus)
	}

	return s.repository.Upsert(
		ctx,
		db.UpsertCourseResultParams{
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

	if req.MarksObtained < 0 {
		return errors.New("marks obtained cannot be negative")
	}

	if req.MarksObtained > req.TotalMarks {
		return fmt.Errorf("marks obtained (%.2f) cannot exceed total marks (%.2f)", req.MarksObtained, req.TotalMarks)
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
		publishedAt = time.Now()
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
