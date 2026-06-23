-- name: ListSemesters :many
SELECT *
FROM semesters
ORDER BY semester_number;

-- name: CreateSemester :exec
INSERT INTO semesters (
    semester_id,
    academic_year_id,
    semester_number,
    semester_name,
    start_date,
    end_date,
    is_active
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7
);