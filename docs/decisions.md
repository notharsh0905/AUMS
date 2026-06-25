# AUMS Architecture Decisions Log

This document records all major architectural and technical decisions made during the development of AUMS.

The purpose of this document is to preserve the reasoning behind important choices so future development remains consistent and maintainable.

---

# Decision #1: AUMS Will Support Multiple Institution Types

Date: Initial Architecture Phase

Status: Approved

Decision:

AUMS will support:

* Schools
* Colleges
* Universities

Reason:

Building exclusively for universities would create limitations in the future.

By designing the platform around institution types, the same system can be used by multiple educational organizations without redesigning the database.

Impact:

* Academic structure must be flexible.
* Institution configuration becomes mandatory.
* Future scalability increases significantly.

---

# Decision #2: Multi-Tenant Architecture

Date: Initial Architecture Phase

Status: Approved

Decision:

AUMS will support multiple institutions within a single platform.

Example:

* CSJMU
* PSIT
* DPS School
* Future Institutions

Reason:

The platform should evolve into an Education Operating System rather than a single university ERP.

Impact:

* Every major record must belong to an institution.
* Institution isolation must be enforced.
* Permissions must respect institution boundaries.

---

# Decision #3: Department Autonomy with Central Governance

Date: Initial Architecture Phase

Status: Approved

Decision:

Departments operate independently while remaining under institutional governance.

Examples:

* Computer Science
* Electronics
* Management
* Law
* Medical

Reason:

Departments often manage their own faculty, subjects, events, notices, and workflows.

Impact:

* Department-level administration required.
* Separate departmental dashboards required.
* Department-specific analytics required.

---

# Decision #4: Role-Based Access Control (RBAC)

Date: Initial Architecture Phase

Status: Approved

Decision:

AUMS will use Role-Based Access Control.

Roles:

* Student
* Faculty
* Parent
* Alumni
* HOD
* Dean
* Registrar
* Admin
* Super Admin

Permissions will control actions rather than hardcoding roles.

Reason:

RBAC is scalable and flexible.

Impact:

* Roles table required.
* Permissions table required.
* Role-Permission mapping required.

---

# Decision #5: Lifelong Digital Identity

Date: Initial Architecture Phase

Status: Approved

Decision:

Users retain a single account throughout their relationship with an institution.

Example:

Student
→ Alumni
→ Mentor
→ Recruiter

Reason:

Identity should remain permanent while roles evolve.

Impact:

* Master users table required.
* Role assignment becomes dynamic.
* Alumni migration becomes unnecessary.

---

# Decision #6: User Master Table with Profile Tables

Date: Initial Architecture Phase

Status: Approved

Decision:

AUMS will use:

users (master table)

and separate profile tables:

* student_profiles
* faculty_profiles
* parent_profiles
* alumni_profiles

Reason:

Shared information belongs in users.

Role-specific information belongs in profile tables.

Impact:

* Cleaner database design.
* Easier future expansion.

---

# Decision #7: Existing Alumni Onboarding

Date: Initial Architecture Phase

Status: Approved

Decision:

AUMS will support alumni who graduated before the platform existed.

Reason:

Universities already have large alumni networks.

Impact:

* Alumni import system required.
* Alumni claim workflow required.
* Alumni verification workflow required.

---

# Decision #8: Session-Based Attendance

Date: Initial Architecture Phase

Status: Approved

Decision:

Attendance will be recorded per session rather than per day.

Examples:

09:00 – DBMS

10:00 – Operating Systems

11:00 – Lab

Reason:

More accurate and reflects real institutional operations.

Impact:

* Timetable integration required.
* Attendance records increase significantly.

---

# Decision #9: Manual + AI Assisted Timetable Generation

Date: Initial Architecture Phase

Status: Approved

Decision:

Timetables are created manually but AI can provide suggestions and detect conflicts.

Reason:

Human control remains necessary while AI reduces workload.

Impact:

* Timetable engine required.
* Conflict detection engine required.
* Future optimization module possible.

---

# Decision #10: Technology Stack

Date: Initial Architecture Phase

Status: Approved

Frontend:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui

Backend:

* Go
* Gin Framework

Database:

* PostgreSQL

AI:

* Python
* FastAPI
* Scikit-Learn

Reason:

Provides a balance of performance, maintainability, scalability, and learning value.

---

# Decision #11: Development Strategy

Date: Initial Architecture Phase

Status: Approved

Decision:

Build AUMS as a Modular Monolith initially.

Future migration to microservices remains possible.

Reason:

Reduces complexity while preserving scalability.

Impact:

* Faster development.
* Easier debugging.
* Better learning experience.

---

# Decision #12

Students may belong to multiple institutions/programs.

# Decision #13

Admission Workflow will be included.

# Decision #14

Student Documents will be managed by AUMS.

# Decision #15

Students may enroll in multiple programs.

# Decision #16

Academic history is preserved permanently.

