-- name: ListExamAttempts :many
SELECT *
FROM exam_attempts
ORDER BY created_at DESC;

-- name: CreateExamAttempt :exec
INSERT INTO exam_attempts (
    exam_attempt_id,
    exam_registration_id,
    attempt_number,
    marks_obtained,
    evaluator_id,
    evaluated_at,
    remarks
)
VALUES (
    $1,$2,$3,$4,$5,$6,$7
);
