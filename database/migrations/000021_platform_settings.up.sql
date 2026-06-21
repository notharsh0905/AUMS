-- ==========================================
-- AUMS PLATFORM SETTINGS DOMAIN
-- ==========================================

-- ==========================================
-- PLATFORM SETTINGS
-- ==========================================

CREATE TABLE platform_settings (

    platform_setting_id UUID PRIMARY KEY,

    setting_key VARCHAR(255) NOT NULL,

    setting_value TEXT,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_platform_setting_key
        UNIQUE(setting_key)
);

-- ==========================================
-- INSTITUTION SETTINGS
-- ==========================================

CREATE TABLE institution_settings (

    institution_setting_id UUID PRIMARY KEY,

    institution_id UUID NOT NULL,

    setting_key VARCHAR(255) NOT NULL,

    setting_value TEXT,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_institution_setting
        UNIQUE (
            institution_id,
            setting_key
        ),

    CONSTRAINT fk_institution_settings_institution
        FOREIGN KEY (institution_id)
        REFERENCES institutions(institution_id)
        ON DELETE CASCADE
);

-- ==========================================
-- FEATURE FLAGS
-- ==========================================

CREATE TABLE feature_flags (

    feature_flag_id UUID PRIMARY KEY,

    feature_code VARCHAR(255) NOT NULL,

    feature_name VARCHAR(255) NOT NULL,

    description TEXT,

    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_feature_code
        UNIQUE(feature_code)
);

-- ==========================================
-- BRANDING SETTINGS
-- ==========================================

CREATE TABLE branding_settings (

    branding_setting_id UUID PRIMARY KEY,

    institution_id UUID NOT NULL,

    logo_file_id UUID,

    favicon_file_id UUID,

    primary_color VARCHAR(20),

    secondary_color VARCHAR(20),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_branding_institution
        UNIQUE(institution_id),

    CONSTRAINT fk_branding_institution
        FOREIGN KEY (institution_id)
        REFERENCES institutions(institution_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_branding_logo
        FOREIGN KEY (logo_file_id)
        REFERENCES files(file_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_branding_favicon
        FOREIGN KEY (favicon_file_id)
        REFERENCES files(file_id)
        ON DELETE SET NULL
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_institution_settings_institution
ON institution_settings(institution_id);

CREATE INDEX idx_feature_flags_enabled
ON feature_flags(is_enabled);

CREATE INDEX idx_branding_settings_institution
ON branding_settings(institution_id);