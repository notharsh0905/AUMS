-- ==========================================
-- AUMS DATABASE VERIFICATION UTILITY
-- ==========================================

\echo '=== CORE TABLE ROW COUNTS ==='
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'roles', COUNT(*) FROM roles
UNION ALL
SELECT 'user_roles', COUNT(*) FROM user_roles
UNION ALL
SELECT 'institutions', COUNT(*) FROM institutions
UNION ALL
SELECT 'campuses', COUNT(*) FROM campuses
UNION ALL
SELECT 'schools', COUNT(*) FROM schools
UNION ALL
SELECT 'departments', COUNT(*) FROM departments
UNION ALL
SELECT 'programs', COUNT(*) FROM programs;

\echo ''
\echo '=== USER ROLE ASSOCIATIONS ==='
SELECT 
    u.username,
    u.email,
    r.role_code,
    r.role_name
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id
JOIN roles r ON ur.role_id = r.role_id
ORDER BY r.role_code, u.username;

\echo ''
\echo '=== ACADEMIC HIERARCHY INTEGRITY JOIN ==='
-- Verifies that Schools link to Departments which link to Programs correctly
SELECT 
    s.school_code,
    s.school_name,
    d.department_code,
    d.department_name,
    p.program_code,
    p.program_name,
    p.degree_type,
    p.total_semesters
FROM schools s
JOIN departments d ON s.school_id = d.school_id
JOIN programs p ON d.department_id = p.department_id
ORDER BY s.school_code, d.department_code, p.program_code;

\echo ''
\echo '=== INSTITUTION & CAMPUS REGISTRY ==='
SELECT 
    i.institution_code,
    i.institution_name,
    i.status AS institution_status,
    c.campus_code,
    c.campus_name
FROM institutions i
CROSS JOIN campuses c; -- cross join because campuses table is independent in schema (multi-tenant tenant isolation)
