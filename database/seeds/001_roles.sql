-- ==========================================
-- AUMS SYSTEM ROLES SEED
-- ==========================================

INSERT INTO roles (
role_id,
role_code,
role_name,
description,
is_system_role
)
VALUES

(
gen_random_uuid(),
'SUPER_ADMIN',
'Super Administrator',
'Global platform administrator with unrestricted access.',
TRUE
),

(
gen_random_uuid(),
'INSTITUTION_ADMIN',
'Institution Administrator',
'Administrator responsible for managing a specific institution.',
TRUE
),

(
gen_random_uuid(),
'DIRECTOR',
'Director',
'Institution director responsible for academic and administrative oversight.',
TRUE
),

(
gen_random_uuid(),
'DEAN',
'Dean',
'Academic dean responsible for schools and academic governance.',
TRUE
),

(
gen_random_uuid(),
'HOD',
'Head of Department',
'Department leader responsible for departmental operations.',
TRUE
),

(
gen_random_uuid(),
'FACULTY',
'Faculty',
'Teaching staff responsible for academic delivery.',
TRUE
),

(
gen_random_uuid(),
'CLASS_COORDINATOR',
'Class Coordinator',
'Faculty member responsible for coordinating a class or batch.',
TRUE
),

(
gen_random_uuid(),
'STUDENT',
'Student',
'Active enrolled student.',
TRUE
),

(
gen_random_uuid(),
'PARENT',
'Parent',
'Parent or guardian associated with a student.',
TRUE
),

(
gen_random_uuid(),
'ALUMNI',
'Alumni',
'Former student who has graduated from the institution.',
TRUE
),

(
gen_random_uuid(),
'MENTOR',
'Mentor',
'Alumni or professional providing mentorship services.',
TRUE
),

(
gen_random_uuid(),
'RECRUITER',
'Recruiter',
'Industry representative responsible for recruitment activities.',
TRUE
),

(
gen_random_uuid(),
'EXAM_CONTROLLER',
'Examination Controller',
'Responsible for examination scheduling and result processing.',
TRUE
),

(
gen_random_uuid(),
'LIBRARIAN',
'Librarian',
'Responsible for library and resource management.',
TRUE
),

(
gen_random_uuid(),
'ACCOUNTANT',
'Accountant',
'Responsible for financial and accounting operations.',
TRUE
),

(
gen_random_uuid(),
'AUDITOR',
'Auditor',
'Responsible for audit, compliance, and governance reviews.',
TRUE
)

ON CONFLICT (role_code)
DO NOTHING;
