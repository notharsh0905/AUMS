-- name: ListExamAttempts :many
SELECT *
FROM exam_attempts
ORDER BY created_at DESC;

-- name: ListExamAttemptsPaginated :many
SELECT ea.*
FROM exam_attempts ea
JOIN exam_registrations er ON ea.exam_registration_id = er.exam_registration_id
WHERE ($3::text = '' OR er.exam_id = $3::uuid)
  AND ($4::text = '' OR ea.exam_registration_id = $4::uuid)
  AND ($5::text = '' OR er.enrollment_id = $5::uuid)
  AND ($6::text = '' OR er.registration_status = $6)
ORDER BY ea.created_at DESC
LIMIT $1
OFFSET $2;

-- name: CountExamAttempts :one
SELECT COUNT(*)
FROM exam_attempts ea
JOIN exam_registrations er ON ea.exam_registration_id = er.exam_registration_id
WHERE ($1::text = '' OR er.exam_id = $1::uuid)
  AND ($2::text = '' OR ea.exam_registration_id = $2::uuid)
  AND ($3::text = '' OR er.enrollment_id = $3::uuid)
  AND ($4::text = '' OR er.registration_status = $4);

-- name: GetExamAttempt :one
SELECT *
FROM exam_attempts
WHERE exam_attempt_id = $1;

-- name: CreateExamAttempt :exec
INSERT INTO exam_attempts (
    exam_attempt_id,
    exam_registration_id,
    attempt_number,
    marks_obtained,
    evaluator_id,
    evaluated_at,
    remarks,
    created_at,
    updated_at
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, NOW(), NOW()
);

-- name: UpdateExamAttempt :exec
UPDATE exam_attempts
SET
    marks_obtained = $2,
    evaluator_id = $3,
    evaluated_at = $4,
    remarks = $5,
    updated_at = NOW()
WHERE exam_attempt_id = $1;

-- name: DeleteExamAttempt :exec
DELETE FROM exam_attempts
WHERE exam_attempt_id = $1;
