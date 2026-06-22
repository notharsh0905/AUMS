-- name: GetUserByID :one
SELECT *
FROM users
WHERE user_id = $1
  AND deleted_at IS NULL;

-- name: GetUserByEmail :one
SELECT *
FROM users
WHERE email = $1
  AND deleted_at IS NULL;

-- name: GetUserByUsername :one
SELECT *
FROM users
WHERE username = $1
  AND deleted_at IS NULL;

-- name: ListUsers :many
SELECT *
FROM users
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: CreateUser :one
INSERT INTO users (
    user_id,
    username,
    email,
    phone_number,
    password_hash,
    first_name,
    middle_name,
    last_name,
    profile_photo_url,
    status
)
VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
)
RETURNING *;

-- name: UpdateLastLogin :exec
UPDATE users
SET
    last_login_at = NOW(),
    updated_at = NOW()
WHERE user_id = $1;

-- name: VerifyEmail :exec
UPDATE users
SET
    is_email_verified = TRUE,
    updated_at = NOW()
WHERE user_id = $1;

-- name: SoftDeleteUser :exec
UPDATE users
SET
    deleted_at = NOW(),
    updated_at = NOW()
WHERE user_id = $1;