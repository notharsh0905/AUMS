-- name: ListSemesterResults :many
SELECT *
FROM semester_results
ORDER BY created_at DESC;

-- name: CreateSemesterResult :exec
INSERT INTO semester_results (
    semester_result_id,
    enrollment_id,
    semester_id,
    total_credits,
    earned_credits,
    sgpa,
    result_status,
    published_at
)
VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8
);