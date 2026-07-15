-- ==========================================
-- AUMS USER ROLES SEED
-- ==========================================

INSERT INTO user_roles (user_role_id, user_id, role_id)
VALUES
(
    gen_random_uuid(),
    (SELECT user_id FROM users WHERE email = 'admin@aums.com'),
    (SELECT role_id FROM roles WHERE role_code = 'SUPER_ADMIN')
),
(
    gen_random_uuid(),
    (SELECT user_id FROM users WHERE email = 'institution.admin@aums.edu'),
    (SELECT role_id FROM roles WHERE role_code = 'INSTITUTION_ADMIN')
),
(
    gen_random_uuid(),
    (SELECT user_id FROM users WHERE email = 'dean.engineering@aums.edu'),
    (SELECT role_id FROM roles WHERE role_code = 'DEAN')
),
(
    gen_random_uuid(),
    (SELECT user_id FROM users WHERE email = 'hod.cse@aums.edu'),
    (SELECT role_id FROM roles WHERE role_code = 'HOD')
),
(
    gen_random_uuid(),
    (SELECT user_id FROM users WHERE email = 'faculty.cse1@aums.edu'),
    (SELECT role_id FROM roles WHERE role_code = 'FACULTY')
),
(
    gen_random_uuid(),
    (SELECT user_id FROM users WHERE email = 'faculty.cse2@aums.edu'),
    (SELECT role_id FROM roles WHERE role_code = 'FACULTY')
),
(
    gen_random_uuid(),
    (SELECT user_id FROM users WHERE email = 'student1@aums.edu'),
    (SELECT role_id FROM roles WHERE role_code = 'STUDENT')
),
(
    gen_random_uuid(),
    (SELECT user_id FROM users WHERE email = 'student2@aums.edu'),
    (SELECT role_id FROM roles WHERE role_code = 'STUDENT')
),
(
    gen_random_uuid(),
    (SELECT user_id FROM users WHERE email = 'student3@aums.edu'),
    (SELECT role_id FROM roles WHERE role_code = 'STUDENT')
),
(
    gen_random_uuid(),
    (SELECT user_id FROM users WHERE email = 'parent1@aums.edu'),
    (SELECT role_id FROM roles WHERE role_code = 'PARENT')
),
(
    gen_random_uuid(),
    (SELECT user_id FROM users WHERE email = 'parent2@aums.edu'),
    (SELECT role_id FROM roles WHERE role_code = 'PARENT')
)
ON CONFLICT (user_id, role_id)
DO NOTHING;
