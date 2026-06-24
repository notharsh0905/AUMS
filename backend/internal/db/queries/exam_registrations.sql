-- name: ListExamRegistrations :many
SELECT *
FROM exam_registrations
ORDER BY registered_at DESC;

-- name: CreateExamRegistration :exec
INSERT INTO exam_registrations (
    exam_registration_id,
    exam_id,
    enrollment_id,
    registration_status
)
VALUES (
    $1,$2,$3,$4
);