-- ==========================================
-- NOTIFICATION EVENTS
-- ==========================================

INSERT INTO notification_events (
notification_event_id,
event_code,
event_name,
description
)
VALUES

(
gen_random_uuid(),
'STUDENT_REGISTERED',
'Student Registered',
'Triggered when a new student is registered.'
),

(
gen_random_uuid(),
'STUDENT_APPROVED',
'Student Approved',
'Triggered when a student record is approved.'
),

(
gen_random_uuid(),
'FACULTY_REGISTERED',
'Faculty Registered',
'Triggered when a new faculty member is registered.'
),

(
gen_random_uuid(),
'FACULTY_APPROVED',
'Faculty Approved',
'Triggered when a faculty profile is approved.'
),

(
gen_random_uuid(),
'ATTENDANCE_MARKED',
'Attendance Marked',
'Triggered when attendance is recorded.'
),

(
gen_random_uuid(),
'ATTENDANCE_SHORTAGE',
'Attendance Shortage',
'Triggered when attendance falls below the required threshold.'
),

(
gen_random_uuid(),
'ASSIGNMENT_PUBLISHED',
'Assignment Published',
'Triggered when an assignment is published.'
),

(
gen_random_uuid(),
'ASSIGNMENT_SUBMITTED',
'Assignment Submitted',
'Triggered when a student submits an assignment.'
),

(
gen_random_uuid(),
'GRADE_PUBLISHED',
'Grade Published',
'Triggered when grades are published.'
),

(
gen_random_uuid(),
'EXAM_SCHEDULED',
'Exam Scheduled',
'Triggered when an examination schedule is published.'
),

(
gen_random_uuid(),
'RESULT_PUBLISHED',
'Result Published',
'Triggered when examination results are published.'
),

(
gen_random_uuid(),
'TRANSCRIPT_GENERATED',
'Transcript Generated',
'Triggered when a transcript is generated.'
),

(
gen_random_uuid(),
'FILE_UPLOADED',
'File Uploaded',
'Triggered when a file is uploaded.'
),

(
gen_random_uuid(),
'ALUMNI_VERIFIED',
'Alumni Verified',
'Triggered when an alumni profile is verified.'
),

(
gen_random_uuid(),
'MENTORSHIP_CREATED',
'Mentorship Created',
'Triggered when a mentorship relationship is created.'
),

(
gen_random_uuid(),
'RECRUITMENT_POSTED',
'Recruitment Posted',
'Triggered when a recruitment opportunity is published.'
),

(
gen_random_uuid(),
'SYSTEM_ANNOUNCEMENT',
'System Announcement',
'Triggered when a platform-wide announcement is issued.'
)

ON CONFLICT (event_code)
DO NOTHING;
