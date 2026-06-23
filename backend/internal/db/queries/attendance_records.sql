-- name: ListAttendanceRecords :many
SELECT *
FROM attendance_records
ORDER BY marked_at DESC;

-- name: CreateAttendanceRecord :exec
INSERT INTO attendance_records (
    attendance_record_id,
    class_session_id,
    enrollment_id,
    attendance_status,
    marked_by,
    remarks
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
);