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