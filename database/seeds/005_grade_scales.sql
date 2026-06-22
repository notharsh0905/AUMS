-- ==========================================
-- GRADE SCALES
-- ==========================================

INSERT INTO grade_scales (
grade_scale_id,
grade_code,
grade_name,
min_percentage,
max_percentage,
grade_point,
is_passing
)
VALUES

(
gen_random_uuid(),
'A+',
'Outstanding',
90.00,
100.00,
10.00,
TRUE
),

(
gen_random_uuid(),
'A',
'Excellent',
80.00,
89.99,
9.00,
TRUE
),

(
gen_random_uuid(),
'B+',
'Very Good',
70.00,
79.99,
8.00,
TRUE
),

(
gen_random_uuid(),
'B',
'Good',
60.00,
69.99,
7.00,
TRUE
),

(
gen_random_uuid(),
'C',
'Average',
50.00,
59.99,
6.00,
TRUE
),

(
gen_random_uuid(),
'P',
'Pass',
40.00,
49.99,
5.00,
TRUE
),

(
gen_random_uuid(),
'F',
'Fail',
0.00,
39.99,
0.00,
FALSE
)

ON CONFLICT (grade_code)
DO NOTHING;
