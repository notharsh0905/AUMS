-- ==========================================
-- USERS
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(
gen_random_uuid(),
'users.create',
'Create Users',
'Allows creation of user accounts.'
),

(
gen_random_uuid(),
'users.read',
'Read Users',
'Allows viewing user records.'
),

(
gen_random_uuid(),
'users.update',
'Update Users',
'Allows modification of user records.'
),

(
gen_random_uuid(),
'users.delete',
'Delete Users',
'Allows deletion of user records.'
),

(
gen_random_uuid(),
'users.manage',
'Manage Users',
'Allows full management of user accounts.'
),

(
gen_random_uuid(),
'user_sessions.read',
'Read User Sessions',
'Allows viewing active and historical user sessions.'
),

(
gen_random_uuid(),
'user_sessions.delete',
'Delete User Sessions',
'Allows terminating user sessions.'
)

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- INSTITUTIONS
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(
gen_random_uuid(),
'institutions.create',
'Create Institutions',
'Allows creation of institutions.'
),

(
gen_random_uuid(),
'institutions.read',
'Read Institutions',
'Allows viewing institution records.'
),

(
gen_random_uuid(),
'institutions.update',
'Update Institutions',
'Allows modification of institution records.'
),

(
gen_random_uuid(),
'institutions.delete',
'Delete Institutions',
'Allows deletion of institutions.'
),

(
gen_random_uuid(),
'institutions.manage',
'Manage Institutions',
'Allows full management of institutions.'
),

(
gen_random_uuid(),
'campuses.create',
'Create Campuses',
'Allows creation of campuses.'
),

(
gen_random_uuid(),
'campuses.read',
'Read Campuses',
'Allows viewing campus records.'
),

(
gen_random_uuid(),
'campuses.update',
'Update Campuses',
'Allows modification of campus records.'
),

(
gen_random_uuid(),
'campuses.delete',
'Delete Campuses',
'Allows deletion of campuses.'
),

(
gen_random_uuid(),
'schools.create',
'Create Schools',
'Allows creation of schools.'
),

(
gen_random_uuid(),
'schools.read',
'Read Schools',
'Allows viewing school records.'
),

(
gen_random_uuid(),
'schools.update',
'Update Schools',
'Allows modification of school records.'
),

(
gen_random_uuid(),
'schools.delete',
'Delete Schools',
'Allows deletion of schools.'
),

(
gen_random_uuid(),
'departments.create',
'Create Departments',
'Allows creation of departments.'
),

(
gen_random_uuid(),
'departments.read',
'Read Departments',
'Allows viewing department records.'
),

(
gen_random_uuid(),
'departments.update',
'Update Departments',
'Allows modification of department records.'
),

(
gen_random_uuid(),
'departments.delete',
'Delete Departments',
'Allows deletion of departments.'
),

(
gen_random_uuid(),
'programs.create',
'Create Programs',
'Allows creation of programs.'
),

(
gen_random_uuid(),
'programs.read',
'Read Programs',
'Allows viewing program records.'
),

(
gen_random_uuid(),
'programs.update',
'Update Programs',
'Allows modification of program records.'
),

(
gen_random_uuid(),
'programs.delete',
'Delete Programs',
'Allows deletion of programs.'
)

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- STUDENTS
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'students.create','Create Students','Allows creation of student records.'),
(gen_random_uuid(),'students.read','Read Students','Allows viewing student records.'),
(gen_random_uuid(),'students.update','Update Students','Allows modification of student records.'),
(gen_random_uuid(),'students.delete','Delete Students','Allows deletion of student records.'),

(gen_random_uuid(),'students.approve','Approve Students','Allows approval of student workflows.'),
(gen_random_uuid(),'students.export','Export Students','Allows exporting student data.'),

(gen_random_uuid(),'student_documents.create','Create Student Documents','Allows creation of student documents.'),
(gen_random_uuid(),'student_documents.read','Read Student Documents','Allows viewing student documents.'),
(gen_random_uuid(),'student_documents.update','Update Student Documents','Allows modification of student documents.'),
(gen_random_uuid(),'student_documents.delete','Delete Student Documents','Allows deletion of student documents.'),

