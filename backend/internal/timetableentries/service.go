package timetableentries

import (
	"context"
	"errors"

	"aums/backend/internal/db/generated"
	"aums/backend/internal/userroles"
	aumsuuid "aums/backend/pkg/uuid"
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
) ([]generated.TimetableEntry, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) ListScoped(
	ctx context.Context,
	callerUserIDStr string,
) ([]generated.TimetableEntry, error) {

	if callerUserIDStr == "" {
		return s.repository.List(ctx)
	}

	callerUserID, err := aumsuuid.Parse(callerUserIDStr)
	if err != nil {
		return s.repository.List(ctx)
	}

	// 1. Broad academic administrative roles retain full timetable visibility
	isAdmin, err := s.userRolesService.HasRole(ctx, callerUserID, "SUPER_ADMIN")
	if err == nil && isAdmin {
		return s.repository.List(ctx)
	}

	isInstAdmin, err := s.userRolesService.HasRole(ctx, callerUserID, "INSTITUTION_ADMIN")
	if err == nil && isInstAdmin {
		return s.repository.List(ctx)
	}

	isDean, err := s.userRolesService.HasRole(ctx, callerUserID, "DEAN")
	if err == nil && isDean {
		return s.repository.List(ctx)
	}

	isHOD, err := s.userRolesService.HasRole(ctx, callerUserID, "HOD")
	if err == nil && isHOD {
		return s.repository.List(ctx)
	}

	// 2. Faculty role: scope to assigned teaching slots
	isFaculty, err := s.userRolesService.HasRole(ctx, callerUserID, "FACULTY")
	if err == nil && isFaculty {
		faculty, err := s.repository.GetFacultyProfileByUserID(ctx, callerUserID)
		if err == nil {
			return s.repository.ListForFaculty(ctx, faculty.FacultyProfileID)
		}
	}

	// 3. Student role: scope to enrolled course offerings
	isStudent, err := s.userRolesService.HasRole(ctx, callerUserID, "STUDENT")
	if err == nil && isStudent {
		student, err := s.repository.GetStudentProfileByUserID(ctx, callerUserID)
		if err == nil {
			return s.repository.ListForStudent(ctx, student.StudentProfileID)
		}
	}

	return s.repository.List(ctx)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateTimetableEntryRequest,
) error {

	entryID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	timetableID, err := aumsuuid.Parse(req.TimetableID)
	if err != nil {
		return err
	}

	courseOfferingID, err := aumsuuid.Parse(req.CourseOfferingID)
	if err != nil {
		return err
	}

	facultyID, err := aumsuuid.Parse(req.FacultyProfileID)
	if err != nil {
		return err
	}

	roomID, err := aumsuuid.Parse(req.RoomID)
	if err != nil {
		return err
	}

	workingDayID, err := aumsuuid.Parse(req.WorkingDayID)
	if err != nil {
		return err
	}

	timeSlotID, err := aumsuuid.Parse(req.TimeSlotID)
	if err != nil {
		return err
	}

	return s.repository.Create(
		ctx,
		generated.CreateTimetableEntryParams{
			TimetableEntryID: entryID,
			TimetableID:      timetableID,
			CourseOfferingID: courseOfferingID,
			FacultyProfileID: facultyID,
			RoomID:           roomID,
			WorkingDayID:     workingDayID,
			TimeSlotID:       timeSlotID,
			EntryType: generated.TimetableEntryType(
				req.EntryType,
			),
		},
	)
}

func (s *Service) Delete(
	ctx context.Context,
	idStr string,
) error {

	id, err := aumsuuid.Parse(idStr)
	if err != nil {
		return errors.New("invalid timetable entry id")
	}

	return s.repository.Delete(ctx, id)
}
