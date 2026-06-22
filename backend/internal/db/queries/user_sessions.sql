-- name: CreateSession :exec
INSERT INTO user_sessions (
    session_id,
    user_id,
    refresh_token_hash,
    expires_at
)
VALUES (
    $1,
    $2,
    $3,
    $4
);

-- name: DeleteSession :exec
DELETE FROM user_sessions
WHERE session_id = $1;

-- name: GetSessionsByUser :many
SELECT *
FROM user_sessions
WHERE user_id = $1
AND revoked_at IS NULL;