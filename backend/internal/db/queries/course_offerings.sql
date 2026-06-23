-- name: ListCourseOfferings :many
SELECT *
FROM course_offerings
ORDER BY created_at DESC;

-- name: CreateCourseOffering :exec
INSERT INTO course_offerings (
    course_offering_id,
    course_id,
    academic_year_id,
    semester_id,
    section,
    status,
    max_capacity
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