(gen_random_uuid(),'student_enrollments.create','Create Student Enrollments','Allows creation of enrollments.'),
(gen_random_uuid(),'student_enrollments.read','Read Student Enrollments','Allows viewing enrollment records.'),
(gen_random_uuid(),'student_enrollments.update','Update Student Enrollments','Allows modification of enrollments.'),
(gen_random_uuid(),'student_enrollments.delete','Delete Student Enrollments','Allows deletion of enrollments.'),

(gen_random_uuid(),'student_status.read','Read Student Status','Allows viewing student status history.'),
(gen_random_uuid(),'student_status.manage','Manage Student Status','Allows management of student status records.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- FACULTY
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'faculty.create','Create Faculty','Allows creation of faculty records.'),
(gen_random_uuid(),'faculty.read','Read Faculty','Allows viewing faculty records.'),
(gen_random_uuid(),'faculty.update','Update Faculty','Allows modification of faculty records.'),
(gen_random_uuid(),'faculty.delete','Delete Faculty','Allows deletion of faculty records.'),

(gen_random_uuid(),'faculty.approve','Approve Faculty','Allows approval of faculty workflows.'),
(gen_random_uuid(),'faculty.export','Export Faculty','Allows exporting faculty data.'),

(gen_random_uuid(),'faculty_assignments.create','Create Faculty Assignments','Allows assignment of faculty responsibilities.'),
(gen_random_uuid(),'faculty_assignments.read','Read Faculty Assignments','Allows viewing faculty assignments.'),
(gen_random_uuid(),'faculty_assignments.update','Update Faculty Assignments','Allows modification of faculty assignments.'),
(gen_random_uuid(),'faculty_assignments.delete','Delete Faculty Assignments','Allows removal of faculty assignments.'),

(gen_random_uuid(),'faculty_qualifications.create','Create Faculty Qualifications','Allows creation of qualification records.'),
(gen_random_uuid(),'faculty_qualifications.read','Read Faculty Qualifications','Allows viewing qualification records.'),
(gen_random_uuid(),'faculty_qualifications.update','Update Faculty Qualifications','Allows modification of qualification records.'),
(gen_random_uuid(),'faculty_qualifications.delete','Delete Faculty Qualifications','Allows deletion of qualification records.'),

(gen_random_uuid(),'faculty_status.read','Read Faculty Status','Allows viewing faculty status history.'),
(gen_random_uuid(),'faculty_status.manage','Manage Faculty Status','Allows management of faculty status records.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- PARENTS
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'parents.create','Create Parents','Allows creation of parent records.'),
(gen_random_uuid(),'parents.read','Read Parents','Allows viewing parent records.'),
(gen_random_uuid(),'parents.update','Update Parents','Allows modification of parent records.'),
(gen_random_uuid(),'parents.delete','Delete Parents','Allows deletion of parent records.'),

(gen_random_uuid(),'parent_relationships.create','Create Parent Relationships','Allows linking parents and students.'),
(gen_random_uuid(),'parent_relationships.read','Read Parent Relationships','Allows viewing parent student relationships.'),
(gen_random_uuid(),'parent_relationships.update','Update Parent Relationships','Allows modification of parent student relationships.'),
(gen_random_uuid(),'parent_relationships.delete','Delete Parent Relationships','Allows deletion of parent student relationships.'),

(gen_random_uuid(),'parent_portal.access','Access Parent Portal','Allows access to the parent portal.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- ALUMNI
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'alumni.create','Create Alumni','Allows creation of alumni records.'),
(gen_random_uuid(),'alumni.read','Read Alumni','Allows viewing alumni records.'),
(gen_random_uuid(),'alumni.update','Update Alumni','Allows modification of alumni records.'),
(gen_random_uuid(),'alumni.delete','Delete Alumni','Allows deletion of alumni records.'),

