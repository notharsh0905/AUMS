-- name: ListAssignments :many
SELECT *
FROM assignments
ORDER BY due_at DESC;

-- name: CreateAssignment :exec
INSERT INTO assignments (
    assignment_id,
    course_offering_id,
    faculty_profile_id,
    title,
    description,
    total_marks,
    publish_at,
    due_at,
    assignment_status
)
VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9
);