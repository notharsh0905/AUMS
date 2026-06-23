-- name: ListStudentCourseRegistrations :many
SELECT *
FROM student_course_registrations
ORDER BY registered_at DESC;

-- name: CreateStudentCourseRegistration :exec
INSERT INTO student_course_registrations (
    student_course_registration_id,
    enrollment_id,
    course_offering_id,
    registration_status
)
VALUES (
    $1,
    $2,
    $3,
    $4
);