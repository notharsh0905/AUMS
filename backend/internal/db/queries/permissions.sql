-- name: ListPermissions :many
SELECT *
FROM permissions
ORDER BY permission_code;