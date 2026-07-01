-- name: ListProgramResults :many
SELECT *
FROM program_results
ORDER BY created_at DESC;

-- name: ListProgramResultsPaginated :many
SELECT pr.*
FROM program_results pr
JOIN student_enrollments se ON pr.enrollment_id = se.enrollment_id
WHERE ($3::text = '' OR se.student_profile_id = $3::uuid)
  AND ($4::text = '' OR se.program_id = $4::uuid)
  AND ($5::text = '' OR se.enrollment_number LIKE '%' || $5::text || '%' OR EXTRACT(YEAR FROM se.enrollment_date)::text = $5::text)
  AND ($6::text = '' OR pr.result_status = $6::text::result_status)
ORDER BY pr.created_at DESC
LIMIT $1
OFFSET $2;

-- name: CountProgramResults :one
SELECT COUNT(*)
FROM program_results pr
JOIN student_enrollments se ON pr.enrollment_id = se.enrollment_id
WHERE ($1::text = '' OR se.student_profile_id = $1::uuid)
  AND ($2::text = '' OR se.program_id = $2::uuid)
  AND ($3::text = '' OR se.enrollment_number LIKE '%' || $3::text || '%' OR EXTRACT(YEAR FROM se.enrollment_date)::text = $3::text)
  AND ($4::text = '' OR pr.result_status = $4::text::result_status);

-- name: GetProgramResult :one
SELECT *
FROM program_results
WHERE program_result_id = $1;

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
    published_at,
    created_at,
    updated_at
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()
);

-- name: UpdateProgramResult :exec
UPDATE program_results
SET
    cgpa = $2,
    total_credits = $3,
    earned_credits = $4,
    degree_completed = $5,
    completion_date = $6,
    result_status = $7,
    published_at = $8,
    updated_at = NOW()
WHERE program_result_id = $1;

-- name: DeleteProgramResult :exec
DELETE FROM program_results
WHERE program_result_id = $1;

-- name: GetSemesterResultsForCGPA :many
SELECT
    earned_credits,
    total_credits,
    sgpa
FROM semester_results
WHERE enrollment_id = $1
  AND result_status = 'PUBLISHED';