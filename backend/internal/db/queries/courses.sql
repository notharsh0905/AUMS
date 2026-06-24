-- name: ListCourses :many
SELECT *
FROM courses
ORDER BY course_name;

-- name: CreateCourse :exec
INSERT INTO courses (
    course_id,
    course_code,
    course_name,
    course_type,
    credits,
    contact_hours,
    description
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

-- name: ListCoursesPaginated :many
SELECT *
FROM courses
ORDER BY course_name
LIMIT $1
OFFSET $2;

-- name: CountCourses :one
SELECT COUNT(*)
FROM courses;