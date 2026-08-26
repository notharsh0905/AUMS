# AUMS V2 Scope Implementation & Authorization Report

**Report Date**: 2026-08-26  
**Target Milestone**: Phase 1 — Backend Data Scope & Authorization  
**Baseline Git Commit**: `69195e0`  

---

## 1. Existing Data Relationships

The domain relationships mapped across `database/migrations/`, `database/sql/`, and `database/seeds/` confirm full relational integrity in the schema:

1. **Identity & Profiles**:
   - `users(user_id)` $\xrightarrow{1:1}$ `student_profiles(student_profile_id)`
   - `users(user_id)` $\xrightarrow{1:1}$ `faculty_profiles(faculty_profile_id)`
   - `users(user_id)` $\xrightarrow{1:1}$ `parent_profiles(parent_profile_id)`
2. **Academic Scopes**:
   - `institutions` $\rightarrow$ `campuses` $\rightarrow$ `schools` $\rightarrow$ `departments` $\rightarrow$ `programs` $\rightarrow$ `student_enrollments`
   - `faculty_profiles` $\rightarrow$ `departments`
   - `course_offerings` $\rightarrow$ `courses` & `faculty_course_allocations` & `student_course_registrations`
3. **Classroom & Assessments**:
   - `class_sessions` $\rightarrow$ `attendance_records` $\rightarrow$ `student_enrollments`
   - `assignments` $\rightarrow$ `assignment_submissions` $\rightarrow$ `student_enrollments`
   - `course_results`, `semester_results`, `program_results`, `transcripts` $\rightarrow$ `student_enrollments`

---

## 2. Authorization Model

Authorization in AUMS V2 is strictly enforced on two layers:
1. **Permission Layer (Route Middleware)**: Verifies the authenticated caller possesses the necessary permission code (e.g. `students.read`, `attendance.read`, `transcripts.read`) via `RequirePermission`.
2. **Resource Scope Layer (Repository & Service)**: Enforces row-level isolation based on caller identity (`user_id`) and assigned role:
   - **`STUDENT`**: Restricted to own records (`sp.user_id = caller_id`, `ar.enrollment_id`, own transcripts).
   - **`PARENT`**: Restricted strictly to verified linked children resolved through `parent_profiles` $\rightarrow$ `student_parent_relationships`.
   - **`FACULTY`**: Scoped to assigned course offerings, sections, and department rosters.
   - **`HOD` / `DEAN`**: Scoped to department and school academic units.
   - **`SUPER_ADMIN` / `INSTITUTION_ADMIN`**: Retains unrestricted global administrative oversight.

---

## 3. Endpoints Changed & Enforced

| Endpoint | Method | Scope Rule Implemented | Before Behavior | After Behavior |
|---|---|---|---|---|
| `/students` | `GET` | Caller Role & Identity Scoping | Returned all students in DB | `STUDENT` receives only self; `PARENT` receives only linked wards; `SUPER_ADMIN` receives full paginated directory |
| `/parents/wards` | `GET` | Parent-Child Relation Lookup | Non-existent (mocked in UI) | Live query resolving wards linked via `student_parent_relationships` |
| `/parents/me` | `GET` | Parent Profile Lookup | Non-existent | Live parent profile for authenticated parent |
| `/attendance` | `GET` | Caller Role Scoping | Returned all attendance records | `STUDENT` receives only own session records; `PARENT` receives only ward records; `ADMIN` receives institutional records |
| `/transcripts/:student_id` | `GET` | Transcript Ownership Guard | Any student UUID could be read | Enforces `CanAccessStudent`: peer students receive `403 Forbidden`; only self, linked parent, or faculty/admin can view |
| `/transcripts/:student_id/summary` | `GET` | CGPA Summary Guard | Any student CGPA could be read | Enforces `CanAccessStudent` (403 on unauthorized access) |
| `/transcripts/:student_id/semesters` | `GET` | Semesters Guard | Any student SGPA could be read | Enforces `CanAccessStudent` (403 on unauthorized access) |
| `/transcripts/:student_id/courses` | `GET` | Course Breakdown Guard | Any student marks could be read | Enforces `CanAccessStudent` (403 on unauthorized access) |

---

## 4. Database Changes & Parent Relationship Status

- **Database Schema**: No migration modifications were required. Table schemas for `parent_profiles` and `student_parent_relationships` already existed in `database/migrations/000007_parents.up.sql` and `database/sql/007_parents.sql`.
- **Demo Seed Data**: Updated `database/seeds/014_demo_profiles.sql` to populate `parent_profiles` and link `parent1@aums.edu` $\rightarrow$ `student1@aums.edu`, `student2@aums.edu` and `parent2@aums.edu` $\rightarrow$ `student3@aums.edu`.
- **Backend Parent Module**: Created `backend/internal/parents/` (`repository.go`, `service.go`, `handler.go`, `routes.go`, `dto.go`) and registered routes in `backend/pkg/server/server.go`.

---

## 5. Security & Automated Tests Performed

- **Unit Tests**:
  - `backend/internal/transcripts/service_test.go`: Verified `CanAccessStudent` allows global access for `SUPER_ADMIN` and isolates student identities.
  - `backend/internal/students/service_test.go`: Verified student scoping logic.
- **Go Build & Verification**:
  - `go fmt ./...` — PASS
  - `go vet ./...` — PASS
  - `go test ./...` — PASS (All tests passing)
  - `go build ./...` — PASS (0 compiler warnings or errors)

---

## 6. Classification & Final Verdict

| Category | Item | Status |
|---|---|---|
| Security | Student Profile Row-Level Scoping | 🟢 PASS |
| Security | Attendance Record Row-Level Scoping | 🟢 PASS |
| Security | Transcript & Grade Row-Level Scoping | 🟢 PASS |
| Architecture | Parent-Child Backend Relational API | 🟢 PASS |
| Architecture | Go Repository $\rightarrow$ Service $\rightarrow$ Handler | 🟢 PASS |
| Regression | Core API compilation and tests | 🟢 PASS |

### **FINAL VERDICT**
# 🟢 **PHASE 1 COMPLETE**
