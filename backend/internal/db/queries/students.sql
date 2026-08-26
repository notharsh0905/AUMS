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

-- name: ListStudentsPaginated :many
SELECT *
FROM student_profiles
ORDER BY created_at DESC
LIMIT $1
OFFSET $2;

-- name: CountStudents :one
SELECT COUNT(*)
FROM student_profiles;

-- name: GetStudentProfileByUserID :one
SELECT *
FROM student_profiles
WHERE user_id = $1;

-- name: GetStudentProfileByID :one
SELECT *
FROM student_profiles
WHERE student_profile_id = $1;

-- name: ListStudentsByParentUserID :many
SELECT sp.*
FROM student_profiles sp
JOIN student_parent_relationships spr
    ON spr.student_profile_id = sp.student_profile_id
JOIN parent_profiles pp
    ON pp.parent_profile_id = spr.parent_profile_id
WHERE pp.user_id = $1
ORDER BY sp.created_at DESC;