-- ==========================================
-- AUMS DEMO PROFILES SEED (STUDENTS & FACULTY)
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
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    (SELECT program_id FROM programs WHERE program_code = 'BTECH_CSE'),
    'CS2026001',
    CURRENT_DATE - INTERVAL '1 year',
    'ACTIVE'::student_status
),
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000002',
    (SELECT program_id FROM programs WHERE program_code = 'BTECH_CSE'),
    'CS2026002',
    CURRENT_DATE - INTERVAL '1 year',
    'ACTIVE'::student_status
),
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000003',
    (SELECT program_id FROM programs WHERE program_code = 'BTECH_CSE'),
    'CS2026003',
    CURRENT_DATE - INTERVAL '1 year',
    'ACTIVE'::student_status
)
ON CONFLICT (enrollment_number) DO NOTHING;
