-- name: ListExamSchedules :many
SELECT *
FROM exam_schedules
ORDER BY exam_date DESC;

-- name: CreateExamSchedule :exec
INSERT INTO exam_schedules (
    exam_schedule_id,
    exam_id,
    room_id,
    exam_date,
    start_time,
    end_time
)
VALUES (
    $1,$2,$3,$4,$5,$6
);