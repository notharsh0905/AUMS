-- name: ListExams :many
SELECT *
FROM exams
ORDER BY created_at DESC;

-- name: CreateExam :exec
INSERT INTO exams (
    exam_id,
    course_offering_id,
    exam_name,
    exam_type,
    total_marks,
    passing_marks,
    exam_status,
    description
)
VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8
);