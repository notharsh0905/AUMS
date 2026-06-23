-- name: ListProgramCurriculum :many
SELECT *
FROM program_curriculum
ORDER BY semester_number;

-- name: CreateProgramCurriculum :exec
INSERT INTO program_curriculum (
    program_curriculum_id,
    program_id,
    course_id,
    semester_number,
    is_mandatory
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5
);