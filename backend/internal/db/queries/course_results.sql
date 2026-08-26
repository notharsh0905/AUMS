-- name: ListCourseResults :many
SELECT *
FROM course_results
ORDER BY created_at DESC;

-- name: ListCourseResultsPaginated :many
SELECT *
FROM course_results
WHERE ($3::text = '' OR enrollment_id = $3::uuid)
  AND ($4::text = '' OR course_offering_id = $4::uuid)
  AND ($5::text = '' OR result_status = $5::text::result_status)
ORDER BY created_at DESC
LIMIT $1
OFFSET $2;

-- name: ListCourseResultsForStudentUser :many
SELECT cr.*
FROM course_results cr
JOIN student_enrollments se ON se.enrollment_id = cr.enrollment_id
JOIN student_profiles sp ON sp.student_profile_id = se.student_profile_id
WHERE sp.user_id = $1
ORDER BY cr.created_at DESC;

-- name: ListCourseResultsForParentUser :many
SELECT cr.*
FROM course_results cr
JOIN student_enrollments se ON se.enrollment_id = cr.enrollment_id
JOIN student_profiles sp ON sp.student_profile_id = se.student_profile_id
JOIN student_parent_relationships spr ON spr.student_profile_id = sp.student_profile_id
JOIN parent_profiles pp ON pp.parent_profile_id = spr.parent_profile_id
WHERE pp.user_id = $1
ORDER BY cr.created_at DESC;

-- name: ListCourseResultsForFaculty :many
SELECT cr.*
FROM course_results cr
JOIN faculty_course_allocations fca ON fca.course_offering_id = cr.course_offering_id
WHERE fca.faculty_profile_id = $1
ORDER BY cr.created_at DESC;

-- name: CountCourseResults :one
SELECT COUNT(*)
FROM course_results
WHERE ($1::text = '' OR enrollment_id = $1::uuid)
  AND ($2::text = '' OR course_offering_id = $2::uuid)
  AND ($3::text = '' OR result_status = $3::text::result_status);

-- name: GetCourseResult :one
SELECT *
FROM course_results
WHERE course_result_id = $1;

-- name: CreateCourseResult :exec
INSERT INTO course_results (
    course_result_id,
    enrollment_id,
    course_offering_id,
    total_marks,
    marks_obtained,
    percentage,
    grade_scale_id,
    result_status,
    published_at,
    created_at,
    updated_at
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()
);

-- name: UpsertCourseResult :exec
INSERT INTO course_results (
    course_result_id,
    enrollment_id,
    course_offering_id,
    total_marks,
    marks_obtained,
    percentage,
    grade_scale_id,
    result_status,
    published_at,
    created_at,
    updated_at
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()
)
ON CONFLICT (enrollment_id, course_offering_id)
DO UPDATE SET
    total_marks = EXCLUDED.total_marks,
    marks_obtained = EXCLUDED.marks_obtained,
    percentage = EXCLUDED.percentage,
    grade_scale_id = EXCLUDED.grade_scale_id,
    result_status = EXCLUDED.result_status,
    published_at = EXCLUDED.published_at,
    updated_at = NOW();

-- name: UpdateCourseResult :exec
UPDATE course_results
SET
    total_marks = $2,
    marks_obtained = $3,
    percentage = $4,
    grade_scale_id = $5,
    result_status = $6,
    published_at = $7,
    updated_at = NOW()
WHERE course_result_id = $1;

-- name: DeleteCourseResult :exec
DELETE FROM course_results
WHERE course_result_id = $1;