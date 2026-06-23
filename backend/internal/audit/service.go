package audit

import (
	"context"

	"aums/backend/internal/db/generated"
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

func (s *Service) LogLogin(
	ctx context.Context,
	params generated.CreateLoginAuditLogParams,
) error {

	return s.repository.CreateLoginAuditLog(
		ctx,
		params,
	)
}

func (s *Service) LogAuditEvent(
	ctx context.Context,
	params generated.CreateAuditLogParams,
) error {

	return s.repository.CreateAuditLog(
		ctx,
		params,
	)
}

func (s *Service) LogSuccessfulLogin(
	ctx context.Context,
	params generated.CreateLoginAuditLogParams,
) error {

	params.LoginStatus = generated.LoginStatusSUCCESS

	return s.repository.CreateLoginAuditLog(
		ctx,
		params,
	)

}

func (s *Service) LogFailedLogin(
	ctx context.Context,
	params generated.CreateLoginAuditLogParams,
) error {

	params.LoginStatus = generated.LoginStatusFAILED

	return s.repository.CreateLoginAuditLog(
		ctx,
		params,
	)
}
