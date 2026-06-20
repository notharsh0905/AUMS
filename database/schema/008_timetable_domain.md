# Timetable Domain

## Purpose

The Timetable Domain is responsible for scheduling and managing all academic activities within an institution.

This domain coordinates:

* Classes
* Faculty
* Subjects
* Rooms
* Laboratories
* Academic Sessions
* Timetables

The timetable acts as the operational backbone of daily academic activities.

Every attendance record, assignment, examination, and faculty workload calculation depends on this domain.

---

# Core Principles

## Session-Based Scheduling

AUMS uses session-based scheduling.

Examples:

09:00 - 10:00

10:00 - 11:00

11:00 - 12:00

Each session is independently tracked.

---

## Manual + AI Assisted Scheduling

Timetables can be:

* Created manually
* Optimized by AI
* Validated automatically

Human approval is always required.

---

## Conflict-Free Scheduling

The system must prevent:

* Faculty conflicts
* Room conflicts
* Subject conflicts
* Student conflicts

---

## Institution Flexibility

Supports:

* Schools
* Colleges
* Universities

---

# Scheduling Hierarchy

Institution
↓
Academic Year
↓
Academic Term
↓
Program
↓
Academic Level
↓
Timetable
↓
Sessions

---

# Tables

## room_types

Purpose:

Defines room categories.

Examples:

* Classroom
* Laboratory
* Seminar Hall
* Auditorium
* Conference Room

Fields:

* id
* name
* description

---

## rooms

Purpose:

Stores physical room information.

Fields:

* id
* institution_id
* campus_id
* room_type_id
* room_number
* room_name
* capacity
* floor
* building_name
* status

Status:

* ACTIVE
* UNDER_MAINTENANCE
* CLOSED

---

## academic_sessions

Purpose:

Defines individual teaching periods.

Examples:

09:00 - 10:00

10:00 - 11:00

Fields:

* id
* institution_id
* session_name
* start_time
* end_time
* session_order

---

## timetables

Purpose:

Represents a timetable structure.

Fields:

* id
* institution_id
* academic_year_id
* academic_term_id
* program_id
* academic_level_id
* status
* created_by
* created_at

Status:

* DRAFT
* ACTIVE
* ARCHIVED

---

## timetable_entries

Purpose:

Stores actual timetable schedules.

Fields:

* id
* timetable_id
* subject_offering_id
* faculty_id
* room_id
* academic_session_id
* day_of_week
* entry_type
* created_at

Days:

* MONDAY
* TUESDAY
* WEDNESDAY
* THURSDAY
* FRIDAY
* SATURDAY
* SUNDAY

Entry Types:

* THEORY
* LAB
* TUTORIAL
* SEMINAR

---

## faculty_availability

Purpose:

Stores faculty availability preferences.

Fields:

* id
* faculty_id
* day_of_week
* academic_session_id
* availability_status

Status:

* AVAILABLE
* UNAVAILABLE
* PREFERRED

---

## room_bookings

Purpose:

Tracks special room reservations.

Examples:

* Workshops
* Events
* Guest Lectures

Fields:

* id
* room_id
* booking_title
* booking_date
* start_time
* end_time
* booked_by
* status

---

## timetable_conflicts

Purpose:

Stores detected scheduling conflicts.

Examples:

Faculty assigned twice.

Room assigned twice.

Fields:

* id
* timetable_entry_id
* conflict_type
* conflict_description
* detected_at
* resolved_at

Conflict Types:

* FACULTY_CONFLICT
* ROOM_CONFLICT
* SESSION_CONFLICT
* SUBJECT_CONFLICT

---

## timetable_versions

Purpose:

Maintains timetable history.

Fields:

* id
* timetable_id
* version_number
* created_by
* created_at
* change_summary

Purpose:

Supports rollback and auditing.

---

## timetable_templates

Purpose:

Stores reusable timetable templates.

Examples:

* Engineering Semester Template
* MBA Template
* School Template

Fields:

* id
* institution_id
* template_name
* description

---

# AI Timetable Support

## timetable_generation_requests

Purpose:

Stores AI timetable generation requests.

Fields:

* id
* institution_id
* academic_term_id
* request_status
* generated_at

Status:

* PENDING
* PROCESSING
* COMPLETED
* FAILED

---

## timetable_generation_constraints

Purpose:

Stores timetable generation rules.

Examples:

No more than 3 continuous classes.

Lunch between 1 PM and 2 PM.

Labs require 2 consecutive sessions.

Fields:

* id
* institution_id
* constraint_name
* constraint_value

---

## timetable_ai_recommendations

Purpose:

Stores AI-generated recommendations.

Examples:

Suggested faculty allocation.

Suggested room changes.

Suggested workload balancing.

Fields:

* id
* timetable_id
* recommendation_type
* recommendation_text
* generated_at

---

# Timetable Domain Relationships

Institution
↓
Room

Institution
↓
Academic Session

Timetable
↓
Timetable Entry

Timetable Entry
↓
Faculty

Timetable Entry
↓
Subject

Timetable Entry
↓
Room

Timetable Entry
↓
Session

---

# Conflict Detection

The system must automatically detect:

Faculty Conflict

Example:

Professor assigned to two rooms simultaneously.

---

Room Conflict

Example:

Room 301 assigned to two classes at the same time.

---

Session Conflict

Example:

Student group assigned multiple subjects simultaneously.

---

# Future Features

* AI Timetable Generation
* Automatic Room Optimization
* Faculty Workload Balancing
* Smart Resource Allocation
* Holiday-Aware Scheduling
* Multi-Campus Scheduling
* Event Conflict Detection
* AI Timetable Assistant
