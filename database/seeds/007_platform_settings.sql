-- ==========================================
-- PLATFORM SETTINGS
-- ==========================================

INSERT INTO platform_settings (
platform_setting_id,
setting_key,
setting_value,
description
)
VALUES

(
gen_random_uuid(),
'platform_name',
'AUMS',
'Official platform name.'
),

(
gen_random_uuid(),
'platform_timezone',
'Asia/Kolkata',
'Default platform timezone.'
),

(
gen_random_uuid(),
'default_language',
'en',
'Default platform language.'
),

(
gen_random_uuid(),
'academic_year_format',
'YYYY-YYYY',
'Academic year display format.'
),

(
gen_random_uuid(),
'attendance_threshold_percentage',
'75',
'Minimum attendance percentage required.'
),

(
gen_random_uuid(),
'max_login_attempts',
'5',
'Maximum allowed login attempts before lockout.'
),

(
gen_random_uuid(),
'session_timeout_minutes',
'60',
'Default user session timeout.'
),

(
gen_random_uuid(),
'password_min_length',
'8',
'Minimum password length.'
),

(
gen_random_uuid(),
'enable_email_notifications',
'true',
'Enable email notification delivery.'
),

(
gen_random_uuid(),
'enable_sms_notifications',
'false',
'Enable SMS notification delivery.'
),

(
gen_random_uuid(),
'enable_audit_logging',
'true',
'Enable audit logging across the platform.'
),

(
gen_random_uuid(),
'enable_file_versioning',
'true',
'Enable file version tracking.'
)

ON CONFLICT (setting_key)
DO NOTHING;
