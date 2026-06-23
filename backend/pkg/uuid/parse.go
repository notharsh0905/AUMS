package uuid

import (
	"github.com/jackc/pgx/v5/pgtype"
)

func Parse(
	value string,
) (pgtype.UUID, error) {

	var id pgtype.UUID

	err := id.Scan(value)

	return id, err
}
