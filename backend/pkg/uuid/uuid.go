package uuid

import (
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func New() (pgtype.UUID, error) {

	id := uuid.New()

	var pgUUID pgtype.UUID

	err := pgUUID.Scan(
		id.String(),
	)

	if err != nil {
		return pgtype.UUID{}, err
	}

	return pgUUID, nil
}
