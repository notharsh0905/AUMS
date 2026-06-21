-- ==========================================
-- AUMS STUDENT DOMAIN
-- ==========================================

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE student_status AS ENUM (
    'APPLIED',
    'ADMITTED',
    'ACTIVE',
    'SUSPENDED',
    'DROPPED',
    'GRADUATED',
    'ALUMNI'
);

CREATE TYPE guardian_relationship AS ENUM (
    'FATHER',
    'MOTHER',
    'GUARDIAN',
    'SPOUSE',
    'OTHER'
);

CREATE TYPE document_status AS ENUM (
    'PENDING',
    'VERIFIED',
    'REJECTED'
);

-- ==========================================
-- STUDENT PROFILES
-- ==========================================

CREATE TABLE student_profiles (

    student_profile_id UUID PRIMARY KEY,

    user_id UUID NOT NULL,

    admission_date DATE,

    date_of_birth DATE,

    gender VARCHAR(20),

    blood_group VARCHAR(10),

    nationality VARCHAR(100),

    category VARCHAR(50),

    religion VARCHAR(100),

    emergency_contact_name VARCHAR(255),

    emergency_contact_phone VARCHAR(20),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_student_user
        UNIQUE (user_id),

    CONSTRAINT fk_student_profile_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
);

-- ==========================================
-- STUDENT ENROLLMENTS
-- ==========================================

CREATE TABLE student_enrollments (

    enrollment_id UUID PRIMARY KEY,

    student_profile_id UUID NOT NULL,

    program_id UUID NOT NULL,

    enrollment_number VARCHAR(100) NOT NULL,

    enrollment_date DATE NOT NULL,

    graduation_date DATE,

    status student_status NOT NULL DEFAULT 'ACTIVE',

    remarks TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_enrollment_number
        UNIQUE (enrollment_number),

    CONSTRAINT fk_student_enrollment_profile
        FOREIGN KEY (student_profile_id)
        REFERENCES student_profiles(student_profile_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_enrollment_program
        FOREIGN KEY (program_id)
        REFERENCES programs(program_id)
        ON DELETE RESTRICT
);

-- ==========================================
-- STUDENT GUARDIANS
-- ==========================================

CREATE TABLE student_guardians (

    guardian_id UUID PRIMARY KEY,

    student_profile_id UUID NOT NULL,

    full_name VARCHAR(255) NOT NULL,

    relationship guardian_relationship NOT NULL,

    phone_number VARCHAR(20),

    email CITEXT,

    occupation VARCHAR(255),

    annual_income NUMERIC(12,2),

    is_primary_guardian BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_student_guardian_profile
        FOREIGN KEY (student_profile_id)
        REFERENCES student_profiles(student_profile_id)
        ON DELETE CASCADE
);

-- ==========================================
-- STUDENT DOCUMENTS
-- ==========================================

CREATE TABLE student_documents (

    student_document_id UUID PRIMARY KEY,

    student_profile_id UUID NOT NULL,

    document_type VARCHAR(100) NOT NULL,

    document_name VARCHAR(255) NOT NULL,

    file_id UUID,

    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    verification_status document_status NOT NULL DEFAULT 'PENDING',

    verified_by UUID,

    verified_at TIMESTAMPTZ,

    remarks TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_student_document_profile
        FOREIGN KEY (student_profile_id)
        REFERENCES student_profiles(student_profile_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_student_document_verified_by
        FOREIGN KEY (verified_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

-- ==========================================
-- STUDENT STATUS HISTORY
-- ==========================================

CREATE TABLE student_status_history (

    status_history_id UUID PRIMARY KEY,

    student_profile_id UUID NOT NULL,

    previous_status student_status,

    new_status student_status NOT NULL,

    changed_by UUID,

    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    remarks TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_student_status_profile
        FOREIGN KEY (student_profile_id)
        REFERENCES student_profiles(student_profile_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_student_status_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_student_profiles_user
ON student_profiles(user_id);

CREATE INDEX idx_student_enrollments_student
ON student_enrollments(student_profile_id);

CREATE INDEX idx_student_enrollments_program
ON student_enrollments(program_id);

CREATE INDEX idx_student_enrollments_status
ON student_enrollments(status);

CREATE INDEX idx_student_guardians_student
ON student_guardians(student_profile_id);

CREATE INDEX idx_student_documents_student
ON student_documents(student_profile_id);

CREATE INDEX idx_student_documents_status
ON student_documents(verification_status);

CREATE INDEX idx_student_status_history_student
ON student_status_history(student_profile_id);