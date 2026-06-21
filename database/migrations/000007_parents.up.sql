-- ==========================================
-- AUMS PARENT DOMAIN
-- ==========================================

-- NOTE:
-- Parents are first-class users in AUMS.
-- They can login, receive notifications,
-- track attendance, fees, results and approvals.

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE parent_relationship_type AS ENUM (
    'FATHER',
    'MOTHER',
    'GUARDIAN',
    'SPOUSE',
    'OTHER'
);

-- ==========================================
-- PARENT PROFILES
-- ==========================================

CREATE TABLE parent_profiles (

    parent_profile_id UUID PRIMARY KEY,

    user_id UUID NOT NULL,

    occupation VARCHAR(255),

    annual_income NUMERIC(15,2),

    employer_name VARCHAR(255),

    office_address TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_parent_user
        UNIQUE (user_id),

    CONSTRAINT fk_parent_profile_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
);

-- ==========================================
-- STUDENT PARENT RELATIONSHIPS
-- ==========================================

CREATE TABLE student_parent_relationships (

    student_parent_relationship_id UUID PRIMARY KEY,

    student_profile_id UUID NOT NULL,

    parent_profile_id UUID NOT NULL,

    relationship_type parent_relationship_type NOT NULL,

    is_primary_contact BOOLEAN NOT NULL DEFAULT FALSE,

    is_emergency_contact BOOLEAN NOT NULL DEFAULT FALSE,

    can_receive_notifications BOOLEAN NOT NULL DEFAULT TRUE,

    can_view_attendance BOOLEAN NOT NULL DEFAULT TRUE,

    can_view_results BOOLEAN NOT NULL DEFAULT TRUE,

    can_approve_leave BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_student_parent_relationship
        UNIQUE (
            student_profile_id,
            parent_profile_id
        ),

    CONSTRAINT fk_student_parent_student
        FOREIGN KEY (student_profile_id)
        REFERENCES student_profiles(student_profile_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_student_parent_parent
        FOREIGN KEY (parent_profile_id)
        REFERENCES parent_profiles(parent_profile_id)
        ON DELETE CASCADE
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_parent_profiles_user
ON parent_profiles(user_id);

CREATE INDEX idx_student_parent_student
ON student_parent_relationships(student_profile_id);

CREATE INDEX idx_student_parent_parent
ON student_parent_relationships(parent_profile_id);

CREATE INDEX idx_student_parent_primary_contact
ON student_parent_relationships(is_primary_contact);