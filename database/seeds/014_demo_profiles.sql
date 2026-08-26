-- ==========================================
-- AUMS DEMO PROFILES SEED (STUDENTS, FACULTY & PARENTS)
-- ==========================================

-- Seed Faculty Profiles
INSERT INTO faculty_profiles (
    faculty_profile_id,
    user_id,
    employee_code,
    department_id,
    designation,
    employment_type,
    joining_date,
    status,
    years_of_experience,
    office_location
)
VALUES
(
    gen_random_uuid(),
    (SELECT user_id FROM users WHERE email = 'faculty.cse1@aums.edu'),
    'FAC001',
    (SELECT department_id FROM departments WHERE department_code = 'CSE'),
    'ASSISTANT_PROFESSOR'::faculty_designation,
    'FULL_TIME'::employment_type,
    CURRENT_DATE - INTERVAL '2 years',
    'ACTIVE'::faculty_status,
    5,
    'Block A, Room 302'
),
(
    gen_random_uuid(),
    (SELECT user_id FROM users WHERE email = 'faculty.cse2@aums.edu'),
    'FAC002',
    (SELECT department_id FROM departments WHERE department_code = 'CSE'),
    'ASSOCIATE_PROFESSOR'::faculty_designation,
    'FULL_TIME'::employment_type,
    CURRENT_DATE - INTERVAL '4 years',
    'ACTIVE'::faculty_status,
    10,
    'Block A, Room 304'
)
ON CONFLICT (user_id) DO NOTHING;

-- Seed Student Profiles
INSERT INTO student_profiles (
    student_profile_id,
    user_id,
    admission_date,
    date_of_birth,
    gender,
    blood_group,
    nationality,
    category,
    religion
)
VALUES
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT user_id FROM users WHERE email = 'student1@aums.edu'),
    CURRENT_DATE - INTERVAL '1 year',
    '2005-05-15',
    'MALE',
    'O+',
    'Indian',
    'General',
    'None'
),
(
    '00000000-0000-0000-0000-000000000002',
    (SELECT user_id FROM users WHERE email = 'student2@aums.edu'),
    CURRENT_DATE - INTERVAL '1 year',
    '2005-08-20',
    'FEMALE',
    'A+',
    'Indian',
    'General',
    'None'
),
(
    '00000000-0000-0000-0000-000000000003',
    (SELECT user_id FROM users WHERE email = 'student3@aums.edu'),
    CURRENT_DATE - INTERVAL '1 year',
    '2005-12-10',
    'MALE',
    'B+',
    'Indian',
    'General',
    'None'
)
ON CONFLICT (user_id) DO NOTHING;

-- Seed Student Enrollments
INSERT INTO student_enrollments (
    enrollment_id,
    student_profile_id,
    program_id,
    enrollment_number,
    enrollment_date,
    status
)
VALUES
(
    '00000000-0000-0000-0000-000000000051',
    '00000000-0000-0000-0000-000000000001',
    (SELECT program_id FROM programs WHERE program_code = 'BTECH_CSE'),
    'CS2026001',
    CURRENT_DATE - INTERVAL '1 year',
    'ACTIVE'::student_status
),
(
    '00000000-0000-0000-0000-000000000052',
    '00000000-0000-0000-0000-000000000002',
    (SELECT program_id FROM programs WHERE program_code = 'BTECH_CSE'),
    'CS2026002',
    CURRENT_DATE - INTERVAL '1 year',
    'ACTIVE'::student_status
),
(
    '00000000-0000-0000-0000-000000000053',
    '00000000-0000-0000-0000-000000000003',
    (SELECT program_id FROM programs WHERE program_code = 'BTECH_CSE'),
    'CS2026003',
    CURRENT_DATE - INTERVAL '1 year',
    'ACTIVE'::student_status
)
ON CONFLICT (enrollment_number) DO NOTHING;

-- Seed Parent Profiles
INSERT INTO parent_profiles (
    parent_profile_id,
    user_id,
    occupation,
    annual_income,
    employer_name,
    office_address
)
VALUES
(
    '00000000-0000-0000-0000-000000000011',
    (SELECT user_id FROM users WHERE email = 'parent1@aums.edu'),
    'Senior Software Architect',
    150000.00,
    'Tech Global Corp',
    'Silicon Avenue, Tech City'
),
(
    '00000000-0000-0000-0000-000000000012',
    (SELECT user_id FROM users WHERE email = 'parent2@aums.edu'),
    'Operations Director',
    120000.00,
    'Logistics Int',
    'Central Boulevard, City Center'
)
ON CONFLICT (user_id) DO NOTHING;

