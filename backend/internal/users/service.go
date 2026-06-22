package users

import (
	"context"

	"aums/backend/internal/db/generated"
	"aums/backend/pkg/password"
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

func (s *Service) GetByEmail(
	ctx context.Context,
	email string,
) (generated.User, error) {

	return s.repository.GetByEmail(
		ctx,
		email,
	)
}

func (s *Service) List(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]generated.User, error) {

	return s.repository.List(
		ctx,
		limit,
		offset,
	)
}

func (s *Service) Create(
	ctx context.Context,
	req CreateUserRequest,
) (generated.User, error) {

	hashedPassword, err := password.Hash(
		req.Password,
	)

	if err != nil {
		return generated.User{}, err
	}

	userID, err := aumsuuid.New()
	if err != nil {
		return generated.User{}, err
	}

	return s.repository.Create(
		ctx,
		generated.CreateUserParams{
			UserID: userID,

			Username: pgtype.Text{
				String: req.Username,
				Valid:  true,
			},

			Email: req.Email,

			PhoneNumber: pgtype.Text{
				String: req.PhoneNumber,
				Valid:  req.PhoneNumber != "",
			},

			PasswordHash: pgtype.Text{
				String: hashedPassword,
				Valid:  true,
			},

			FirstName: req.FirstName,

			MiddleName: pgtype.Text{
				String: req.MiddleName,
				Valid:  req.MiddleName != "",
			},

			LastName: pgtype.Text{
				String: req.LastName,
				Valid:  req.LastName != "",
			},

			ProfilePhotoUrl: pgtype.Text{},

			Status: generated.UserStatusPENDINGVERIFICATION,
		},
	)
}
