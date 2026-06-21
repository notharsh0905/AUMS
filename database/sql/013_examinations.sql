-- ==========================================
-- AUMS EXAMINATION DOMAIN
-- ==========================================

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE exam_type AS ENUM (
    'QUIZ',
    'MID_SEMESTER',
    'END_SEMESTER',
    'PRACTICAL',
    'VIVA',
    'PROJECT',
    'ASSIGNMENT',
    'INTERNAL'
);

CREATE TYPE exam_status AS ENUM (
    'DRAFT',
    'SCHEDULED',
    'ONGOING',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE exam_registration_status AS ENUM (
    'REGISTERED',
    'ABSENT',
    'DISQUALIFIED'
);

-- ==========================================
-- EXAMS
-- ==========================================

CREATE TABLE exams (

    exam_id UUID PRIMARY KEY,

    course_offering_id UUID NOT NULL,

    exam_name VARCHAR(255) NOT NULL,

    exam_type exam_type NOT NULL,

    total_marks NUMERIC(8,2) NOT NULL,

    passing_marks NUMERIC(8,2) NOT NULL,

    exam_status exam_status
        NOT NULL DEFAULT 'DRAFT',

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_exam_course_offering
        FOREIGN KEY (course_offering_id)
        REFERENCES course_offerings(course_offering_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_exam_total_marks
        CHECK (total_marks > 0),

    CONSTRAINT chk_exam_passing_marks
        CHECK (
            passing_marks >= 0
            AND passing_marks <= total_marks
        )
);

-- ==========================================
-- EXAM SCHEDULES
-- ==========================================

CREATE TABLE exam_schedules (

    exam_schedule_id UUID PRIMARY KEY,

    exam_id UUID NOT NULL,

    room_id UUID,

    exam_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_exam_schedule_exam
        FOREIGN KEY (exam_id)
        REFERENCES exams(exam_id)
        ON DELETE CASCADE,

        CONSTRAINT uq_exam_schedule
UNIQUE (
    exam_id,
    exam_date
),

    CONSTRAINT fk_exam_schedule_room
        FOREIGN KEY (room_id)
        REFERENCES rooms(room_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_exam_time
        CHECK (end_time > start_time)
);

-- ==========================================
-- EXAM REGISTRATIONS
-- ==========================================

CREATE TABLE exam_registrations (

    exam_registration_id UUID PRIMARY KEY,

    exam_id UUID NOT NULL,

    enrollment_id UUID NOT NULL,

    registration_status exam_registration_status
        NOT NULL DEFAULT 'REGISTERED',

    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_exam_registration
        UNIQUE (
            exam_id,
            enrollment_id
        ),

    CONSTRAINT fk_exam_registration_exam
        FOREIGN KEY (exam_id)
        REFERENCES exams(exam_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_exam_registration_enrollment
        FOREIGN KEY (enrollment_id)
        REFERENCES student_enrollments(enrollment_id)
        ON DELETE RESTRICT
);

-- ==========================================
-- EXAM ATTEMPTS
-- ==========================================

CREATE TABLE exam_attempts (

    exam_attempt_id UUID PRIMARY KEY,

    exam_registration_id UUID NOT NULL,

    attempt_number INTEGER NOT NULL DEFAULT 1,

    marks_obtained NUMERIC(8,2),

    evaluator_id UUID,

    evaluated_at TIMESTAMPTZ,

    remarks TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_exam_attempt_registration
        FOREIGN KEY (exam_registration_id)
        REFERENCES exam_registrations(
            exam_registration_id
        )
        ON DELETE CASCADE,

    CONSTRAINT fk_exam_attempt_evaluator
        FOREIGN KEY (evaluator_id)
        REFERENCES faculty_profiles(faculty_profile_id)
        ON DELETE SET NULL,

    CONSTRAINT uq_exam_attempt
UNIQUE (
    exam_registration_id,
    attempt_number
),

    CONSTRAINT chk_attempt_number
        CHECK (attempt_number > 0),

    CONSTRAINT chk_marks_obtained
        CHECK (
            marks_obtained IS NULL
            OR marks_obtained >= 0
        )
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_exams_course
ON exams(course_offering_id);

CREATE INDEX idx_exams_type
ON exams(exam_type);

CREATE INDEX idx_exam_schedule_date
ON exam_schedules(exam_date);

CREATE INDEX idx_exam_registration_exam
ON exam_registrations(exam_id);

CREATE INDEX idx_exam_registration_enrollment
ON exam_registrations(enrollment_id);

CREATE INDEX idx_exam_attempt_registration
ON exam_attempts(exam_registration_id);

CREATE INDEX idx_exam_schedule_exam
ON exam_schedules(exam_id);

CREATE INDEX idx_exam_attempt_evaluator
ON exam_attempts(evaluator_id);