(gen_random_uuid(),'alumni.verify','Verify Alumni','Allows verification of alumni accounts.'),

(gen_random_uuid(),'alumni_directory.read','Read Alumni Directory','Allows viewing alumni directory records.'),

(gen_random_uuid(),'mentorship.create','Create Mentorship','Allows creation of mentorship programs.'),
(gen_random_uuid(),'mentorship.read','Read Mentorship','Allows viewing mentorship programs.'),
(gen_random_uuid(),'mentorship.update','Update Mentorship','Allows modification of mentorship programs.'),
(gen_random_uuid(),'mentorship.delete','Delete Mentorship','Allows deletion of mentorship programs.'),

(gen_random_uuid(),'recruitment.create','Create Recruitment','Allows creation of recruitment opportunities.'),
(gen_random_uuid(),'recruitment.read','Read Recruitment','Allows viewing recruitment opportunities.'),
(gen_random_uuid(),'recruitment.update','Update Recruitment','Allows modification of recruitment opportunities.'),
(gen_random_uuid(),'recruitment.delete','Delete Recruitment','Allows deletion of recruitment opportunities.'),

(gen_random_uuid(),'alumni_events.create','Create Alumni Events','Allows creation of alumni events.'),
(gen_random_uuid(),'alumni_events.read','Read Alumni Events','Allows viewing alumni events.'),
(gen_random_uuid(),'alumni_events.update','Update Alumni Events','Allows modification of alumni events.'),
(gen_random_uuid(),'alumni_events.delete','Delete Alumni Events','Allows deletion of alumni events.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- ACADEMICS
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'courses.create','Create Courses','Allows creation of courses.'),
(gen_random_uuid(),'courses.read','Read Courses','Allows viewing course records.'),
(gen_random_uuid(),'courses.update','Update Courses','Allows modification of course records.'),
(gen_random_uuid(),'courses.delete','Delete Courses','Allows deletion of course records.'),

(gen_random_uuid(),'curriculum.create','Create Curriculum','Allows creation of curriculum structures.'),
(gen_random_uuid(),'curriculum.read','Read Curriculum','Allows viewing curriculum structures.'),
(gen_random_uuid(),'curriculum.update','Update Curriculum','Allows modification of curriculum structures.'),
(gen_random_uuid(),'curriculum.delete','Delete Curriculum','Allows deletion of curriculum structures.'),

(gen_random_uuid(),'semesters.create','Create Semesters','Allows creation of semesters.'),
(gen_random_uuid(),'semesters.read','Read Semesters','Allows viewing semester records.'),
(gen_random_uuid(),'semesters.update','Update Semesters','Allows modification of semester records.'),
(gen_random_uuid(),'semesters.delete','Delete Semesters','Allows deletion of semester records.'),

(gen_random_uuid(),'course_offerings.create','Create Course Offerings','Allows creation of course offerings.'),
(gen_random_uuid(),'course_offerings.read','Read Course Offerings','Allows viewing course offerings.'),
(gen_random_uuid(),'course_offerings.update','Update Course Offerings','Allows modification of course offerings.'),
(gen_random_uuid(),'course_offerings.delete','Delete Course Offerings','Allows deletion of course offerings.'),

(gen_random_uuid(),'course_registrations.create','Create Course Registrations','Allows registration of students into courses.'),
(gen_random_uuid(),'course_registrations.read','Read Course Registrations','Allows viewing course registrations.'),
(gen_random_uuid(),'course_registrations.update','Update Course Registrations','Allows modification of course registrations.'),
(gen_random_uuid(),'course_registrations.delete','Delete Course Registrations','Allows deletion of course registrations.'),

(gen_random_uuid(),'academic_records.read','Read Academic Records','Allows viewing academic records.'),
(gen_random_uuid(),'academic_records.export','Export Academic Records','Allows exporting academic records.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- TIMETABLE
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'timetables.create','Create Timetables','Allows creation of timetables.'),
(gen_random_uuid(),'timetables.read','Read Timetables','Allows viewing timetables.'),
(gen_random_uuid(),'timetables.update','Update Timetables','Allows modification of timetables.'),
(gen_random_uuid(),'timetables.delete','Delete Timetables','Allows deletion of timetables.'),

