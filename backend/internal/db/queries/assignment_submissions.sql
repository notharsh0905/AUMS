-- name: ListAssignmentSubmissions :many
SELECT *
FROM assignment_submissions
ORDER BY created_at DESC;

-- name: GetAssignmentSubmissionByID :one
SELECT
    asub.assignment_submission_id,
    asub.assignment_id,
    asub.enrollment_id,
    asub.submission_status,
    asub.submitted_at,
    asub.remarks,
    asub.created_at,
    asub.updated_at,
    a.title AS assignment_title,
    a.total_marks AS assignment_total_marks,
    a.faculty_profile_id AS assignment_faculty_profile_id
FROM assignment_submissions asub
JOIN assignments a ON a.assignment_id = asub.assignment_id
WHERE asub.assignment_submission_id = $1;

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
    $1, $2, $3, $4, $5, $6
);

-- name: UpsertAssignmentGrade :exec
INSERT INTO assignment_grades (
    assignment_grade_id,
    assignment_submission_id,
    evaluated_by,
    marks_awarded,
    feedback,
    evaluated_at,
    created_at,
    updated_at
)
VALUES (
    $1, $2, $3, $4, $5, NOW(), NOW(), NOW()
)
ON CONFLICT (assignment_submission_id)
DO UPDATE SET
    evaluated_by = EXCLUDED.evaluated_by,
    marks_awarded = EXCLUDED.marks_awarded,
    feedback = EXCLUDED.feedback,
    evaluated_at = NOW(),
    updated_at = NOW();

-- name: GetAssignmentGradeBySubmissionID :one
SELECT *
FROM assignment_grades
WHERE assignment_submission_id = $1;

-- name: ListAssignmentGrades :many
SELECT *
FROM assignment_grades;