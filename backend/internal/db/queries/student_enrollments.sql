-- name: ListStudentEnrollments :many
SELECT *
FROM student_enrollments
ORDER BY created_at DESC;

-- name: CreateStudentEnrollment :exec
INSERT INTO student_enrollments (
    enrollment_id,
    student_profile_id,
    program_id,
    enrollment_number,
    enrollment_date,
    graduation_date,
    status,
    remarks
)
VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8
);