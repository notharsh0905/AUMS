-- name: ListAcademicYears :many
SELECT *
FROM academic_years
ORDER BY start_date DESC;

-- name: CreateAcademicYear :exec
INSERT INTO academic_years (
    academic_year_id,
    academic_year_name,
    start_date,
    end_date,
    is_current
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5
);