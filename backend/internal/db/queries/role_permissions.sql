-- name: AssignPermissionToRole :exec
INSERT INTO role_permissions (
    role_permission_id,
    role_id,
    permission_id
)
VALUES (
    $1,
    $2,
    $3
)
ON CONFLICT (role_id, permission_id)
DO NOTHING;


-- name: GetRolePermissions :many
SELECT
    p.*
FROM permissions p
JOIN role_permissions rp
    ON rp.permission_id = p.permission_id
WHERE rp.role_id = $1
ORDER BY p.permission_code;

-- name: RemovePermissionFromRole :exec
DELETE FROM role_permissions
WHERE role_id = $1
AND permission_id = $2;

-- name: GetUserPermissions :many
SELECT DISTINCT
    p.*
FROM permissions p
JOIN role_permissions rp
    ON rp.permission_id = p.permission_id
JOIN user_roles ur
    ON ur.role_id = rp.role_id
WHERE ur.user_id = $1
ORDER BY p.permission_code;