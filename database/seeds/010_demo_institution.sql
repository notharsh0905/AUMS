-- ==========================================
-- AUMS DEMO INSTITUTION SEED
-- ==========================================

INSERT INTO institutions (
    institution_id,
    institution_code,
    institution_name,
    institution_type,
    official_email,
    official_phone,
    website_url,
    address_line_1,
    city,
    state,
    country,
    postal_code,
    status,
    onboarding_completed
)
VALUES (
    gen_random_uuid(),
    'AUMS_UNIV',
    'AUMS University',
    'UNIVERSITY'::institution_type,
    'info@aums.com',
    '+15550200',
    'https://www.aums.com',
    '100 University Ave',
    'New York',
    'NY',
    'USA',
    '10001',
    'ACTIVE'::institution_status,
    TRUE
)
ON CONFLICT (institution_code)
DO NOTHING;
