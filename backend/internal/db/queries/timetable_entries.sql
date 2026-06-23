-- name: ListTimetableEntries :many
SELECT *
FROM timetable_entries
ORDER BY created_at DESC;

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