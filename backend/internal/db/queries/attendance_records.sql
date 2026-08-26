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

-- name: UpsertAttendanceRecord :exec
INSERT INTO attendance_records (
    attendance_record_id,
    class_session_id,
    enrollment_id,
    attendance_status,
    marked_by,
    remarks,
    marked_at,
    created_at,
    updated_at
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    NOW(),
    NOW(),
    NOW()
)
ON CONFLICT (class_session_id, enrollment_id)
DO UPDATE SET
    attendance_status = EXCLUDED.attendance_status,
    marked_by = EXCLUDED.marked_by,
    remarks = EXCLUDED.remarks,
    marked_at = NOW(),
    updated_at = NOW();

-- name: ListAttendanceRecordsForStudentUser :many
SELECT ar.*
FROM attendance_records ar
JOIN student_enrollments se
    ON se.enrollment_id = ar.enrollment_id
JOIN student_profiles sp
    ON sp.student_profile_id = se.student_profile_id
WHERE sp.user_id = $1
ORDER BY ar.marked_at DESC;

-- name: ListAttendanceRecordsForParentUser :many
SELECT ar.*
FROM attendance_records ar
JOIN student_enrollments se
    ON se.enrollment_id = ar.enrollment_id
JOIN student_profiles sp
    ON sp.student_profile_id = se.student_profile_id
JOIN student_parent_relationships spr
    ON spr.student_profile_id = sp.student_profile_id
JOIN parent_profiles pp
    ON pp.parent_profile_id = spr.parent_profile_id
WHERE pp.user_id = $1
ORDER BY ar.marked_at DESC;