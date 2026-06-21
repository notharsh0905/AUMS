-- ==========================================
-- AUMS ASSIGNMENT DOMAIN
-- ==========================================

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE assignment_status AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'CLOSED',
    'ARCHIVED'
);

CREATE TYPE submission_status AS ENUM (
    'SUBMITTED',
    'LATE_SUBMISSION',
    'NOT_SUBMITTED'
);

-- ==========================================
-- ASSIGNMENTS
-- ==========================================

CREATE TABLE assignments (

    assignment_id UUID PRIMARY KEY,

    course_offering_id UUID NOT NULL,

    faculty_profile_id UUID NOT NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    total_marks NUMERIC(8,2) NOT NULL,

    publish_at TIMESTAMPTZ,

    due_at TIMESTAMPTZ NOT NULL,

    assignment_status assignment_status
        NOT NULL DEFAULT 'DRAFT',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_assignment_course_offering
        FOREIGN KEY (course_offering_id)
        REFERENCES course_offerings(course_offering_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_assignment_faculty
        FOREIGN KEY (faculty_profile_id)
        REFERENCES faculty_profiles(faculty_profile_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_assignment_marks
        CHECK (total_marks > 0)
);

-- ==========================================
-- ASSIGNMENT ATTACHMENTS
-- ==========================================

CREATE TABLE assignment_attachments (

    assignment_attachment_id UUID PRIMARY KEY,

    assignment_id UUID NOT NULL,

    file_id UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_assignment_attachment_assignment
        FOREIGN KEY (assignment_id)
        REFERENCES assignments(assignment_id)
        ON DELETE CASCADE
);

-- ==========================================
-- ASSIGNMENT SUBMISSIONS
-- ==========================================

CREATE TABLE assignment_submissions (

    assignment_submission_id UUID PRIMARY KEY,

    assignment_id UUID NOT NULL,

    enrollment_id UUID NOT NULL,

    submission_status submission_status
        NOT NULL DEFAULT 'SUBMITTED',

    submitted_at TIMESTAMPTZ,

    remarks TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_assignment_submission
        UNIQUE (
            assignment_id,
            enrollment_id
        ),

    CONSTRAINT fk_submission_assignment
        FOREIGN KEY (assignment_id)
        REFERENCES assignments(assignment_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_submission_enrollment
        FOREIGN KEY (enrollment_id)
        REFERENCES student_enrollments(enrollment_id)
        ON DELETE RESTRICT
);

-- ==========================================
-- SUBMISSION ATTACHMENTS
-- ==========================================

CREATE TABLE submission_attachments (

    submission_attachment_id UUID PRIMARY KEY,

    assignment_submission_id UUID NOT NULL,

    file_id UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_submission_attachment_submission
        FOREIGN KEY (assignment_submission_id)
        REFERENCES assignment_submissions(
            assignment_submission_id
        )
        ON DELETE CASCADE
);

-- ==========================================
-- ASSIGNMENT GRADES
-- ==========================================

CREATE TABLE assignment_grades (

    assignment_grade_id UUID PRIMARY KEY,

    assignment_submission_id UUID NOT NULL,

    evaluated_by UUID NOT NULL,

    marks_awarded NUMERIC(8,2) NOT NULL,

    feedback TEXT,

    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_assignment_grade
        UNIQUE (assignment_submission_id),

    CONSTRAINT fk_assignment_grade_submission
        FOREIGN KEY (assignment_submission_id)
        REFERENCES assignment_submissions(
            assignment_submission_id
        )
        ON DELETE CASCADE,

    CONSTRAINT fk_assignment_grade_faculty
        FOREIGN KEY (evaluated_by)
        REFERENCES faculty_profiles(faculty_profile_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_assignment_grade_marks
        CHECK (marks_awarded >= 0)
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_assignments_course
ON assignments(course_offering_id);

CREATE INDEX idx_assignments_faculty
ON assignments(faculty_profile_id);

CREATE INDEX idx_assignments_due_date
ON assignments(due_at);

CREATE INDEX idx_assignment_submissions_assignment
ON assignment_submissions(assignment_id);

CREATE INDEX idx_assignment_submissions_enrollment
ON assignment_submissions(enrollment_id);

CREATE INDEX idx_assignment_grades_submission
ON assignment_grades(assignment_submission_id);