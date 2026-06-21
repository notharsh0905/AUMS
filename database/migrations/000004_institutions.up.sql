-- ==========================================
-- AUMS INSTITUTION STRUCTURE DOMAIN
-- ==========================================

CREATE TYPE degree_type AS ENUM (
    'CERTIFICATE',
    'DIPLOMA',
    'UNDERGRADUATE',
    'POSTGRADUATE',
    'DOCTORATE'
);

-- ==========================================
-- CAMPUSES
-- ==========================================

CREATE TABLE campuses (

    campus_id UUID PRIMARY KEY,

    campus_code VARCHAR(50) NOT NULL,

    campus_name VARCHAR(255) NOT NULL,

    address_line_1 VARCHAR(255),

    address_line_2 VARCHAR(255),

    city VARCHAR(100),

    state VARCHAR(100),

    country VARCHAR(100),

    postal_code VARCHAR(20),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_campus_code UNIQUE (campus_code)
);

-- ==========================================
-- SCHOOLS
-- ==========================================

CREATE TABLE schools (

    school_id UUID PRIMARY KEY,

    school_code VARCHAR(50) NOT NULL,

    school_name VARCHAR(255) NOT NULL,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_school_code UNIQUE (school_code)
);

-- ==========================================
-- DEPARTMENTS
-- ==========================================

CREATE TABLE departments (

    department_id UUID PRIMARY KEY,

    school_id UUID NOT NULL,

    department_code VARCHAR(50) NOT NULL,

    department_name VARCHAR(255) NOT NULL,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_department_code UNIQUE (department_code),

    CONSTRAINT fk_departments_school
        FOREIGN KEY (school_id)
        REFERENCES schools(school_id)
        ON DELETE RESTRICT
);

-- ==========================================
-- PROGRAMS
-- ==========================================

CREATE TABLE programs (

    program_id UUID PRIMARY KEY,

    department_id UUID NOT NULL,

    program_code VARCHAR(50) NOT NULL,

    program_name VARCHAR(255) NOT NULL,

    degree_type degree_type NOT NULL,

    duration_value INTEGER NOT NULL,

    duration_unit VARCHAR(20) NOT NULL,

    total_semesters INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_program_code UNIQUE (program_code),

    CONSTRAINT fk_program_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_duration_value
        CHECK (duration_value > 0),

    CONSTRAINT chk_total_semesters
        CHECK (
            total_semesters IS NULL
            OR total_semesters > 0
        )
);

-- ==========================================
-- ACADEMIC YEARS
-- ==========================================

CREATE TABLE academic_years (

    academic_year_id UUID PRIMARY KEY,

    academic_year_name VARCHAR(50) NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    is_current BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_academic_year_name
        UNIQUE (academic_year_name),

    CONSTRAINT chk_academic_year_dates
        CHECK (end_date > start_date)
);

-- ==========================================
-- SEMESTERS
-- ==========================================

CREATE TABLE semesters (

    semester_id UUID PRIMARY KEY,

    academic_year_id UUID NOT NULL,

    semester_number INTEGER NOT NULL,

    semester_name VARCHAR(100) NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_semester_academic_year
        FOREIGN KEY (academic_year_id)
        REFERENCES academic_years(academic_year_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_semester_dates
        CHECK (end_date > start_date)
);

-- ==========================================
-- BUILDINGS
-- ==========================================

CREATE TABLE buildings (

    building_id UUID PRIMARY KEY,

    campus_id UUID NOT NULL,

    building_code VARCHAR(50) NOT NULL,

    building_name VARCHAR(255) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_building_code UNIQUE (campus_id, building_code),

    CONSTRAINT fk_building_campus
        FOREIGN KEY (campus_id)
        REFERENCES campuses(campus_id)
        ON DELETE RESTRICT
);

-- ==========================================
-- ROOMS
-- ==========================================

CREATE TABLE rooms (

    room_id UUID PRIMARY KEY,

    building_id UUID NOT NULL,

    room_code VARCHAR(50) NOT NULL,

    room_name VARCHAR(255),

    floor_number INTEGER,

    capacity INTEGER,

    room_type VARCHAR(50),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_room_code UNIQUE (building_id, room_code),

    CONSTRAINT fk_room_building
        FOREIGN KEY (building_id)
        REFERENCES buildings(building_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_room_capacity
        CHECK (
            capacity IS NULL
            OR capacity > 0
        )
);