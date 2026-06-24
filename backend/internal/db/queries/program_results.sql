-- name: ListProgramResults :many
SELECT *
FROM program_results
ORDER BY created_at DESC;

-- name: CreateProgramResult :exec
INSERT INTO program_results (
    program_result_id,
    enrollment_id,
    cgpa,
    total_credits,
    earned_credits,
    degree_completed,
    completion_date,
    result_status,
    published_at
)
VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9
);