-- ==========================================
-- AUMS DEMO DEPARTMENTS SEED
-- ==========================================

-- 1. Seed Academic Schools first to satisfy referential integrity
INSERT INTO schools (
    school_id,
    school_code,
    school_name,
    description
)
VALUES 
(
    gen_random_uuid(),
    'SOE',
    'School of Engineering',
    'School of Engineering and Applied Sciences'
),
(
    gen_random_uuid(),
    'SOS',
    'School of Sciences',
    'School of Pure and Applied Sciences'
)
ON CONFLICT (school_code)
DO NOTHING;

-- 2. Seed Departments referencing Schools
INSERT INTO departments (
    department_id,
    school_id,
    department_code,
    department_name,
    description
)
VALUES
(
    gen_random_uuid(),
    (SELECT school_id FROM schools WHERE school_code = 'SOE'),
    'CSE',
    'Computer Science & Engineering',
    'Department of Computer Science and Engineering'
),
(
    gen_random_uuid(),
    (SELECT school_id FROM schools WHERE school_code = 'SOE'),
    'ECE',
    'Electronics & Communication Engineering',
    'Department of Electronics and Communication Engineering'
),
(
    gen_random_uuid(),
    (SELECT school_id FROM schools WHERE school_code = 'SOE'),
    'ME',
    'Mechanical Engineering',
    'Department of Mechanical Engineering'
),
(
    gen_random_uuid(),
    (SELECT school_id FROM schools WHERE school_code = 'SOE'),
    'CE',
    'Civil Engineering',
    'Department of Civil Engineering'
),
(
    gen_random_uuid(),
    (SELECT school_id FROM schools WHERE school_code = 'SOS'),
    'PHY',
    'Physics',
    'Department of Physics'
),
(
    gen_random_uuid(),
    (SELECT school_id FROM schools WHERE school_code = 'SOS'),
    'MAT',
    'Mathematics',
    'Department of Mathematics'
)
ON CONFLICT (department_code)
DO NOTHING;
