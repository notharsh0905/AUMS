-- ==========================================
-- SUPER_ADMIN
-- ALL PERMISSIONS
-- ==========================================

INSERT INTO role_permissions (
role_permission_id,
role_id,
permission_id,
created_at,
updated_at
)
SELECT
gen_random_uuid(),
r.role_id,
p.permission_id,
NOW(),
NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'SUPER_ADMIN'
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- INSTITUTION_ADMIN
-- ALL NON-PLATFORM PERMISSIONS
-- ==========================================

INSERT INTO role_permissions (
role_permission_id,
role_id,
permission_id,
created_at,
updated_at
)
SELECT
gen_random_uuid(),
r.role_id,
p.permission_id,
NOW(),
NOW()
FROM roles r
JOIN permissions p ON TRUE
WHERE r.role_code = 'INSTITUTION_ADMIN'
AND p.permission_code NOT IN (


-- Platform Governance

'institutions.create',
'institutions.delete',
'institutions.manage',

'platform_settings.update',

'feature_flags.update',
'feature_flags.manage',

'permissions.create',
'permissions.update',
'permissions.delete',
'permissions.manage',

'audit.manage'


)
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- DIRECTOR
-- ==========================================

INSERT INTO role_permissions (
role_permission_id,
role_id,
permission_id
)
SELECT
gen_random_uuid(),
r.role_id,
p.permission_id
FROM roles r
JOIN permissions p
ON p.permission_code IN (


-- Institution Visibility

'institutions.read',
'campuses.read',
'schools.read',
'departments.read',
'programs.read',

-- Students

'students.read',
'students.approve',
'students.export',

-- Faculty

'faculty.read',
'faculty.approve',
'faculty.export',

-- Academics

'courses.read',
'curriculum.read',
'semesters.read',
'course_offerings.read',
'course_registrations.read',

'academic_records.read',
'academic_records.export',

-- Timetable

'timetables.read',
'timetable_entries.read',

-- Attendance

'attendance.read',
'attendance.export',

-- Assignments

'assignments.read',
'submissions.read',

'grades.read',
'grades.publish',

-- Examinations

'exams.read',
'exam_schedules.read',
'exam_registrations.read',
'exam_attempts.read',

-- Results

'results.read',
'results.publish',
'results.export',

'transcripts.read',
'transcripts.export',

-- Analytics

'analytics.read',
'dashboards.read',
'reports.read',

-- Audit

'audit.read',
'login_audit.read'


)
WHERE r.role_code = 'DIRECTOR'
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- DEAN
-- ==========================================

INSERT INTO role_permissions (
role_permission_id,
role_id,
permission_id
)
SELECT
gen_random_uuid(),
r.role_id,
p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'DEAN'
AND p.permission_code IN (


'schools.read',
'schools.update',

'departments.read',

'programs.read',
'programs.update',

'students.read',
'students.approve',

'faculty.read',
'faculty.approve',

'courses.read',

'curriculum.read',
'curriculum.update',

'semesters.read',

'course_offerings.read',

'academic_records.read',

'timetables.read',

'attendance.read',

'assignments.read',

'grades.read',

'exams.read',

'results.read',

'transcripts.read',

'analytics.read',
'dashboards.read',
'reports.read'


)
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- HOD
-- ==========================================

INSERT INTO role_permissions (
role_permission_id,
role_id,
permission_id
)
SELECT
gen_random_uuid(),
r.role_id,
p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'HOD'
AND p.permission_code IN (


'faculty.read',

'students.read',

'courses.read',
'courses.update',

'course_offerings.read',
'course_offerings.update',

'academic_records.read',

'timetables.read',
'timetables.update',

'timetable_entries.read',
'timetable_entries.update',

'attendance.read',
'attendance.update',

'assignments.read',
'assignments.update',

'submissions.read',

'grades.read',

'exams.read',

'results.read'


)
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- FACULTY
-- ==========================================

INSERT INTO role_permissions (
    role_permission_id,
    role_id,
    permission_id
)
SELECT
    gen_random_uuid(),
    r.role_id,
    p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'FACULTY'
AND p.permission_code IN (

    'students.read',

    'courses.read',

    'course_offerings.read',

    'academic_records.read',

    'timetables.read',

    'attendance.create',
    'attendance.read',
    'attendance.update',

    'assignments.create',
    'assignments.read',
    'assignments.update',
    'assignments.publish',

    'submissions.read',

    'grades.create',
    'grades.read',
    'grades.update',
    'grades.publish',

    'exam_attempts.read',

    'files.create',
    'files.read',
    'files.upload',
    'files.download'
)
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- CLASS_COORDINATOR
-- ==========================================

