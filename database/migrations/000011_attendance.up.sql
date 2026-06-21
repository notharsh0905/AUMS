-- ==========================================
-- AUMS ATTENDANCE DOMAIN
-- ==========================================

CREATE TYPE attendance_status AS ENUM (
'PRESENT',
'ABSENT',
'LATE',
'EXCUSED'
);

CREATE TYPE session_status AS ENUM (
'SCHEDULED',
'COMPLETED',
'CANCELLED',
'RESCHEDULED'
);

-- ==========================================
-- CLASS SESSIONS
-- ==========================================

CREATE TABLE class_sessions (

```
class_session_id UUID PRIMARY KEY,

timetable_entry_id UUID NOT NULL,

session_date DATE NOT NULL,

start_time TIME NOT NULL,

end_time TIME NOT NULL,

session_status session_status
    NOT NULL DEFAULT 'SCHEDULED',

conducted_by UUID,

remarks TEXT,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

CONSTRAINT uq_class_session
    UNIQUE (
        timetable_entry_id,
        session_date
    ),

CONSTRAINT chk_session_time
    CHECK (
        end_time > start_time
    ),

CONSTRAINT fk_session_timetable
    FOREIGN KEY (timetable_entry_id)
    REFERENCES timetable_entries(timetable_entry_id)
    ON DELETE RESTRICT,

CONSTRAINT fk_session_faculty
    FOREIGN KEY (conducted_by)
    REFERENCES faculty_profiles(faculty_profile_id)
    ON DELETE SET NULL
```

);

-- ==========================================
-- ATTENDANCE RECORDS
-- ==========================================

CREATE TABLE attendance_records (

```
attendance_record_id UUID PRIMARY KEY,

class_session_id UUID NOT NULL,

enrollment_id UUID NOT NULL,

attendance_status attendance_status
    NOT NULL,

marked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

marked_by UUID,

remarks TEXT,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

CONSTRAINT uq_session_student
    UNIQUE (
        class_session_id,
        enrollment_id
    ),

CONSTRAINT fk_attendance_session
    FOREIGN KEY (class_session_id)
    REFERENCES class_sessions(class_session_id)
    ON DELETE CASCADE,

CONSTRAINT fk_attendance_enrollment
    FOREIGN KEY (enrollment_id)
    REFERENCES student_enrollments(enrollment_id)
    ON DELETE RESTRICT,

CONSTRAINT fk_attendance_marked_by
    FOREIGN KEY (marked_by)
    REFERENCES faculty_profiles(faculty_profile_id)
    ON DELETE SET NULL
```

);

-- ==========================================
-- ATTENDANCE EXCEPTIONS
-- ==========================================

CREATE TABLE attendance_exceptions (

```
attendance_exception_id UUID PRIMARY KEY,

enrollment_id UUID NOT NULL,

class_session_id UUID,

exception_reason VARCHAR(255) NOT NULL,

approved_by UUID,

approved_at TIMESTAMPTZ,

remarks TEXT,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

CONSTRAINT fk_exception_enrollment
    FOREIGN KEY (enrollment_id)
    REFERENCES student_enrollments(enrollment_id)
    ON DELETE CASCADE,

CONSTRAINT fk_exception_session
    FOREIGN KEY (class_session_id)
    REFERENCES class_sessions(class_session_id)
    ON DELETE CASCADE,

CONSTRAINT fk_exception_approved_by
    FOREIGN KEY (approved_by)
    REFERENCES faculty_profiles(faculty_profile_id)
    ON DELETE SET NULL
```

);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_class_sessions_date
ON class_sessions(session_date);

CREATE INDEX idx_class_sessions_timetable
ON class_sessions(timetable_entry_id);

CREATE INDEX idx_attendance_records_enrollment
ON attendance_records(enrollment_id);

CREATE INDEX idx_attendance_records_session
ON attendance_records(class_session_id);

CREATE INDEX idx_attendance_records_status
ON attendance_records(attendance_status);

CREATE INDEX idx_attendance_exceptions_enrollment
ON attendance_exceptions(enrollment_id);

CREATE INDEX idx_attendance_exceptions_session
ON attendance_exceptions(class_session_id);
