-- ==========================================
-- FEATURE FLAGS
-- ==========================================
-- Optional platform capabilities only
-- Core academic modules are NOT feature flags.
-- They are part of the platform baseline.
-- ==========================================

INSERT INTO feature_flags (
feature_flag_id,
feature_code,
feature_name,
description,
is_enabled
)
VALUES

(
gen_random_uuid(),
'ALUMNI_PORTAL',
'Alumni Portal',
'Enables alumni portal functionality.',
TRUE
),

(
gen_random_uuid(),
'MENTORSHIP_PROGRAM',
'Mentorship Program',
'Enables mentor and mentee workflows.',
TRUE
),

(
gen_random_uuid(),
'RECRUITMENT_PORTAL',
'Recruitment Portal',
'Enables alumni and student recruitment workflows.',
TRUE
),

(
gen_random_uuid(),
'DIGITAL_TRANSCRIPTS',
'Digital Transcripts',
'Enables transcript generation and verification.',
TRUE
),

(
gen_random_uuid(),
'NOTIFICATION_CENTER',
'Notification Center',
'Enables centralized notification delivery.',
TRUE
),

(
gen_random_uuid(),
'EMAIL_NOTIFICATIONS',
'Email Notifications',
'Enables email notification channel.',
TRUE
),

(
gen_random_uuid(),
'SMS_NOTIFICATIONS',
'SMS Notifications',
'Enables SMS notification channel.',
FALSE
),

(
gen_random_uuid(),
'DOCUMENT_MANAGEMENT',
'Document Management',
'Enables centralized document storage and management.',
TRUE
),

(
gen_random_uuid(),
'ONLINE_EXAMINATION',
'Online Examination',
'Enables remote and online examination support.',
FALSE
),

(
gen_random_uuid(),
'PLACEMENT_MODULE',
'Placement Module',
'Enables placement and career services workflows.',
FALSE
),

(
gen_random_uuid(),
'LMS_MODULE',
'Learning Management System',
'Enables LMS functionality.',
FALSE
),

(
gen_random_uuid(),
'AI_ASSISTANT',
'AI Assistant',
'Enables AI-powered assistant capabilities.',
FALSE
),

(
gen_random_uuid(),
'STUDENT_RISK_ANALYSIS',
'Student Risk Analysis',
'Enables AI-powered student risk prediction.',
FALSE
),

(
gen_random_uuid(),
'RECOMMENDATION_ENGINE',
'Recommendation Engine',
'Enables AI-powered recommendations.',
FALSE
),

(
gen_random_uuid(),
'RESUME_ANALYZER',
'Resume Analyzer',
'Enables AI resume analysis services.',
FALSE
),

(
gen_random_uuid(),
'BLOCKCHAIN_VERIFICATION',
'Blockchain Verification',
'Enables blockchain-based certificate verification.',
FALSE
),

(
gen_random_uuid(),
'DIGITAL_ID_CARD',
'Digital ID Card',
'Enables digital identity card generation.',
FALSE
)

ON CONFLICT (feature_code)
DO NOTHING;