INSERT INTO role_permissions (
    role_permission_id,
    role_id,
    permission_id
)
SELECT
    gen_random_uuid(),
    r.role_id,
    p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'CLASS_COORDINATOR'
AND p.permission_code IN (

    'students.read',

    'student_status.read',

    'student_enrollments.read',
    'student_enrollments.update',

    'academic_records.read',

    'attendance.create',
    'attendance.read',
    'attendance.update',
    'attendance.export',

    'assignments.create',
    'assignments.read',
    'assignments.update',
    'assignments.publish',

    'submissions.read',

    'grades.create',
    'grades.read',
    'grades.update',
    'grades.publish',

    'results.read',

    'notifications.send',

    'timetables.read'
)
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- STUDENT
-- ==========================================

INSERT INTO role_permissions (
    role_permission_id,
    role_id,
    permission_id
)
SELECT
    gen_random_uuid(),
    r.role_id,
    p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'STUDENT'
AND p.permission_code IN (

    'academic_records.read',

    'course_registrations.create',
    'course_registrations.read',

    'attendance.read',

    'assignments.read',

    'submissions.create',
    'submissions.read',

    'grades.read',

    'results.read',

    'transcripts.read',

    'notifications.read',

    'files.read',
    'files.download',

    'timetables.read'
)
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- PARENT
-- ==========================================

INSERT INTO role_permissions (
    role_permission_id,
    role_id,
    permission_id
)
SELECT
    gen_random_uuid(),
    r.role_id,
    p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'PARENT'
AND p.permission_code IN (

    'parent_portal.access',

    'attendance.read',

    'academic_records.read',

    'results.read',

    'notifications.read'
)
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- ALUMNI
-- ==========================================

INSERT INTO role_permissions (
role_permission_id,
role_id,
permission_id
)
SELECT gen_random_uuid(), r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ALUMNI'
AND p.permission_code IN (


'alumni.read',
'alumni_directory.read',

'mentorship.read',

'recruitment.read',

'alumni_events.read',

'notifications.read',

'files.read',
'files.download'


)
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- MENTOR
-- ==========================================

INSERT INTO role_permissions (
role_permission_id,
role_id,
permission_id
)
SELECT gen_random_uuid(), r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'MENTOR'
AND p.permission_code IN (


'alumni.read',

'alumni_directory.read',

'mentorship.create',
'mentorship.read',
'mentorship.update',

'students.read',

'academic_records.read',

'notifications.read'


)
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- RECRUITER
-- ==========================================

INSERT INTO role_permissions (
role_permission_id,
role_id,
permission_id
)
SELECT gen_random_uuid(), r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'RECRUITER'
AND p.permission_code IN (


'alumni_directory.read',

'recruitment.create',
'recruitment.read',
'recruitment.update',

'students.read',

'notifications.send'


)
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- EXAM_CONTROLLER
-- ==========================================

INSERT INTO role_permissions (
role_permission_id,
role_id,
permission_id
)
SELECT gen_random_uuid(), r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'EXAM_CONTROLLER'
AND p.permission_code IN (


'exams.create',
'exams.read',
'exams.update',

'exam_schedules.create',
'exam_schedules.read',
'exam_schedules.update',

'exam_registrations.read',

'exam_attempts.read',
'exam_attempts.update',

'results.create',
'results.read',
'results.update',
'results.publish',

'transcripts.create',
'transcripts.read',
'transcripts.update',
'transcripts.publish',

'analytics.read'


)
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- LIBRARIAN
-- ==========================================

INSERT INTO role_permissions (
role_permission_id,
role_id,
permission_id
)
SELECT gen_random_uuid(), r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'LIBRARIAN'
AND p.permission_code IN (


'students.read',

'faculty.read',

'files.read',
'files.download',

'notifications.read'


)
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- ACCOUNTANT
-- ==========================================

INSERT INTO role_permissions (
role_permission_id,
role_id,
permission_id
)
SELECT gen_random_uuid(), r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'ACCOUNTANT'
AND p.permission_code IN (


'students.read',

'faculty.read',

'reports.read',

'analytics.read'


)
ON CONFLICT (role_id, permission_id)
DO NOTHING;

-- ==========================================
-- AUDITOR
-- ==========================================

INSERT INTO role_permissions (
role_permission_id,
role_id,
permission_id
)
SELECT gen_random_uuid(), r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_code = 'AUDITOR'
AND p.permission_code IN (


'audit.read',
'audit.export',

'login_audit.read',
'login_audit.export',

'analytics.read',

'reports.read',

'results.read',

'academic_records.read',

'roles.read',

'permissions.read'


)
ON CONFLICT (role_id, permission_id)
DO NOTHING;
