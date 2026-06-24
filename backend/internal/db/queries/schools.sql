-- name: ListSchools :many
SELECT *
FROM schools
ORDER BY school_name;

-- name: CreateSchool :exec
INSERT INTO schools (
    school_id,
    school_code,
    school_name,
    description
)
VALUES (
    $1,
    $2,
    $3,
    $4
);

-- name: ListSchoolsPaginated :many
SELECT *
FROM schools
ORDER BY school_name
LIMIT $1
OFFSET $2;

-- name: CountSchools :one
SELECT COUNT(*)
FROM schools;