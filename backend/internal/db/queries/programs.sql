-- name: ListPrograms :many
SELECT *
FROM programs
ORDER BY program_name;

-- name: CreateProgram :exec
INSERT INTO programs (
    program_id,
    department_id,
    program_code,
    program_name,
    degree_type,
    duration_value,
    duration_unit,
    total_semesters
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8
);