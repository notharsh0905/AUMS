-- name: ListDepartments :many
SELECT *
FROM departments
ORDER BY department_name;

-- name: CreateDepartment :exec
INSERT INTO departments (
    department_id,
    school_id,
    department_code,
    department_name,
    description
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5
);
