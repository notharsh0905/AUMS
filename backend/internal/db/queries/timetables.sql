-- name: ListTimetables :many
SELECT *
FROM timetables
ORDER BY timetable_name;

-- name: CreateTimetable :exec
INSERT INTO timetables (
    timetable_id,
    timetable_name,
    academic_year_id,
    semester_id,
    effective_from,
    effective_to,
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