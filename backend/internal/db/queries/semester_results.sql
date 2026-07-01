-- name: ListSemesterResults :many
SELECT *
FROM semester_results
ORDER BY created_at DESC;

-- name: ListSemesterResultsPaginated :many
SELECT sr.*
FROM semester_results sr
JOIN student_enrollments se ON sr.enrollment_id = se.enrollment_id
JOIN semesters s ON sr.semester_id = s.semester_id
WHERE ($3::text = '' OR sr.semester_id = $3::uuid)
  AND ($4::text = '' OR se.student_profile_id = $4::uuid)
  AND ($5::text = '' OR se.program_id = $5::uuid)
  AND ($6::text = '' OR s.academic_year_id = $6::uuid)
  AND ($7::text = '' OR sr.result_status = $7::text::result_status)
ORDER BY sr.created_at DESC
LIMIT $1
OFFSET $2;

-- name: CountSemesterResults :one
SELECT COUNT(*)
FROM semester_results sr
JOIN student_enrollments se ON sr.enrollment_id = se.enrollment_id
JOIN semesters s ON sr.semester_id = s.semester_id
WHERE ($1::text = '' OR sr.semester_id = $1::uuid)
  AND ($2::text = '' OR se.student_profile_id = $2::uuid)
  AND ($3::text = '' OR se.program_id = $3::uuid)
  AND ($4::text = '' OR s.academic_year_id = $4::uuid)
  AND ($5::text = '' OR sr.result_status = $5::text::result_status);

-- name: GetSemesterResult :one
SELECT *
FROM semester_results
WHERE semester_result_id = $1;

-- name: CreateSemesterResult :exec
INSERT INTO semester_results (
    semester_result_id,
    enrollment_id,
    semester_id,
    total_credits,
    earned_credits,
    sgpa,
    result_status,
    published_at,
    created_at,
    updated_at
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()
);

-- name: UpdateSemesterResult :exec
UPDATE semester_results
SET
    total_credits = $2,
    earned_credits = $3,
    sgpa = $4,
    result_status = $5,
    published_at = $6,
    updated_at = NOW()
WHERE semester_result_id = $1;

-- name: DeleteSemesterResult :exec
DELETE FROM semester_results
WHERE semester_result_id = $1;

-- name: GetCourseResultsForSGPA :many
SELECT
    co.course_offering_id,
    c.credits,
    gs.grade_point,
    gs.is_passing
FROM course_results cr
JOIN course_offerings co ON cr.course_offering_id = co.course_offering_id
JOIN courses c ON co.course_id = c.course_id
LEFT JOIN grade_scales gs ON cr.grade_scale_id = gs.grade_scale_id
WHERE cr.enrollment_id = $1
  AND co.semester_id = $2
  AND cr.result_status = 'PUBLISHED';