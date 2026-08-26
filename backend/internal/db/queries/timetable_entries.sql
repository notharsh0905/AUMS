-- name: ListTimetableEntries :many
SELECT *
FROM timetable_entries
ORDER BY created_at DESC;

-- name: ListTimetableEntriesForFaculty :many
SELECT te.*
FROM timetable_entries te
WHERE te.faculty_profile_id = $1
ORDER BY te.created_at DESC;

-- name: ListTimetableEntriesForStudent :many
SELECT te.*
FROM timetable_entries te
JOIN student_course_registrations scr ON scr.course_offering_id = te.course_offering_id
JOIN student_enrollments se ON se.enrollment_id = scr.enrollment_id
WHERE se.student_profile_id = $1
ORDER BY te.created_at DESC;

-- name: GetTimetableEntryByID :one
SELECT *
FROM timetable_entries
WHERE timetable_entry_id = $1;

-- name: CreateTimetableEntry :exec
INSERT INTO timetable_entries (
    timetable_entry_id,
    timetable_id,
    course_offering_id,
    faculty_profile_id,
    room_id,
    working_day_id,
    time_slot_id,
    entry_type
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

-- name: DeleteTimetableEntry :exec
DELETE FROM timetable_entries
WHERE timetable_entry_id = $1;