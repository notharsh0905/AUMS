-- name: ListStudents :many
SELECT *
FROM student_profiles
ORDER BY created_at DESC;

-- name: CreateStudent :exec
INSERT INTO student_profiles (
    student_profile_id,
    user_id,
    admission_date,
    date_of_birth,
    gender,
    blood_group,
    nationality,
    category,
    religion,
    emergency_contact_name,
    emergency_contact_phone
)
VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
);