package timetableentries

import (
	"context"

	"aums/backend/internal/db/generated"
	aumsuuid "aums/backend/pkg/uuid"
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

func (s *Service) List(
	ctx context.Context,
) ([]generated.TimetableEntry, error) {

	return s.repository.List(
		ctx,
	)
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
