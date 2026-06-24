-- name: ListCourseResults :many
SELECT *
FROM course_results
ORDER BY created_at DESC;

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
    published_at
)
VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9
);