(gen_random_uuid(),'timetable_entries.create','Create Timetable Entries','Allows creation of timetable entries.'),
(gen_random_uuid(),'timetable_entries.read','Read Timetable Entries','Allows viewing timetable entries.'),
(gen_random_uuid(),'timetable_entries.update','Update Timetable Entries','Allows modification of timetable entries.'),
(gen_random_uuid(),'timetable_entries.delete','Delete Timetable Entries','Allows deletion of timetable entries.'),

(gen_random_uuid(),'timetable.publish','Publish Timetables','Allows publishing timetables.'),

(gen_random_uuid(),'rooms.create','Create Rooms','Allows creation of room records.'),
(gen_random_uuid(),'rooms.read','Read Rooms','Allows viewing room records.'),
(gen_random_uuid(),'rooms.update','Update Rooms','Allows modification of room records.'),
(gen_random_uuid(),'rooms.delete','Delete Rooms','Allows deletion of room records.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- ATTENDANCE
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'attendance.create','Create Attendance','Allows attendance recording.'),
(gen_random_uuid(),'attendance.read','Read Attendance','Allows viewing attendance records.'),
(gen_random_uuid(),'attendance.update','Update Attendance','Allows modification of attendance records.'),
(gen_random_uuid(),'attendance.delete','Delete Attendance','Allows deletion of attendance records.'),

(gen_random_uuid(),'attendance.approve','Approve Attendance','Allows approval of attendance records.'),
(gen_random_uuid(),'attendance.export','Export Attendance','Allows exporting attendance data.'),

(gen_random_uuid(),'attendance_exceptions.create','Create Attendance Exceptions','Allows creation of attendance exceptions.'),
(gen_random_uuid(),'attendance_exceptions.read','Read Attendance Exceptions','Allows viewing attendance exceptions.'),
(gen_random_uuid(),'attendance_exceptions.update','Update Attendance Exceptions','Allows modification of attendance exceptions.'),
(gen_random_uuid(),'attendance_exceptions.delete','Delete Attendance Exceptions','Allows deletion of attendance exceptions.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- ASSIGNMENTS
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'assignments.create','Create Assignments','Allows creation of assignments.'),
(gen_random_uuid(),'assignments.read','Read Assignments','Allows viewing assignments.'),
(gen_random_uuid(),'assignments.update','Update Assignments','Allows modification of assignments.'),
(gen_random_uuid(),'assignments.delete','Delete Assignments','Allows deletion of assignments.'),

(gen_random_uuid(),'assignments.publish','Publish Assignments','Allows publishing assignments to students.'),

(gen_random_uuid(),'submissions.create', 'Create Submissions', 'Allows creation of assignment submissions.'),
(gen_random_uuid(),'submissions.read','Read Submissions','Allows viewing assignment submissions.'),
(gen_random_uuid(),'submissions.update','Update Submissions','Allows modification of assignment submissions.'),

(gen_random_uuid(),'grades.create','Create Grades','Allows creation of grades.'),
(gen_random_uuid(),'grades.read','Read Grades','Allows viewing grades.'),
(gen_random_uuid(),'grades.update','Update Grades','Allows modification of grades.'),

(gen_random_uuid(),'grades.publish','Publish Grades','Allows publishing grades.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- EXAMINATIONS
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'exams.create','Create Exams','Allows creation of examinations.'),
(gen_random_uuid(),'exams.read','Read Exams','Allows viewing examination records.'),
(gen_random_uuid(),'exams.update','Update Exams','Allows modification of examinations.'),
(gen_random_uuid(),'exams.delete','Delete Exams','Allows deletion of examinations.'),

