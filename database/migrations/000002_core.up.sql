-- ==========================================
-- AUMS CORE DATABASE
-- ==========================================

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE institution_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'PENDING',
    'ARCHIVED'
);

CREATE TYPE institution_type AS ENUM (
    'UNIVERSITY',
    'COLLEGE',
    'SCHOOL',
    'TRAINING_CENTER'
);

-- ==========================================
-- INSTITUTIONS
-- ==========================================

CREATE TABLE institutions (

    institution_id UUID PRIMARY KEY,

    institution_code VARCHAR(50) NOT NULL UNIQUE,

    institution_name VARCHAR(255) NOT NULL,

    institution_type institution_type NOT NULL,

    official_email CITEXT,

    official_phone VARCHAR(50),

    website_url TEXT,

    address_line_1 VARCHAR(255),

    address_line_2 VARCHAR(255),

    city VARCHAR(100),

    state VARCHAR(100),

    country VARCHAR(100),

    postal_code VARCHAR(20),

    logo_url TEXT,

    timezone VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',

    currency_code VARCHAR(10) NOT NULL DEFAULT 'INR',

    status institution_status NOT NULL DEFAULT 'PENDING',

    subscription_plan VARCHAR(100),

    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- INSTITUTION DOMAINS
-- ==========================================

CREATE TABLE institution_domains (

    domain_id UUID PRIMARY KEY,

    institution_id UUID NOT NULL,

    domain_name VARCHAR(255) NOT NULL UNIQUE,

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_institution_domains_institution
        FOREIGN KEY (institution_id)
        REFERENCES institutions(institution_id)
        ON DELETE CASCADE
);

-- ==========================================
-- DATABASE REGISTRY
-- ==========================================

CREATE TABLE institution_database_registry (

    registry_id UUID PRIMARY KEY,

    institution_id UUID NOT NULL,

    database_name VARCHAR(100) NOT NULL,

    database_host VARCHAR(255) NOT NULL,

    database_port INTEGER NOT NULL,

    database_schema VARCHAR(100),

    database_version VARCHAR(50),

    is_primary BOOLEAN NOT NULL DEFAULT TRUE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_database_registry_institution
        FOREIGN KEY (institution_id)
        REFERENCES institutions(institution_id)
        ON DELETE CASCADE
);

-- ==========================================
-- PLATFORM SETTINGS
-- ==========================================

CREATE TABLE platform_settings (

    setting_id UUID PRIMARY KEY,

    setting_key VARCHAR(100) NOT NULL UNIQUE,

    setting_value TEXT NOT NULL,

    data_type VARCHAR(50) NOT NULL,

    description TEXT,

    is_editable BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- FEATURE FLAGS
-- ==========================================

CREATE TABLE feature_flags (

    feature_id UUID PRIMARY KEY,

    feature_code VARCHAR(100) NOT NULL UNIQUE,

    feature_name VARCHAR(255) NOT NULL,

    description TEXT,

    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,

    rollout_percentage INTEGER NOT NULL DEFAULT 100,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_rollout_percentage
        CHECK (
            rollout_percentage >= 0
            AND rollout_percentage <= 100
        )
);

-- ==========================================
-- INSTITUTION FEATURE FLAGS
-- ==========================================

CREATE TABLE institution_feature_flags (

    institution_feature_id UUID PRIMARY KEY,

    institution_id UUID NOT NULL,

    feature_id UUID NOT NULL,

    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_institution_feature
        UNIQUE (
            institution_id,
            feature_id
        ),

    CONSTRAINT fk_iff_institution
        FOREIGN KEY (institution_id)
        REFERENCES institutions(institution_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_iff_feature
        FOREIGN KEY (feature_id)
        REFERENCES feature_flags(feature_id)
        ON DELETE CASCADE
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_institutions_status
ON institutions(status);

CREATE INDEX idx_institutions_type
ON institutions(institution_type);

CREATE INDEX idx_domains_institution
ON institution_domains(institution_id);

CREATE INDEX idx_registry_institution
ON institution_database_registry(institution_id);

CREATE INDEX idx_registry_active
ON institution_database_registry(is_active);

CREATE INDEX idx_feature_enabled
ON feature_flags(is_enabled);

CREATE INDEX idx_iff_institution
ON institution_feature_flags(institution_id);

CREATE INDEX idx_iff_feature
ON institution_feature_flags(feature_id);