-- Seed Student Parent Relationships
INSERT INTO student_parent_relationships (
    student_parent_relationship_id,
    student_profile_id,
    parent_profile_id,
    relationship_type,
    is_primary_contact,
    is_emergency_contact,
    can_receive_notifications,
    can_view_attendance,
    can_view_results,
    can_approve_leave
)
VALUES
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000011',
    'FATHER'::parent_relationship_type,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE
),
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000011',
    'FATHER'::parent_relationship_type,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE
),
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000012',
    'MOTHER'::parent_relationship_type,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE
)
ON CONFLICT (student_profile_id, parent_profile_id) DO NOTHING;

-- Seed Demo Courses
INSERT INTO courses (
    course_id,
    course_code,
    course_name,
    course_type,
    credits,
    contact_hours,
    description
)
VALUES
(
    '00000000-0000-0000-0000-000000000101',
    'CS201',
    'Data Structures and Algorithms',
    'THEORY'::course_type,
    4.00,
    60,
    'Core algorithms and abstract data structures'
),
(
    '00000000-0000-0000-0000-000000000102',
    'CS202',
    'Database Management Systems',
    'THEORY'::course_type,
    4.00,
    60,
    'Relational database architecture and query optimization'
)
ON CONFLICT (course_code) DO NOTHING;

-- Seed Semesters
INSERT INTO semesters (
    semester_id,
    academic_year_id,
    semester_name,
    semester_number,
    start_date,
    end_date,
    is_active
)
VALUES
(
    '00000000-0000-0000-0000-000000000301',
    (SELECT academic_year_id FROM academic_years WHERE academic_year_name = '2026-2027'),
    'Fall 2026',
    1,
    '2026-07-01',
    '2026-12-31',
    TRUE
)
ON CONFLICT DO NOTHING;

-- Seed Course Offerings
INSERT INTO course_offerings (
    course_offering_id,
    course_id,
    academic_year_id,
    semester_id,
    section,
    max_capacity,
    status
)
VALUES
(
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000101',
    (SELECT academic_year_id FROM academic_years WHERE academic_year_name = '2026-2027'),
    '00000000-0000-0000-0000-000000000301',
    'A',
    60,
    'ACTIVE'::offering_status
),
(
    '00000000-0000-0000-0000-000000000402',
    '00000000-0000-0000-0000-000000000102',
    (SELECT academic_year_id FROM academic_years WHERE academic_year_name = '2026-2027'),
    '00000000-0000-0000-0000-000000000301',
    'A',
    60,
    'ACTIVE'::offering_status
)
ON CONFLICT DO NOTHING;

-- Seed Student Course Registrations
INSERT INTO student_course_registrations (
    student_course_registration_id,
    enrollment_id,
    course_offering_id,
    registration_status,
    registered_at
)
VALUES
(
    gen_random_uuid(),
    (SELECT enrollment_id FROM student_enrollments WHERE enrollment_number = 'CS2026001'),
    '00000000-0000-0000-0000-000000000401',
    'REGISTERED'::registration_status,
    CURRENT_DATE - INTERVAL '6 months'
),
(
    gen_random_uuid(),
    (SELECT enrollment_id FROM student_enrollments WHERE enrollment_number = 'CS2026001'),
    '00000000-0000-0000-0000-000000000402',
    'REGISTERED'::registration_status,
    CURRENT_DATE - INTERVAL '6 months'
)
ON CONFLICT DO NOTHING;

-- Seed Buildings & Rooms
INSERT INTO buildings (
    building_id,
    campus_id,
    building_code,
    building_name
)
VALUES
(
    '00000000-0000-0000-0000-000000000701',
    (SELECT campus_id FROM campuses LIMIT 1),
    'BLKA',
    'Academic Block A'
)
ON CONFLICT DO NOTHING;

INSERT INTO rooms (
    room_id,
    building_id,
    room_code,
    room_name,
    floor_number,
    capacity,
    room_type
)
VALUES
(
    '00000000-0000-0000-0000-000000000801',
    '00000000-0000-0000-0000-000000000701',
    'R101',
    'Lecture Hall 101',
    1,
    60,
    'CLASSROOM'
),
(
    '00000000-0000-0000-0000-000000000802',
    '00000000-0000-0000-0000-000000000701',
    'LAB201',
    'Advanced Computing Lab',
    2,
    45,
    'LABORATORY'
)
ON CONFLICT DO NOTHING;

-- Seed Working Days
INSERT INTO working_days (
    working_day_id,
    day_name,
    is_working_day
)
VALUES
('00000000-0000-0000-0000-000000000901', 'MONDAY'::day_of_week, TRUE),
('00000000-0000-0000-0000-000000000902', 'TUESDAY'::day_of_week, TRUE),
('00000000-0000-0000-0000-000000000903', 'WEDNESDAY'::day_of_week, TRUE),
('00000000-0000-0000-0000-000000000904', 'THURSDAY'::day_of_week, TRUE),
('00000000-0000-0000-0000-000000000905', 'FRIDAY'::day_of_week, TRUE)
ON CONFLICT (day_name) DO NOTHING;