(gen_random_uuid(),'exam_schedules.create','Create Exam Schedules','Allows creation of exam schedules.'),
(gen_random_uuid(),'exam_schedules.read','Read Exam Schedules','Allows viewing exam schedules.'),
(gen_random_uuid(),'exam_schedules.update','Update Exam Schedules','Allows modification of exam schedules.'),
(gen_random_uuid(),'exam_schedules.delete','Delete Exam Schedules','Allows deletion of exam schedules.'),

(gen_random_uuid(),'exam_registrations.create','Create Exam Registrations','Allows creation of exam registrations.'),
(gen_random_uuid(),'exam_registrations.read','Read Exam Registrations','Allows viewing exam registrations.'),
(gen_random_uuid(),'exam_registrations.update','Update Exam Registrations','Allows modification of exam registrations.'),
(gen_random_uuid(),'exam_registrations.delete','Delete Exam Registrations','Allows deletion of exam registrations.'),

(gen_random_uuid(),'exam_attempts.read','Read Exam Attempts','Allows viewing examination attempts.'),
(gen_random_uuid(),'exam_attempts.update','Update Exam Attempts','Allows modification of examination attempts.'),

(gen_random_uuid(),'exams.publish','Publish Exams','Allows publishing examination schedules and information.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- RESULTS
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'results.create','Create Results','Allows creation of result records.'),
(gen_random_uuid(),'results.read','Read Results','Allows viewing result records.'),
(gen_random_uuid(),'results.update','Update Results','Allows modification of result records.'),
(gen_random_uuid(),'results.delete','Delete Results','Allows deletion of result records.'),

(gen_random_uuid(),'results.publish','Publish Results','Allows publishing results to students.'),
(gen_random_uuid(),'results.export','Export Results','Allows exporting result data.'),

(gen_random_uuid(),'transcripts.create','Create Transcripts','Allows generation of transcripts.'),
(gen_random_uuid(),'transcripts.read','Read Transcripts','Allows viewing transcripts.'),
(gen_random_uuid(),'transcripts.update','Update Transcripts','Allows modification of transcripts.'),
(gen_random_uuid(),'transcripts.publish','Publish Transcripts','Allows publishing transcripts.'),
(gen_random_uuid(),'transcripts.export','Export Transcripts','Allows exporting transcript documents.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- NOTIFICATIONS
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'notifications.create','Create Notifications','Allows creation of notifications.'),
(gen_random_uuid(),'notifications.read','Read Notifications','Allows viewing notifications.'),
(gen_random_uuid(),'notifications.update','Update Notifications','Allows modification of notifications.'),
(gen_random_uuid(),'notifications.delete','Delete Notifications','Allows deletion of notifications.'),

(gen_random_uuid(),'notifications.send','Send Notifications','Allows sending notifications through configured channels.'),

(gen_random_uuid(),'notification_events.create','Create Notification Events','Allows creation of notification events.'),
(gen_random_uuid(),'notification_events.read','Read Notification Events','Allows viewing notification events.'),
(gen_random_uuid(),'notification_events.update','Update Notification Events','Allows modification of notification events.'),
(gen_random_uuid(),'notification_events.delete','Delete Notification Events','Allows deletion of notification events.'),

(gen_random_uuid(),'notification_templates.create','Create Notification Templates','Allows creation of notification templates.'),
(gen_random_uuid(),'notification_templates.read','Read Notification Templates','Allows viewing notification templates.'),
(gen_random_uuid(),'notification_templates.update','Update Notification Templates','Allows modification of notification templates.'),
(gen_random_uuid(),'notification_templates.delete','Delete Notification Templates','Allows deletion of notification templates.'),

(gen_random_uuid(),'notification_preferences.read','Read Notification Preferences','Allows viewing notification preferences.'),
(gen_random_uuid(),'notification_preferences.update','Update Notification Preferences','Allows modification of notification preferences.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- FILE STORAGE
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'files.create','Create Files','Allows creation of file records.'),
(gen_random_uuid(),'files.read','Read Files','Allows viewing file metadata and records.'),
(gen_random_uuid(),'files.update','Update Files','Allows modification of file metadata.'),
(gen_random_uuid(),'files.delete','Delete Files','Allows deletion of files.'),

