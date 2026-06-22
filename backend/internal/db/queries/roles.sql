-- name: GetRoleByCode :one
SELECT *
FROM roles
WHERE role_code = $1
  AND deleted_at IS NULL;

-- name: ListRoles :many
SELECT *
FROM roles
WHERE deleted_at IS NULL
ORDER BY role_name;