-- Seed Time Slots
INSERT INTO time_slots (
    time_slot_id,
    slot_name,
    start_time,
    end_time
)
VALUES
('00000000-0000-0000-0000-000000000951', 'Morning Slot 1', '09:00:00', '10:00:00'),
('00000000-0000-0000-0000-000000000952', 'Morning Slot 2', '10:15:00', '11:15:00'),
('00000000-0000-0000-0000-000000000953', 'Afternoon Lab Slot', '14:00:00', '16:00:00')
ON CONFLICT (start_time, end_time) DO NOTHING;

-- Seed Master Timetable
INSERT INTO timetables (
    timetable_id,
    timetable_name,
    academic_year_id,
    semester_id,
    effective_from,
    effective_to,
    is_active
)
VALUES
(
    '00000000-0000-0000-0000-000000000981',
    'CSE Fall 2026 Master Schedule',
    (SELECT academic_year_id FROM academic_years WHERE academic_year_name = '2026-2027'),
    '00000000-0000-0000-0000-000000000301',
    '2026-07-01',
    '2026-12-31',
    TRUE
)
ON CONFLICT DO NOTHING;

-- Seed Timetable Entries
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
VALUES
(
    '00000000-0000-0000-0000-000000000991',
    '00000000-0000-0000-0000-000000000981',
    '00000000-0000-0000-0000-000000000401',
    (SELECT faculty_profile_id FROM faculty_profiles WHERE employee_code = 'FAC001'),
    '00000000-0000-0000-0000-000000000801',
    '00000000-0000-0000-0000-000000000901',
    '00000000-0000-0000-0000-000000000951',
    'LECTURE'::timetable_entry_type
),
(
    '00000000-0000-0000-0000-000000000992',
    '00000000-0000-0000-0000-000000000981',
    '00000000-0000-0000-0000-000000000402',
    (SELECT faculty_profile_id FROM faculty_profiles WHERE employee_code = 'FAC001'),
    '00000000-0000-0000-0000-000000000802',
    '00000000-0000-0000-0000-000000000903',
    '00000000-0000-0000-0000-000000000953',
    'LAB'::timetable_entry_type
)
ON CONFLICT DO NOTHING;

-- Seed Demo Assignments
INSERT INTO assignments (
    assignment_id,
    course_offering_id,
    faculty_profile_id,
    title,
    description,
    total_marks,
    publish_at,
    due_at,
    assignment_status
)
VALUES
(
    '00000000-0000-0000-0000-000000000501',
    '00000000-0000-0000-0000-000000000401',
    (SELECT faculty_profile_id FROM faculty_profiles WHERE employee_code = 'FAC001'),
    'Binary Search Trees Implementation',
    'Implement a balanced AVL tree and measure search operations',
    100.00,
    NOW() - INTERVAL '7 days',
    NOW() + INTERVAL '7 days',
    'PUBLISHED'::assignment_status
)
ON CONFLICT (assignment_id) DO NOTHING;

-- Seed Demo Submissions
INSERT INTO assignment_submissions (
    assignment_submission_id,
    assignment_id,
    enrollment_id,
    submission_status,
    submitted_at,
    remarks
)
VALUES
(
    '00000000-0000-0000-0000-000000000601',
    '00000000-0000-0000-0000-000000000501',
    (SELECT enrollment_id FROM student_enrollments WHERE enrollment_number = 'CS2026001'),
    'SUBMITTED'::submission_status,
    NOW() - INTERVAL '1 day',
    'Implemented AVL balance rotation with unit benchmarks'
)
ON CONFLICT (assignment_id, enrollment_id) DO NOTHING;

-- Seed Demo Class Sessions
INSERT INTO class_sessions (
    class_session_id,
    timetable_entry_id,
    session_date,
    start_time,
    end_time,
    session_status,
    conducted_by,
    remarks
)
VALUES
(
    '00000000-0000-0000-0000-000000000851',
    '00000000-0000-0000-0000-000000000991',
    CURRENT_DATE - INTERVAL '1 day',
    '09:00:00',
    '10:00:00',
    'COMPLETED'::session_status,
    (SELECT faculty_profile_id FROM faculty_profiles WHERE employee_code = 'FAC001'),
    'Trees and graphs intro lecture'
)
ON CONFLICT (timetable_entry_id, session_date) DO NOTHING;

-- Seed Demo Attendance Records
INSERT INTO attendance_records (
    attendance_record_id,
    class_session_id,
    enrollment_id,
    attendance_status,
    marked_by,
    remarks
)
VALUES
(
    '00000000-0000-0000-0000-000000000861',
    '00000000-0000-0000-0000-000000000851',
    (SELECT enrollment_id FROM student_enrollments WHERE enrollment_number = 'CS2026001'),
    'PRESENT'::attendance_status,
    (SELECT faculty_profile_id FROM faculty_profiles WHERE employee_code = 'FAC001'),
    'Attended and participated actively'
)
ON CONFLICT (class_session_id, enrollment_id) DO NOTHING;