---

# Decision #17: UUID v7

Status: Approved

Decision:
All primary keys will use UUID v7.

Reason:

* Time ordered
* Better indexing performance
* Better scalability
* Modern database standard
* Suitable for distributed systems

Impact:

All major tables use UUID v7
Better PostgreSQL performance compared to UUID v4

# Decision #18: File Storage Architecture

Status: Approved

Decision:
Files will not be stored directly in PostgreSQL.

Architecture:

File Storage (MinIO/S3)
+
Database Metadata

Reason:

* Better scalability
* Better performance
* Easier backup management
* Suitable for large files

Impact:
All uploaded content will use the File Storage Domain.

Examples:

* Assignments
* Certificates
* Marksheets
* Medical Certificates
* Research Papers
* Images

---

# Decision #19 (Updated)

Status: Approved

Decision

AUMS will use:

One Database Per Institution

Example:

CSJMU
└── csjmu_db

PSIT
└── psit_db

DPS
└── dps_db

Instead of:

aums_db
├── CSJMU
├── PSIT
└── DPS

---

# Decision #20

Database Isolation Model

Approved.

AUMS Core Database
+Separate PostgreSQL Database Per Institution

---

# Decision #21: Migration Strategy

Status: Approved

Decision

AUMS will use:

Raw SQL Migrations

instead of:

ORM Auto Migrations

---

# Decision #22: Unified User Experience

AUMS will have:

One Login
↓
One Dashboard
↓
Role-Based Navigation
↓
Access To Relevant Modules

Instead of:

Student Portal

Faculty Portal

Parent Portal

Alumni Portal

Admin Portal

E-Office Portal

as completely separate applications.

---

# Decision #23: API Architecture

Status: Approved

Decision

AUMS will use:

REST API

Initial architecture:

Frontend (Next.js)

↓

REST API (Go + Gin)

↓

PostgreSQL

---

# Decision #24: Identity Architecture
Status: Approved

Decision

AUMS will use a Master Users Table.

All authenticated persons will exist in the users table.

Examples:

* Student
* Faculty
* Parent
* Alumni
* Registrar
* HOD
* Dean
* Admin

Role-specific data will be stored in profile tables.

Reason

Provides a single identity source of truth.

Impact

* users table required
* RBAC becomes centralized
* Lifelong identity becomes possible

---

# Decision #25: Role-Permission Authorization Model
Status: Approved

Decision

Authorization will use:

Users

↓

Roles

↓

Permissions

Architecture:

* users
* user_roles
* roles
* role_permissions
* permissions

Reason

Permissions are more scalable than hardcoded roles.

Impact

Fine-grained access control across all modules.

---

# Decision #26: Session Management
Status: Approved

Decision

AUMS will maintain server-side user sessions.

Session metadata will be stored in user_sessions.

Reason

Supports:

* Web
* Mobile
* AI Assistant
* Future SSO

Impact

user_sessions table required.

---

# Decision #27: Soft Delete Policy
Status: Approved

Decision

Major business entities will use soft deletion.

Implementation:

deleted_at TIMESTAMPTZ

Reason

Educational records must be preserved.

Impact

Users, Students, Faculty, Alumni, Academic Records and other critical entities will not be physically deleted.

---

# Decision #28: Academic Hierarchy Structure
Status: Approved

Decision

AUMS will use the following academic hierarchy:

Institution

↓

School

↓

Department

↓

Program


Examples:

School of Engineering

↓

Computer Science Department

↓

### B.Tech Computer Science

School of Management

↓

MBA Program

Reason

Provides flexibility for universities, colleges, and schools.

Impact

* schools table required
* departments table required
* programs table required

---

# Decision #29: Student Domain Architecture
Status: Approved

Decision

Student information will be split into:

* student_profiles
* student_enrollments
* student_documents
* student_guardians
* student_status_history

Reason

A student may:

*  Enroll in multiple programs
*  Change programs
*  Graduate
*  Become alumni

Academic history must never be lost.

Impact

Student records become enrollment-based instead of program-based.

---

# Decision #30: Institution Database Isolation
Status: Approved

Decision

Institution databases will not store institution_id
in most business tables.

Reason

Each institution owns a dedicated PostgreSQL database.

Examples

csjmu_db
psit_db
dps_db

Therefore institution ownership is already implied.

Impact

* Reduces redundancy.
* Smaller indexes.
* Cleaner schema.
* Better performance.

---

# Decision #31: Enrollment-Centric Academic Architecture

Status: Approved

Decision

Academic activities will be linked to student_enrollments
instead of student_profiles.

Examples:

* Attendance
* Assignments
* Examinations
* Results
* Course Registrations

Reason

A student may have multiple enrollments across
multiple programs.

Examples:

Student

├── B.Tech CSE

└── MBA

Academic records belong to a specific enrollment,
not to the student identity.

Impact

All academic domains must reference:

student_enrollments.enrollment_id

