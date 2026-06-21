-- ==========================================
-- AUMS ALUMNI DOMAIN
-- ==========================================

CREATE TYPE alumni_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'VERIFIED'
);

CREATE TABLE alumni_profiles (

    alumni_profile_id UUID PRIMARY KEY,

    user_id UUID NOT NULL,

    graduation_year INTEGER,

    current_company VARCHAR(255),

    current_designation VARCHAR(255),

    industry VARCHAR(255),

    linkedin_url TEXT,

    current_city VARCHAR(255),

    current_country VARCHAR(255),

    status alumni_status NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_alumni_user
        UNIQUE (user_id),

    CONSTRAINT fk_alumni_profile_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_alumni_user
ON alumni_profiles(user_id);

CREATE INDEX idx_alumni_company
ON alumni_profiles(current_company);

CREATE INDEX idx_alumni_graduation_year
ON alumni_profiles(graduation_year);