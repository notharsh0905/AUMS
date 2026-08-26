-- name: ListClassSessions :many
SELECT *
FROM class_sessions
ORDER BY session_date DESC;

-- name: GetClassSessionByID :one
SELECT
    cs.class_session_id,
    cs.timetable_entry_id,
    cs.session_date,
    cs.start_time,
    cs.end_time,
    cs.session_status,
    cs.conducted_by,
    cs.remarks,
    cs.created_at,
    cs.updated_at,
    te.faculty_profile_id AS timetable_faculty_profile_id,
    te.course_offering_id
FROM class_sessions cs
JOIN timetable_entries te ON te.timetable_entry_id = cs.timetable_entry_id
WHERE cs.class_session_id = $1;

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