instead of:

student_profiles.student_profile_id

---

# Decision #32: Parent Users Are First-Class Citizens
Status: Approved

Decision

Parents will have user accounts and login access.

Architecture

users

   ↓

parent_profiles

↓

student_parent_relationships

Reason

Parents need access to:

* Attendance
* Results
* Notifications
* Leave Requests
* Fee Information

Impact

student_guardians table deprecated.

Parent relationships handled through:

parent_profiles
student_parent_relationships

---

# Decision #33: Credit-Based Academic System

Status: Approved

Decision

AUMS will use a credit-based academic model.

Architecture

Program

    ↓

Curriculum

    ↓

Course

    ↓

Course Offering

    ↓

Student Registration

Reason

Supports:

* AKTU
* CSJMU
* CBCS
* NEP
* International Universities

Impact
* Attendance
* Assignments
* Examinations
* Results

all depend on course_offerings.
Decision #34: Session-Based Attendance Architecture
Status: Approved

Decision

Attendance will be recorded against actual class sessions
instead of timetable templates.

Architecture

Timetable Entry
      ↓
Class Session
      ↓
Attendance Record

Reason

Supports:

*  Cancellations
*  Rescheduling
*  Extra Classes
*  Faculty Substitutions

Impact

attendance_records reference class_sessions.

---

# Decision #35: Result Processing Architecture
Status: Approved

Decision

Results will be processed in multiple stages.

Exam Attempts

      ↓

Course Results

      ↓

Semester Results

      ↓

Program Results

      ↓
      
Transcript

Reason

Supports SGPA, CGPA, transcripts,
backlogs, and degree completion.

Impact

Result calculations remain independent
from examination execution.

---

# Decision #36: Event-Driven Notification Architecture

Status: Approved

Decision

AUMS notifications will be event-driven.

Architecture:

Notification Event
↓
Notification
↓
Delivery Channel

Supported Channels:

* In-App
* Email
* SMS

Future Channels:

* Push Notifications
* WhatsApp

Reason

Separates business events from delivery mechanisms.

Impact

Notification system becomes scalable and extensible.

---

# Decision #36: Event-Driven Notification Architecture
Status: Approved

---

# Decision #37: Immutable Audit Architecture

Status: Approved

Decision

All critical user and system actions must be recorded in audit logs.

Audit records are append-only and should never be physically deleted.

Reason

Provides:

* Accountability
* Security
* Compliance
* Investigation Support

Impact

Every major domain must generate audit events.

---

# Decision #38: JSONB Audit Snapshots

Status: Approved

Decision

Audit logs will store before and after values using PostgreSQL JSONB.

Architecture

old_values JSONB

new_values JSONB

Reason

Allows tracking of entity changes without creating audit tables for every domain.

Impact

Audit system remains generic and scalable.

---

# Decision #39: External Object Storage Architecture

Status: Approved

Decision

Files will be stored in object storage rather than PostgreSQL.

Architecture

MinIO / S3
+
Metadata Database

Reason

* Better scalability
* Better performance
* Easier backup strategy
* Supports large files

Impact

Database stores metadata only.

Physical files remain in object storage.

---

# Decision #40: Analytics as AI Foundation

Status: Approved

Decision

Analytics will act as the data foundation for AI systems.

Architecture

Operational Data
↓
Analytics
↓
AI Models

Reason

AI models should not directly query operational tables.

Impact

Student Risk Prediction

Placement Prediction

Attendance Forecasting

Performance Analysis

will consume analytics data.

---

# Decision #41: Configuration-Driven Platform

Status: Approved

Decision

AUMS behavior should be controlled through configuration rather than source code changes.

Architecture

Platform Settings
+
Institution Settings
+
Feature Flags

Reason

Allows institutions to customize behavior without modifying application code.

Impact

New configuration options can be added without redeploying the platform.

---

# Decision #42: Migration Validation Policy

Status: Approved

Decision

All schema changes must be validated through full migration execution on a clean PostgreSQL database before being accepted.

Validation Requirements

* Fresh database creation
* Full migration execution
* Foreign key validation
* Index validation
* Rollback validation (future)

Reason

Database correctness must be proven through execution rather than design review alone.

Impact

No migration may be merged without successful execution testing.

---

# Decision #43

SUPER_ADMIN receives all permissions.

Reason:
Avoid manual maintenance.

Status:
Accepted

---

# Decision #44

INSTITUTION_ADMIN receives all permissions except platform governance permissions.

Status:
Accepted

---

# Decision #45

Feature Flags are only used for optional modules.

Core academic modules are never feature flags.

Status:
Accepted

---

# Decision #46

Soft delete strategy uses deleted_at.

Status:
Accepted

---

# Future Decisions

The following topics remain undecided:

* Result Processing Engine
* E-Office Architecture
* Notification Architecture
* Analytics Architecture
* AI Architecture
* Blockchain Architecture
* Deployment Architecture
