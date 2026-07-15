-- ==========================================
-- AUMS DEMO PROGRAMS SEED
-- ==========================================

INSERT INTO programs (
    program_id,
    department_id,
    program_code,
    program_name,
    degree_type,
    duration_value,
    duration_unit,
    total_semesters
)
VALUES
(
    gen_random_uuid(),
    (SELECT department_id FROM departments WHERE department_code = 'CSE'),
    'BTECH_CSE',
    'Bachelor of Technology in Computer Science & Engineering',
    'UNDERGRADUATE'::degree_type,
    4,
    'years',
    8
),
(
    gen_random_uuid(),
    (SELECT department_id FROM departments WHERE department_code = 'ECE'),
    'BTECH_ECE',
    'Bachelor of Technology in Electronics & Communication Engineering',
    'UNDERGRADUATE'::degree_type,
    4,
    'years',
    8
),
(
    gen_random_uuid(),
    (SELECT department_id FROM departments WHERE department_code = 'ME'),
    'BTECH_ME',
    'Bachelor of Technology in Mechanical Engineering',
    'UNDERGRADUATE'::degree_type,
    4,
    'years',
    8
),
(
    gen_random_uuid(),
    (SELECT department_id FROM departments WHERE department_code = 'CE'),
    'BTECH_CE',
    'Bachelor of Technology in Civil Engineering',
    'UNDERGRADUATE'::degree_type,
    4,
    'years',
    8
),
(
    gen_random_uuid(),
    (SELECT department_id FROM departments WHERE department_code = 'PHY'),
    'BSC_PHY',
    'Bachelor of Science in Physics',
    'UNDERGRADUATE'::degree_type,
    3,
    'years',
    6
),
(
    gen_random_uuid(),
    (SELECT department_id FROM departments WHERE department_code = 'MAT'),
    'BSC_MAT',
    'Bachelor of Science in Mathematics',
    'UNDERGRADUATE'::degree_type,
    3,
    'years',
    6
)
ON CONFLICT (program_code)
DO NOTHING;
