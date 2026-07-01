-- name: ListExamRooms :many
SELECT *
FROM exam_rooms
WHERE deleted_at IS NULL
ORDER BY building, room_number;

-- name: ListExamRoomsPaginated :many
SELECT *
FROM exam_rooms
WHERE deleted_at IS NULL
  AND ($3::text = '' OR building ILIKE '%' || $3 || '%' OR room_number ILIKE '%' || $3 || '%' OR room_name ILIKE '%' || $3 || '%')
  AND ($4::text = '' OR status = $4)
  AND ($5::text = '' OR room_type = $5)
ORDER BY building, room_number
LIMIT $1
OFFSET $2;

-- name: CountExamRooms :one
SELECT COUNT(*)
FROM exam_rooms
WHERE deleted_at IS NULL
  AND ($1::text = '' OR building ILIKE '%' || $1 || '%' OR room_number ILIKE '%' || $1 || '%' OR room_name ILIKE '%' || $1 || '%')
  AND ($2::text = '' OR status = $2)
  AND ($3::text = '' OR room_type = $3);

-- name: GetExamRoom :one
SELECT *
FROM exam_rooms
WHERE exam_room_id = $1 AND deleted_at IS NULL;

-- name: CreateExamRoom :exec
INSERT INTO exam_rooms (
    exam_room_id,
    building,
    room_number,
    room_name,
    floor,
    block,
    capacity,
    room_type,
    status,
    has_projector,
    has_ac,
    wheelchair_accessible,
    institution_id,
    created_at,
    updated_at
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()
);

-- name: UpdateExamRoom :exec
UPDATE exam_rooms
SET
    building = $2,
    room_number = $3,
    room_name = $4,
    floor = $5,
    block = $6,
    capacity = $7,
    room_type = $8,
    status = $9,
    has_projector = $10,
    has_ac = $11,
    wheelchair_accessible = $12,
    updated_at = NOW()
WHERE exam_room_id = $1 AND deleted_at IS NULL;

-- name: SoftDeleteExamRoom :exec
UPDATE exam_rooms
SET
    deleted_at = NOW(),
    updated_at = NOW()
WHERE exam_room_id = $1;
