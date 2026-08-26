package attendance

import (
	"context"

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
