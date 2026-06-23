package auth

import (
	"context"
	"errors"
	"time"

	"aums/backend/configs"
	"aums/backend/internal/audit"
	"aums/backend/internal/db/generated"
	"aums/backend/internal/sessions"
	"aums/backend/internal/users"
	aumsjwt "aums/backend/pkg/jwt"
	"aums/backend/pkg/password"
	"aums/backend/pkg/token"
	aumsuuid "aums/backend/pkg/uuid"

	"github.com/jackc/pgx/v5/pgtype"
)

type Service struct {
	config *configs.Config

	userRepository *users.Repository

	sessionRepository *sessions.Repository

	auditService *audit.Service
}

func NewService(
	config *configs.Config,
	userRepository *users.Repository,
	sessionRepository *sessions.Repository,
	auditService *audit.Service,
) *Service {

	return &Service{
		config: config,

		userRepository: userRepository,

		sessionRepository: sessionRepository,

		auditService: auditService,
	}
}

func (s *Service) Login(
	ctx context.Context,
	req LoginRequest,
) (*LoginResponse, error) {

	user, err := s.userRepository.GetByEmail(
		ctx,
		req.Email,
	)

	if err != nil {
		return nil, err
	}

	if !user.PasswordHash.Valid {
		return nil, errors.New("invalid credentials")
	}

	err = password.Verify(
		user.PasswordHash.String,
		req.Password,
	)

	if err != nil {

		loginAuditID, uuidErr := aumsuuid.New()
		if uuidErr == nil {

			_ = s.auditService.LogFailedLogin(
				ctx,
				generated.CreateLoginAuditLogParams{
					LoginAuditLogID: loginAuditID,

					UserID: user.UserID,

					LoginTime: pgtype.Timestamptz{
						Time:  time.Now(),
						Valid: true,
					},

					LogoutTime: pgtype.Timestamptz{},

					IpAddress: pgtype.Text{
						String: req.IPAddress,
						Valid:  req.IPAddress != "",
					},

					UserAgent: pgtype.Text{
						String: req.UserAgent,
						Valid:  req.UserAgent != "",
					},
				},
			)
		}

		return nil, errors.New("invalid credentials")
	}

	accessToken, err := aumsjwt.GenerateAccessToken(
		user.UserID.String(),
		s.config.JWT.Secret,
		s.config.JWT.Issuer,
		time.Duration(
			s.config.JWT.AccessTokenDurationMinutes,
		)*time.Minute,
	)

	if err != nil {
		return nil, err
	}

	refreshToken, err := aumsjwt.GenerateRefreshToken(
		user.UserID.String(),
		s.config.JWT.Secret,
		s.config.JWT.Issuer,
		time.Duration(
			s.config.JWT.RefreshTokenDurationHours,
		)*time.Hour,
	)

	if err != nil {
		return nil, err
	}

	sessionID, err := aumsuuid.New()
	if err != nil {
		return nil, err
	}

	err = s.sessionRepository.Create(
		ctx,
		generated.CreateSessionParams{
			SessionID: sessionID,

			UserID: user.UserID,

			RefreshTokenHash: token.Hash(
				refreshToken,
			),

			ExpiresAt: pgtype.Timestamptz{
				Time: time.Now().Add(
					time.Duration(
						s.config.JWT.RefreshTokenDurationHours,
					) * time.Hour,
				),
				Valid: true,
			},
		},
	)

	if err != nil {
		return nil, err
	}

	loginAuditID, err := aumsuuid.New()
	if err != nil {
		return nil, err
	}

	println("IP:", req.IPAddress)
	println("USER AGENT:", req.UserAgent)

	_ = s.auditService.LogSuccessfulLogin(
		ctx,
		generated.CreateLoginAuditLogParams{
			LoginAuditLogID: loginAuditID,

			UserID: user.UserID,

			LoginTime: pgtype.Timestamptz{
				Time:  time.Now(),
				Valid: true,
			},

			LogoutTime: pgtype.Timestamptz{},

			IpAddress: pgtype.Text{
				String: req.IPAddress,
				Valid:  req.IPAddress != "",
			},

			UserAgent: pgtype.Text{
				String: req.UserAgent,
				Valid:  req.UserAgent != "",
			},
		},
	)

	return &LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresIn: int64(
			s.config.JWT.AccessTokenDurationMinutes * 60,
		),
	}, nil
}

func (s *Service) Refresh(
	ctx context.Context,
	req RefreshRequest,
) (*RefreshResponse, error) {
	println("REFRESH TOKEN:")
	println(req.RefreshToken)
	claims, err := aumsjwt.ValidateToken(
		req.RefreshToken,
		s.config.JWT.Secret,
	)

	if err != nil {
		return nil, errors.New("invalid refresh token")
	}

	refreshTokenHash := token.Hash(
		req.RefreshToken,
	)

	_, err = s.sessionRepository.GetByRefreshTokenHash(
		ctx,
		refreshTokenHash,
	)

	if err != nil {
		return nil, errors.New("session not found")
	}

	accessToken, err := aumsjwt.GenerateAccessToken(
		claims.UserID,
		s.config.JWT.Secret,
		s.config.JWT.Issuer,
		time.Duration(
			s.config.JWT.AccessTokenDurationMinutes,
		)*time.Minute,
	)

	if err != nil {
		return nil, err
	}

	return &RefreshResponse{
		AccessToken: accessToken,
		TokenType:   "Bearer",
		ExpiresIn: int64(
			s.config.JWT.AccessTokenDurationMinutes * 60,
		),
	}, nil
}

func (s *Service) Logout(
	ctx context.Context,
	req LogoutRequest,
) error {

	refreshTokenHash := token.Hash(
		req.RefreshToken,
	)

	session, err := s.sessionRepository.GetByRefreshTokenHash(
		ctx,
		refreshTokenHash,
	)

	if err != nil {
		return errors.New("session not found")
	}

	return s.sessionRepository.Delete(
		ctx,
		session.SessionID,
	)
}
