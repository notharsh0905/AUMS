-- name: ListFacultyCourseAllocations :many
SELECT *
FROM faculty_course_allocations
ORDER BY allocated_at DESC;

-- name: CreateFacultyCourseAllocation :exec
INSERT INTO faculty_course_allocations (
    faculty_course_allocation_id,
    faculty_profile_id,
    course_offering_id
)
VALUES (
    $1,
    $2,
    $3
);