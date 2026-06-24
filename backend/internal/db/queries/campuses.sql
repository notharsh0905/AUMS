-- name: ListCampuses :many
SELECT *
FROM campuses
ORDER BY campus_name;

-- name: CreateCampus :exec
INSERT INTO campuses (
    campus_id,
    campus_code,
    campus_name,
    address_line_1,
    address_line_2,
    city,
    state,
    country,
    postal_code
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9
);
-- name: ListCampusesPaginated :many
SELECT *
FROM campuses
ORDER BY campus_name
LIMIT $1
OFFSET $2;

-- name: CountCampuses :one
SELECT COUNT(*)
FROM campuses;