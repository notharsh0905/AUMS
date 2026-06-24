package faculty

import (
	"context"
	"time"

	"aums/backend/internal/db/generated"
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

func (s *Service) List(
	ctx context.Context,
) ([]generated.FacultyProfile, error) {

	return s.repository.List(
		ctx,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateFacultyRequest,
) error {

	facultyID, err := aumsuuid.New()
	if err != nil {
		return err
	}

	userID, err := aumsuuid.Parse(
		req.UserID,
	)

	if err != nil {
		return err
	}

	departmentID, err := aumsuuid.Parse(
		req.DepartmentID,
	)

	if err != nil {
		return err
	}

	joiningDate, err := time.Parse(
		"2006-01-02",
		req.JoiningDate,
	)

	if err != nil {
		return err
	}

	var experience pgtype.Numeric

	if req.YearsOfExperience != "" {

		err = experience.Scan(
			req.YearsOfExperience,
		)

		if err != nil {
			return err
		}
	}

	return s.repository.Create(
		ctx,
		generated.CreateFacultyParams{
			FacultyProfileID: facultyID,
			UserID:           userID,
			EmployeeCode:     req.EmployeeCode,
			DepartmentID:     departmentID,

			Designation: generated.FacultyDesignation(
				req.Designation,
			),

			EmploymentType: generated.EmploymentType(
				req.EmploymentType,
			),

			JoiningDate: pgtype.Date{
				Time:  joiningDate,
				Valid: true,
			},

			Status: generated.FacultyStatus(
				req.Status,
			),

			YearsOfExperience: experience,

			OfficeLocation: pgtype.Text{
				String: req.OfficeLocation,
				Valid:  req.OfficeLocation != "",
			},

			Bio: pgtype.Text{
				String: req.Bio,
				Valid:  req.Bio != "",
			},
		},
	)
}

func (s *Service) ListPaginated(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]generated.FacultyProfile, error) {

	return s.repository.ListPaginated(
		ctx,
		limit,
		offset,
	)
}

func (s *Service) Count(
	ctx context.Context,
) (int64, error) {

	return s.repository.Count(
		ctx,
	)
}
