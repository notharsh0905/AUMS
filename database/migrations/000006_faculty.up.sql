-- ==========================================
-- AUMS FACULTY DOMAIN
-- ==========================================

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE faculty_status AS ENUM (
    'ACTIVE',
    'ON_LEAVE',
    'SUSPENDED',
    'RETIRED',
    'RESIGNED'
);

CREATE TYPE employment_type AS ENUM (
    'FULL_TIME',
    'PART_TIME',
    'VISITING',
    'CONTRACT',
    'ADJUNCT'
);

CREATE TYPE faculty_designation AS ENUM (
    'LECTURER',
    'ASSISTANT_PROFESSOR',
    'ASSOCIATE_PROFESSOR',
    'PROFESSOR',
    'HEAD_OF_DEPARTMENT',
    'DEAN',
    'DIRECTOR',
    'REGISTRAR'
);

-- ==========================================
-- FACULTY PROFILES
-- ==========================================

CREATE TABLE faculty_profiles (

    faculty_profile_id UUID PRIMARY KEY,

    user_id UUID NOT NULL,

    employee_code VARCHAR(100) NOT NULL,

    department_id UUID NOT NULL,

    designation faculty_designation NOT NULL,

    employment_type employment_type NOT NULL,

    joining_date DATE NOT NULL,

    relieving_date DATE,

    status faculty_status NOT NULL DEFAULT 'ACTIVE',

    years_of_experience NUMERIC(5,2),

    office_location VARCHAR(255),

    bio TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_faculty_user
        UNIQUE (user_id),

    CONSTRAINT uq_faculty_employee_code
        UNIQUE (employee_code),

    CONSTRAINT fk_faculty_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_faculty_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE RESTRICT
);

-- ==========================================
-- FACULTY DEPARTMENT HISTORY
-- ==========================================

CREATE TABLE faculty_department_history (

    faculty_department_history_id UUID PRIMARY KEY,

    faculty_profile_id UUID NOT NULL,

    department_id UUID NOT NULL,

    designation faculty_designation NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE,

    remarks TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_faculty_history_profile
        FOREIGN KEY (faculty_profile_id)
        REFERENCES faculty_profiles(faculty_profile_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_faculty_history_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE RESTRICT
);

-- ==========================================
-- FACULTY QUALIFICATIONS
-- ==========================================

CREATE TABLE faculty_qualifications (

    qualification_id UUID PRIMARY KEY,

    faculty_profile_id UUID NOT NULL,

    degree_name VARCHAR(255) NOT NULL,

    specialization VARCHAR(255),

    institution_name VARCHAR(255),

    passing_year INTEGER,

    grade_or_percentage VARCHAR(50),

    document_file_id UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_faculty_qualification_profile
        FOREIGN KEY (faculty_profile_id)
        REFERENCES faculty_profiles(faculty_profile_id)
        ON DELETE CASCADE
);

-- ==========================================
-- FACULTY RESEARCH PROFILES
-- ==========================================

CREATE TABLE faculty_research_profiles (

    research_profile_id UUID PRIMARY KEY,

    faculty_profile_id UUID NOT NULL,

    google_scholar_url TEXT,

    scopus_id VARCHAR(100),

    orcid_id VARCHAR(100),

    research_interests TEXT,

    publications_count INTEGER NOT NULL DEFAULT 0,

    patents_count INTEGER NOT NULL DEFAULT 0,

    h_index INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_faculty_research_profile
        UNIQUE (faculty_profile_id),

    CONSTRAINT fk_faculty_research_profile
        FOREIGN KEY (faculty_profile_id)
        REFERENCES faculty_profiles(faculty_profile_id)
        ON DELETE CASCADE
);

-- ==========================================
-- FACULTY STATUS HISTORY
-- ==========================================

CREATE TABLE faculty_status_history (

    faculty_status_history_id UUID PRIMARY KEY,

    faculty_profile_id UUID NOT NULL,

    previous_status faculty_status,

    new_status faculty_status NOT NULL,

    changed_by UUID,

    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    remarks TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_faculty_status_profile
        FOREIGN KEY (faculty_profile_id)
        REFERENCES faculty_profiles(faculty_profile_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_faculty_status_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_faculty_profiles_department
ON faculty_profiles(department_id);

CREATE INDEX idx_faculty_profiles_status
ON faculty_profiles(status);

CREATE INDEX idx_faculty_profiles_designation
ON faculty_profiles(designation);

CREATE INDEX idx_faculty_history_profile
ON faculty_department_history(faculty_profile_id);

CREATE INDEX idx_faculty_history_department
ON faculty_department_history(department_id);

CREATE INDEX idx_faculty_qualification_profile
ON faculty_qualifications(faculty_profile_id);

CREATE INDEX idx_faculty_research_profile
ON faculty_research_profiles(faculty_profile_id);

CREATE INDEX idx_faculty_status_profile
ON faculty_status_history(faculty_profile_id);