-- name: ListFaculty :many
SELECT *
FROM faculty_profiles
ORDER BY employee_code;

-- name: CreateFaculty :exec
INSERT INTO faculty_profiles (
    faculty_profile_id,
    user_id,
    employee_code,
    department_id,
    designation,
    employment_type,
    joining_date,
    status,
    years_of_experience,
    office_location,
    bio
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11
);

-- name: ListFacultyPaginated :many
SELECT *
FROM faculty_profiles
ORDER BY employee_code
LIMIT $1
OFFSET $2;

-- name: CountFaculty :one
SELECT COUNT(*)
FROM faculty_profiles;

-- name: GetFacultyProfileByUserID :one
SELECT *
FROM faculty_profiles
WHERE user_id = $1;

-- name: GetFacultyProfileByID :one
SELECT *
FROM faculty_profiles
WHERE faculty_profile_id = $1;

-- name: ListFacultyByDepartment :many
SELECT *
FROM faculty_profiles
WHERE department_id = $1
ORDER BY employee_code;