-- name: ListClassSessions :many
SELECT *
FROM class_sessions
ORDER BY session_date DESC;

-- name: CreateClassSession :exec
INSERT INTO class_sessions (
    class_session_id,
    timetable_entry_id,
    session_date,
    start_time,
    end_time,
    session_status,
    conducted_by,
    remarks
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8
);