(gen_random_uuid(),'files.upload','Upload Files','Allows uploading files into storage.'),
(gen_random_uuid(),'files.download','Download Files','Allows downloading files from storage.'),

(gen_random_uuid(),'storage.manage','Manage Storage','Allows management of storage buckets and storage configuration.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- ANALYTICS
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'analytics.read','Read Analytics','Allows viewing analytics data.'),
(gen_random_uuid(),'analytics.export','Export Analytics','Allows exporting analytics data.'),

(gen_random_uuid(),'dashboards.read','Read Dashboards','Allows viewing dashboards.'),
(gen_random_uuid(),'dashboards.manage','Manage Dashboards','Allows management of dashboards.'),

(gen_random_uuid(),'reports.read','Read Reports','Allows viewing reports.'),
(gen_random_uuid(),'reports.export','Export Reports','Allows exporting reports.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- AUDIT
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(gen_random_uuid(),'audit.read','Read Audit Logs','Allows viewing audit logs.'),
(gen_random_uuid(),'audit.export','Export Audit Logs','Allows exporting audit logs.'),
(gen_random_uuid(),'audit.manage','Manage Audit','Allows management of audit retention and audit operations.'),

(gen_random_uuid(),'login_audit.read','Read Login Audit Logs','Allows viewing login audit records.'),
(gen_random_uuid(),'login_audit.export','Export Login Audit Logs','Allows exporting login audit records.')

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- PLATFORM SETTINGS
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(
gen_random_uuid(),
'platform_settings.read',
'Read Platform Settings',
'Allows viewing global platform settings.'
),

(
gen_random_uuid(),
'platform_settings.update',
'Update Platform Settings',
'Allows modification of global platform settings.'
),

(
gen_random_uuid(),
'feature_flags.read',
'Read Feature Flags',
'Allows viewing platform feature flags.'
),

(
gen_random_uuid(),
'feature_flags.update',
'Update Feature Flags',
'Allows modification of platform feature flags.'
),

(
gen_random_uuid(),
'feature_flags.manage',
'Manage Feature Flags',
'Allows full management of platform feature flags.'
)

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- ROLES
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(
gen_random_uuid(),
'roles.create',
'Create Roles',
'Allows creation of roles.'
),

(
gen_random_uuid(),
'roles.read',
'Read Roles',
'Allows viewing role records.'
),

(
gen_random_uuid(),
'roles.update',
'Update Roles',
'Allows modification of roles.'
),

(
gen_random_uuid(),
'roles.delete',
'Delete Roles',
'Allows deletion of roles.'
),

(
gen_random_uuid(),
'roles.assign',
'Assign Roles',
'Allows assigning roles to users.'
),

(
gen_random_uuid(),
'roles.manage',
'Manage Roles',
'Allows full role management.'
)

ON CONFLICT (permission_code) DO NOTHING;

-- ==========================================
-- PERMISSIONS
-- ==========================================

INSERT INTO permissions (
permission_id,
permission_code,
permission_name,
description
)
VALUES

(
gen_random_uuid(),
'permissions.create',
'Create Permissions',
'Allows creation of permissions.'
),

(
gen_random_uuid(),
'permissions.read',
'Read Permissions',
'Allows viewing permission records.'
),

(
gen_random_uuid(),
'permissions.update',
'Update Permissions',
'Allows modification of permissions.'
),

(
gen_random_uuid(),
'permissions.delete',
'Delete Permissions',
'Allows deletion of permissions.'
),

(
gen_random_uuid(),
'permissions.assign',
'Assign Permissions',
'Allows assigning permissions to roles.'
),

(
gen_random_uuid(),
'permissions.manage',
'Manage Permissions',
'Allows full permission management.'
)

ON CONFLICT (permission_code) DO NOTHING;
