package attendance

import (
	"context"
	"errors"

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
) ([]generated.AttendanceRecord, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) ListScoped(
	ctx context.Context,
	callerUserID pgtype.UUID,
) ([]generated.AttendanceRecord, error) {
	if s.userRolesService != nil {
		isStudent, _ := s.userRolesService.HasRole(ctx, callerUserID, "STUDENT")
		if isStudent {
			return s.repository.ListForStudentUser(ctx, callerUserID)
		}

		isParent, _ := s.userRolesService.HasRole(ctx, callerUserID, "PARENT")
		if isParent {
			return s.repository.ListForParentUser(ctx, callerUserID)
		}
	}

	// Default administrative & academic listing
	return s.repository.List(ctx)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateAttendanceRecordRequest,
) error {

	recordID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	classSessionID, err := aumsuuid.Parse(
		req.ClassSessionID,
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

	var markedBy pgtype.UUID
	if req.MarkedBy != "" {
		id, err := aumsuuid.Parse(
			req.MarkedBy,
		)
		if err != nil {
			return err
		}
		markedBy = id
	}

	return s.repository.Create(
		ctx,
		generated.CreateAttendanceRecordParams{
			AttendanceRecordID: recordID,
			ClassSessionID:     classSessionID,
			EnrollmentID:       enrollmentID,
			AttendanceStatus: generated.AttendanceStatus(
				req.AttendanceStatus,
			),
			MarkedBy: markedBy,
			Remarks: pgtype.Text{
				String: req.Remarks,
				Valid:  req.Remarks != "",
			},
		},
	)
}

func (s *Service) BulkMark(
	ctx context.Context,
	callerUserIDStr string,
	req BulkMarkAttendanceRequest,
) error {

	if callerUserIDStr == "" {
		return errors.New("unauthorized: caller context missing")
	}

	callerUserID, err := aumsuuid.Parse(callerUserIDStr)
	if err != nil {
		return errors.New("invalid caller user id")
	}

	classSessionID, err := aumsuuid.Parse(req.ClassSessionID)
	if err != nil {
		return errors.New("invalid class session id")
	}

	// 1. Role enforcement
	if s.userRolesService != nil {
		isStudent, err := s.userRolesService.HasRole(ctx, callerUserID, "STUDENT")
		if err == nil && isStudent {
			return errors.New("forbidden: students are not authorized to mark attendance")
		}

		isFaculty, err := s.userRolesService.HasRole(ctx, callerUserID, "FACULTY")
		if err == nil && isFaculty {
			facultyProfile, err := s.repository.GetFacultyProfileByUserID(ctx, callerUserID)
			if err != nil {
				return errors.New("faculty profile not found for user")
			}

			// Verify teaching allocation / session ownership
			session, err := s.repository.GetClassSessionByID(ctx, classSessionID)
			if err != nil {
				return errors.New("class session not found")
			}

			if session.TimetableFacultyProfileID != facultyProfile.FacultyProfileID &&
				(!session.ConductedBy.Valid || session.ConductedBy != facultyProfile.FacultyProfileID) {
				return errors.New("unauthorized: faculty can only mark attendance for allocated class sessions")
			}
		}
	}

	// 2. Validate records payload for duplicates
	seenEnrollments := make(map[string]struct{}, len(req.Records))
	for _, rec := range req.Records {
		if _, exists := seenEnrollments[rec.EnrollmentID]; exists {
			return errors.New("duplicate enrollment record in bulk attendance payload: " + rec.EnrollmentID)
		}
		seenEnrollments[rec.EnrollmentID] = struct{}{}
	}

	// 3. Resolve markedBy
	var markedBy pgtype.UUID
	facultyProfile, err := s.repository.GetFacultyProfileByUserID(ctx, callerUserID)
	if err == nil {
		markedBy = facultyProfile.FacultyProfileID
	}

	// 4. Perform atomic batch upsert
	return s.repository.BulkUpsert(ctx, classSessionID, markedBy, req.Records)
}
