-- ==========================================
-- AUMS RESULT DOMAIN
-- ==========================================

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE result_status AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'WITHHELD',
    'REVISED'
);

-- ==========================================
-- GRADE SCALES
-- Institution-wide grading policy
-- ==========================================

CREATE TABLE grade_scales (

    grade_scale_id UUID PRIMARY KEY,

    grade_code VARCHAR(10) NOT NULL,

    grade_name VARCHAR(50) NOT NULL,

    min_percentage NUMERIC(5,2) NOT NULL,

    max_percentage NUMERIC(5,2) NOT NULL,

    grade_point NUMERIC(4,2) NOT NULL,

    is_passing BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_grade_code
        UNIQUE (grade_code),

    CONSTRAINT chk_grade_percentage_range
        CHECK (
            min_percentage >= 0
            AND max_percentage <= 100
            AND min_percentage <= max_percentage
        ),

    CONSTRAINT chk_grade_point
        CHECK (grade_point >= 0)
);

-- ==========================================
-- COURSE RESULTS
-- One result per student per course offering
-- ==========================================

CREATE TABLE course_results (

    course_result_id UUID PRIMARY KEY,

    enrollment_id UUID NOT NULL,

    course_offering_id UUID NOT NULL,

    total_marks NUMERIC(8,2) NOT NULL,

    marks_obtained NUMERIC(8,2) NOT NULL,

    percentage NUMERIC(5,2) NOT NULL,

    grade_scale_id UUID,

    result_status result_status
        NOT NULL DEFAULT 'DRAFT',

    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_course_result
        UNIQUE (
            enrollment_id,
            course_offering_id
        ),

    CONSTRAINT fk_course_result_enrollment
        FOREIGN KEY (enrollment_id)
        REFERENCES student_enrollments(enrollment_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_course_result_offering
        FOREIGN KEY (course_offering_id)
        REFERENCES course_offerings(course_offering_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_course_result_grade
        FOREIGN KEY (grade_scale_id)
        REFERENCES grade_scales(grade_scale_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_course_result_total
        CHECK (total_marks > 0),

    CONSTRAINT chk_course_result_marks
        CHECK (
            marks_obtained >= 0
            AND marks_obtained <= total_marks
        ),

    CONSTRAINT chk_course_result_percentage
        CHECK (
            percentage >= 0
            AND percentage <= 100
        )
);

-- ==========================================
-- SEMESTER RESULTS
-- SGPA Calculation
-- ==========================================

CREATE TABLE semester_results (

    semester_result_id UUID PRIMARY KEY,

    enrollment_id UUID NOT NULL,

    semester_id UUID NOT NULL,

    total_credits NUMERIC(8,2) NOT NULL,

    earned_credits NUMERIC(8,2) NOT NULL,

    sgpa NUMERIC(4,2) NOT NULL,

    result_status result_status
        NOT NULL DEFAULT 'DRAFT',

    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_semester_result
        UNIQUE (
            enrollment_id,
            semester_id
        ),

    CONSTRAINT fk_semester_result_enrollment
        FOREIGN KEY (enrollment_id)
        REFERENCES student_enrollments(enrollment_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_semester_result_semester
        FOREIGN KEY (semester_id)
        REFERENCES semesters(semester_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_sgpa
        CHECK (
            sgpa >= 0
            AND sgpa <= 10
        )
);

-- ==========================================
-- PROGRAM RESULTS
-- CGPA Calculation
-- ==========================================

CREATE TABLE program_results (

    program_result_id UUID PRIMARY KEY,

    enrollment_id UUID NOT NULL,

    cgpa NUMERIC(4,2) NOT NULL,

    total_credits NUMERIC(8,2) NOT NULL,

    earned_credits NUMERIC(8,2) NOT NULL,

    degree_completed BOOLEAN NOT NULL DEFAULT FALSE,

    completion_date DATE,

    result_status result_status
        NOT NULL DEFAULT 'DRAFT',

    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_program_result
        UNIQUE (enrollment_id),

    CONSTRAINT fk_program_result_enrollment
        FOREIGN KEY (enrollment_id)
        REFERENCES student_enrollments(enrollment_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_cgpa
        CHECK (
            cgpa >= 0
            AND cgpa <= 10
        )
);

-- ==========================================
-- TRANSCRIPTS
-- Official Academic Record
-- ==========================================

CREATE TABLE transcripts (

    transcript_id UUID PRIMARY KEY,

    enrollment_id UUID NOT NULL,

    transcript_number VARCHAR(100) NOT NULL,

    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    generated_by UUID,

    file_id UUID,

    remarks TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_transcript_number
        UNIQUE (transcript_number),

    CONSTRAINT fk_transcript_enrollment
        FOREIGN KEY (enrollment_id)
        REFERENCES student_enrollments(enrollment_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_transcript_generated_by
        FOREIGN KEY (generated_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_course_results_enrollment
ON course_results(enrollment_id);

CREATE INDEX idx_course_results_offering
ON course_results(course_offering_id);

CREATE INDEX idx_semester_results_enrollment
ON semester_results(enrollment_id);

CREATE INDEX idx_semester_results_semester
ON semester_results(semester_id);

CREATE INDEX idx_program_results_enrollment
ON program_results(enrollment_id);

CREATE INDEX idx_transcripts_enrollment
ON transcripts(enrollment_id);

CREATE INDEX idx_transcripts_number
ON transcripts(transcript_number);