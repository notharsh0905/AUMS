-- ==========================================
-- AUMS ACADEMIC DOMAIN
-- ==========================================

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE course_type AS ENUM (
    'THEORY',
    'PRACTICAL',
    'LAB',
    'PROJECT',
    'SEMINAR',
    'WORKSHOP'
);

CREATE TYPE offering_status AS ENUM (
    'PLANNED',
    'ACTIVE',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE registration_status AS ENUM (
    'REGISTERED',
    'DROPPED',
    'COMPLETED',
    'FAILED'
);

-- ==========================================
-- COURSES
-- Master Subject Catalog
-- ==========================================

CREATE TABLE courses (

    course_id UUID PRIMARY KEY,

    course_code VARCHAR(50) NOT NULL,

    course_name VARCHAR(255) NOT NULL,

    course_type course_type NOT NULL,

    credits NUMERIC(4,2) NOT NULL,

    contact_hours INTEGER,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_course_code
        UNIQUE(course_code),

    CONSTRAINT chk_course_credits
        CHECK (credits > 0)
);

-- ==========================================
-- PROGRAM CURRICULUM
-- Defines which course belongs to which
-- program and semester
-- ==========================================

CREATE TABLE program_curriculum (

    program_curriculum_id UUID PRIMARY KEY,

    program_id UUID NOT NULL,

    course_id UUID NOT NULL,

    semester_number INTEGER NOT NULL,

    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_program_course
        UNIQUE (
            program_id,
            course_id
        ),

    CONSTRAINT fk_program_curriculum_program
        FOREIGN KEY (program_id)
        REFERENCES programs(program_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_program_curriculum_course
        FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
        ON DELETE RESTRICT
);

-- ==========================================
-- COURSE OFFERINGS
-- Actual course instance in an academic term
-- ==========================================

CREATE TABLE course_offerings (

    course_offering_id UUID PRIMARY KEY,

    course_id UUID NOT NULL,

    academic_year_id UUID NOT NULL,

    semester_id UUID NOT NULL,

    section VARCHAR(50),

    status offering_status NOT NULL DEFAULT 'PLANNED',

    max_capacity INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_course_offering_course
        FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_course_offering_year
        FOREIGN KEY (academic_year_id)
        REFERENCES academic_years(academic_year_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_course_offering_semester
        FOREIGN KEY (semester_id)
        REFERENCES semesters(semester_id)
        ON DELETE RESTRICT
);

-- ==========================================
-- FACULTY COURSE ALLOCATIONS
-- ==========================================

CREATE TABLE faculty_course_allocations (

    faculty_course_allocation_id UUID PRIMARY KEY,

    faculty_profile_id UUID NOT NULL,

    course_offering_id UUID NOT NULL,

    allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_faculty_course
        UNIQUE (
            faculty_profile_id,
            course_offering_id
        ),

    CONSTRAINT fk_fca_faculty
        FOREIGN KEY (faculty_profile_id)
        REFERENCES faculty_profiles(faculty_profile_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_fca_offering
        FOREIGN KEY (course_offering_id)
        REFERENCES course_offerings(course_offering_id)
        ON DELETE RESTRICT
);

-- ==========================================
-- STUDENT COURSE REGISTRATIONS
-- ==========================================

CREATE TABLE student_course_registrations (

    student_course_registration_id UUID PRIMARY KEY,

    student_profile_id UUID NOT NULL,

    course_offering_id UUID NOT NULL,

    registration_status registration_status
        NOT NULL DEFAULT 'REGISTERED',

    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_student_course_registration
        UNIQUE (
            student_profile_id,
            course_offering_id
        ),

    CONSTRAINT fk_scr_student
        FOREIGN KEY (student_profile_id)
        REFERENCES student_profiles(student_profile_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_scr_course_offering
        FOREIGN KEY (course_offering_id)
        REFERENCES course_offerings(course_offering_id)
        ON DELETE RESTRICT
);

-- ==========================================
-- COURSE PREREQUISITES
-- ==========================================

CREATE TABLE course_prerequisites (

    prerequisite_id UUID PRIMARY KEY,

    course_id UUID NOT NULL,

    prerequisite_course_id UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_prerequisite_course
        FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_prerequisite_required_course
        FOREIGN KEY (prerequisite_course_id)
        REFERENCES courses(course_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_course_prerequisite
        UNIQUE (
            course_id,
            prerequisite_course_id
        )
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_courses_code
ON courses(course_code);

CREATE INDEX idx_program_curriculum_program
ON program_curriculum(program_id);

CREATE INDEX idx_program_curriculum_course
ON program_curriculum(course_id);

CREATE INDEX idx_course_offerings_course
ON course_offerings(course_id);

CREATE INDEX idx_course_offerings_semester
ON course_offerings(semester_id);

CREATE INDEX idx_faculty_course_allocations_faculty
ON faculty_course_allocations(faculty_profile_id);

CREATE INDEX idx_student_course_registrations_student
ON student_course_registrations(student_profile_id);

CREATE INDEX idx_student_course_registrations_offering
ON student_course_registrations(course_offering_id);