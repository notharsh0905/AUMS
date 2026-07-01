-- name: GetTranscriptStudentInfo :one
SELECT
    se.enrollment_id,
    se.enrollment_number,
    se.enrollment_date,
    se.graduation_date,
    se.status AS enrollment_status,
    sp.student_profile_id,
    sp.admission_date,
    sp.date_of_birth,
    sp.gender,
    sp.blood_group,
    sp.nationality,
    u.first_name,
    u.last_name,
    u.email,
    p.program_id,
    p.program_code,
    p.program_name,
    p.degree_type,
    d.department_name
FROM student_enrollments se
JOIN student_profiles sp ON se.student_profile_id = sp.student_profile_id
JOIN users u ON sp.user_id = u.user_id
JOIN programs p ON se.program_id = p.program_id
JOIN departments d ON p.department_id = d.department_id
WHERE sp.student_profile_id = $1
ORDER BY se.created_at DESC
LIMIT 1;

-- name: GetTranscriptSemesterSummary :many
SELECT
    sr.semester_result_id,
    sr.semester_id,
    s.semester_number,
    s.semester_name,
    sr.total_credits,
    sr.earned_credits,
    sr.sgpa,
    sr.result_status,
    sr.published_at
FROM semester_results sr
JOIN semesters s ON sr.semester_id = s.semester_id
WHERE sr.enrollment_id = $1
  AND sr.result_status = 'PUBLISHED'
ORDER BY s.semester_number ASC;

-- name: GetTranscriptCourseSummary :many
SELECT
    cr.course_result_id,
    co.course_offering_id,
    c.course_id,
    c.course_code,
    c.course_name,
    c.credits,
    co.semester_id,
    s.semester_number,
    cr.total_marks,
    cr.marks_obtained,
    cr.percentage,
    gs.grade_code,
    gs.grade_point,
    gs.is_passing,
    cr.result_status,
    cr.published_at
FROM course_results cr
JOIN course_offerings co ON cr.course_offering_id = co.course_offering_id
JOIN courses c ON co.course_id = c.course_id
JOIN semesters s ON co.semester_id = s.semester_id
LEFT JOIN grade_scales gs ON cr.grade_scale_id = gs.grade_scale_id
WHERE cr.enrollment_id = $1
  AND cr.result_status = 'PUBLISHED'
ORDER BY s.semester_number ASC, c.course_code ASC;

-- name: GetTranscriptCGPASummary :one
SELECT
    pr.program_result_id,
    pr.cgpa,
    pr.total_credits,
    pr.earned_credits,
    pr.degree_completed,
    pr.completion_date,
    pr.result_status,
    pr.published_at
FROM program_results pr
WHERE pr.enrollment_id = $1
ORDER BY pr.created_at DESC
LIMIT 1;
