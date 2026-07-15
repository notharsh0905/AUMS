-- ==========================================
-- AUMS DEMO CAMPUSES SEED
-- ==========================================

INSERT INTO campuses (
    campus_id,
    campus_code,
    campus_name,
    address_line_1,
    city,
    state,
    country,
    postal_code
)
VALUES (
    gen_random_uuid(),
    'NYC_MAIN',
    'New York City Main Campus',
    '100 University Ave',
    'New York',
    'NY',
    'USA',
    '10001'
)
ON CONFLICT (campus_code)
DO NOTHING;
