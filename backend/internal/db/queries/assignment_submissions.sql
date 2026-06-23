-- name: ListAssignmentSubmissions :many
SELECT *
FROM assignment_submissions
ORDER BY created_at DESC;

-- name: CreateAssignmentSubmission :exec
INSERT INTO assignment_submissions (
    assignment_submission_id,
    assignment_id,
    enrollment_id,
    submission_status,
    submitted_at,
    remarks
)
VALUES (
    $1,$2,$3,$4,$5,$6
);