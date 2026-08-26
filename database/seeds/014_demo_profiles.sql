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
