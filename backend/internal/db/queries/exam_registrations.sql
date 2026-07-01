-- name: ListExamRegistrations :many
SELECT *
FROM exam_registrations
ORDER BY registered_at DESC;

-- name: ListExamRegistrationsPaginated :many
SELECT *
FROM exam_registrations
WHERE ($3::text = '' OR exam_id = $3::uuid)
  AND ($4::text = '' OR enrollment_id = $4::uuid)
  AND ($5::text = '' OR registration_status = $5)
ORDER BY registered_at DESC
LIMIT $1
OFFSET $2;

-- name: CountExamRegistrations :one
SELECT COUNT(*)
FROM exam_registrations
WHERE ($1::text = '' OR exam_id = $1::uuid)
  AND ($2::text = '' OR enrollment_id = $2::uuid)
  AND ($3::text = '' OR registration_status = $3);

-- name: GetExamRegistration :one
SELECT *
FROM exam_registrations
WHERE exam_registration_id = $1;

-- name: CreateExamRegistration :exec
INSERT INTO exam_registrations (
    exam_registration_id,
    exam_id,
    enrollment_id,
    registration_status,
    registered_at,
    created_at,
    updated_at
)
VALUES (
    $1, $2, $3, $4, NOW(), NOW(), NOW()
);

-- name: UpdateExamRegistration :exec
UPDATE exam_registrations
SET
    registration_status = $2,
    updated_at = NOW()
WHERE exam_registration_id = $1;

-- name: DeleteExamRegistration :exec
DELETE FROM exam_registrations
WHERE exam_registration_id = $1;