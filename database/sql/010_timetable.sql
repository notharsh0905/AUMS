-- ==========================================
-- AUMS TIMETABLE DOMAIN
-- ==========================================

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE day_of_week AS ENUM (
'MONDAY',
'TUESDAY',
'WEDNESDAY',
'THURSDAY',
'FRIDAY',
'SATURDAY',
'SUNDAY'
);

CREATE TYPE timetable_entry_type AS ENUM (
'LECTURE',
'LAB',
'TUTORIAL',
'SEMINAR',
'WORKSHOP'
);

-- ==========================================
-- TIME SLOTS
-- ==========================================

CREATE TABLE time_slots (


time_slot_id UUID PRIMARY KEY,

slot_name VARCHAR(100) NOT NULL,

start_time TIME NOT NULL,

end_time TIME NOT NULL,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

CONSTRAINT chk_time_slot
    CHECK (end_time > start_time),

CONSTRAINT uq_time_slot
    UNIQUE (start_time, end_time)


);

-- ==========================================
-- WORKING DAYS
-- ==========================================

CREATE TABLE working_days (


working_day_id UUID PRIMARY KEY,

day_name day_of_week NOT NULL,

is_working_day BOOLEAN NOT NULL DEFAULT TRUE,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

CONSTRAINT uq_working_day
    UNIQUE (day_name)


);

-- ==========================================
-- TIMETABLES
-- ==========================================

CREATE TABLE timetables (


timetable_id UUID PRIMARY KEY,

timetable_name VARCHAR(255) NOT NULL,

academic_year_id UUID NOT NULL,

semester_id UUID NOT NULL,

effective_from DATE NOT NULL,

effective_to DATE,

is_active BOOLEAN NOT NULL DEFAULT TRUE,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

deleted_at TIMESTAMPTZ,

CONSTRAINT chk_timetable_dates
    CHECK (
        effective_to IS NULL
        OR effective_to >= effective_from
    ),

CONSTRAINT fk_timetable_year
    FOREIGN KEY (academic_year_id)
    REFERENCES academic_years(academic_year_id)
    ON DELETE RESTRICT,

CONSTRAINT fk_timetable_semester
    FOREIGN KEY (semester_id)
    REFERENCES semesters(semester_id)
    ON DELETE RESTRICT


);

-- ==========================================
-- TIMETABLE ENTRIES
-- ==========================================

CREATE TABLE timetable_entries (


timetable_entry_id UUID PRIMARY KEY,

timetable_id UUID NOT NULL,

course_offering_id UUID NOT NULL,

faculty_profile_id UUID NOT NULL,

room_id UUID NOT NULL,

working_day_id UUID NOT NULL,

time_slot_id UUID NOT NULL,

entry_type timetable_entry_type NOT NULL,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

CONSTRAINT uq_timetable_slot
    UNIQUE (
        timetable_id,
        working_day_id,
        time_slot_id,
        room_id
    ),

CONSTRAINT uq_faculty_schedule
    UNIQUE (
        faculty_profile_id,
        working_day_id,
        time_slot_id
    ),

CONSTRAINT uq_course_schedule
    UNIQUE (
        course_offering_id,
        working_day_id,
        time_slot_id
    ),

CONSTRAINT fk_tt_entry_timetable
    FOREIGN KEY (timetable_id)
    REFERENCES timetables(timetable_id)
    ON DELETE CASCADE,

CONSTRAINT fk_tt_entry_course
    FOREIGN KEY (course_offering_id)
    REFERENCES course_offerings(course_offering_id)
    ON DELETE RESTRICT,

CONSTRAINT fk_tt_entry_faculty
    FOREIGN KEY (faculty_profile_id)
    REFERENCES faculty_profiles(faculty_profile_id)
    ON DELETE RESTRICT,

CONSTRAINT fk_tt_entry_room
    FOREIGN KEY (room_id)
    REFERENCES rooms(room_id)
    ON DELETE RESTRICT,

CONSTRAINT fk_tt_entry_day
    FOREIGN KEY (working_day_id)
    REFERENCES working_days(working_day_id)
    ON DELETE RESTRICT,

CONSTRAINT fk_tt_entry_slot
    FOREIGN KEY (time_slot_id)
    REFERENCES time_slots(time_slot_id)
    ON DELETE RESTRICT


);

-- ==========================================
-- FACULTY AVAILABILITY
-- ==========================================

CREATE TABLE faculty_availability (


faculty_availability_id UUID PRIMARY KEY,

faculty_profile_id UUID NOT NULL,

working_day_id UUID NOT NULL,

time_slot_id UUID NOT NULL,

is_available BOOLEAN NOT NULL DEFAULT TRUE,

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

CONSTRAINT uq_faculty_availability
    UNIQUE (
        faculty_profile_id,
        working_day_id,
        time_slot_id
    ),

CONSTRAINT fk_faculty_availability_faculty
    FOREIGN KEY (faculty_profile_id)
    REFERENCES faculty_profiles(faculty_profile_id)
    ON DELETE CASCADE,

CONSTRAINT fk_faculty_availability_day
    FOREIGN KEY (working_day_id)
    REFERENCES working_days(working_day_id)
    ON DELETE RESTRICT,

CONSTRAINT fk_faculty_availability_slot
    FOREIGN KEY (time_slot_id)
    REFERENCES time_slots(time_slot_id)
    ON DELETE RESTRICT


);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_timetable_entries_timetable
ON timetable_entries(timetable_id);

CREATE INDEX idx_timetable_entries_course
ON timetable_entries(course_offering_id);

CREATE INDEX idx_timetable_entries_faculty
ON timetable_entries(faculty_profile_id);

CREATE INDEX idx_timetable_entries_room
ON timetable_entries(room_id);

CREATE INDEX idx_timetable_entries_day
ON timetable_entries(working_day_id);

CREATE INDEX idx_timetable_entries_slot
ON timetable_entries(time_slot_id);

CREATE INDEX idx_faculty_availability_faculty
ON faculty_availability(faculty_profile_id);
