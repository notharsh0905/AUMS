-- name: AssignRoleToUser :exec
INSERT INTO user_roles (
    user_role_id,
    user_id,
    role_id
)
VALUES (
    $1,
    $2,
    $3
);

-- name: GetUserRoles :many
SELECT r.*
FROM roles r
JOIN user_roles ur
ON ur.role_id = r.role_id
WHERE ur.user_id = $1;