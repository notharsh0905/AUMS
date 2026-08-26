# AUMS V2 Endpoint Authorization Audit

**Audit Target**: Go Backend Endpoints (`/backend/internal/` & `/backend/pkg/server/server.go`)  
**Scope**: Authentication, Permission Code, Current Query Scope, Multi-Tenant Scoping Gaps, and Privilege Escalation Risks.

---

## 1. Comprehensive Endpoint Scope Matrix

| Endpoint | HTTP Method | Auth Required | Required Permission | Current Server Guard | Current Backend SQL Scope | Can Access Other User's Data? | Can Modify Other User's Data? | Server-Side Scope Enforced? | Privilege Escalation Risk |
|---|---|---|---|---|---|---|---|---|---|
| `/students` | `GET` | Yes | `students.read` | `RequirePermission("students.read")` | `SELECT * FROM student_profiles LIMIT $1 OFFSET $2` | 🔴 YES (Returns all students in DB) | No | 🔴 NO (Unscoped list) | 🟠 High (Student/Parent sees all peers) |
| `/students/:id` | `GET` | Yes | `students.read` | `RequirePermission("students.read")` | `SELECT * FROM student_profiles WHERE student_profile_id = $1` | 🔴 YES (Any student UUID can be queried) | No | 🔴 NO (No owner check) | 🟠 High (Data enumeration) |
| `/students` | `POST` | Yes | `students.create` | `RequirePermission("students.create")` | `INSERT INTO student_profiles` | N/A | 🔴 Non-admin could register if role grants `students.create` | 🟡 Partial | 🟡 Medium |
| `/faculty` | `GET` | Yes | `faculty.read` | `RequirePermission("faculty.read")` | `SELECT * FROM faculty_profiles LIMIT $1 OFFSET $2` | 🟡 YES (Returns all faculty across all depts) | No | 🔴 NO (No dept filter) | 🟡 Low (Public faculty directory) |
| `/faculty/:id` | `GET` | Yes | `faculty.read` | `RequirePermission("faculty.read")` | `SELECT * FROM faculty_profiles WHERE faculty_profile_id = $1` | 🟡 YES | No | 🔴 NO | 🟡 Low |
| `/student-enrollments` | `GET` | Yes | `students.read` | `RequirePermission("students.read")` | `SELECT * FROM student_enrollments LIMIT $1 OFFSET $2` | 🔴 YES (Returns all enrollments) | No | 🔴 NO | 🟠 High |
| `/courses` | `GET` | Yes | `courses.read` | `RequirePermission("courses.read")` | `SELECT * FROM courses LIMIT $1 OFFSET $2` | 🟢 Catalog data | No | 🟢 N/A (General Catalog) | 🟢 None |
| `/course-offerings` | `GET` | Yes | `course_offerings.read` | `RequirePermission("course_offerings.read")` | `SELECT * FROM course_offerings LIMIT $1 OFFSET $2` | 🟢 Term offerings | No | 🟢 N/A | 🟢 None |
| `/faculty-allocations` | `GET` | Yes | `faculty_course_allocations.read` | `RequirePermission("faculty_course_allocations.read")` | `SELECT * FROM faculty_course_allocations` | 🔴 YES (Returns all allocations) | No | 🔴 NO | 🟡 Medium |
| `/student-course-registrations` | `GET` | Yes | `student_course_registrations.read` | `RequirePermission("student_course_registrations.read")` | `SELECT * FROM student_course_registrations` | 🔴 YES (Returns all student registrations) | No | 🔴 NO | 🟠 High |
| `/timetables` | `GET` | Yes | `timetable.read` | `RequirePermission("timetable.read")` | `SELECT * FROM timetables` | 🟢 Program schedule | No | 🟢 N/A | 🟢 None |
| `/timetable-entries` | `GET` | Yes | `timetable.read` | `RequirePermission("timetable.read")` | `SELECT * FROM timetable_entries` | 🟢 Slot mappings | No | 🟢 N/A | 🟢 None |
| `/class-sessions` | `GET` | Yes | `timetable.read` | `RequirePermission("timetable.read")` | `SELECT * FROM class_sessions` | 🟢 Live sessions | No | 🟢 N/A | 🟢 None |
| `/attendance` | `GET` | Yes | `attendance.read` | `RequirePermission("attendance.read")` | `SELECT * FROM attendance_records` | 🔴 YES (Returns all students' attendance records) | No | 🔴 NO | 🟠 High (Student/Parent sees all peers' attendance) |
| `/attendance` | `POST` | Yes | `attendance.create` | `RequirePermission("attendance.create")` | `INSERT INTO attendance_records` | N/A | 🔴 Faculty could mark attendance for unassigned classes if not checked | 🔴 NO | 🟠 High |
| `/assignments` | `GET` | Yes | `assignments.read` | `RequirePermission("assignments.read")` | `SELECT * FROM assignments` | 🟢 Course coursework | No | 🟢 N/A | 🟢 None |
| `/assignment-submissions` | `GET` | Yes | `assignment_submissions.read` | `RequirePermission("assignment_submissions.read")` | `SELECT * FROM assignment_submissions` | 🔴 YES (Student sees other students' submissions) | No | 🔴 NO | 🟠 High |
| `/exams` | `GET` | Yes | `examinations.read` | `RequirePermission("examinations.read")` | `SELECT * FROM exams` | 🟢 General schedule | No | 🟢 N/A | 🟢 None |
| `/exam-registrations` | `GET` | Yes | `examinations.read` | `RequirePermission("examinations.read")` | `SELECT * FROM exam_registrations` | 🔴 YES (Returns all hall tickets) | No | 🔴 NO | 🟠 High |
| `/exam-attempts` | `GET` | Yes | `examinations.read` | `RequirePermission("examinations.read")` | `SELECT * FROM exam_attempts` | 🔴 YES (Returns all marks entry sheets) | No | 🔴 NO | 🟠 High |
| `/course-results` | `GET` | Yes | `course_results.read` | `RequirePermission("course_results.read")` | `SELECT * FROM course_results` | 🔴 YES (Returns all students' grades) | No | 🔴 NO | 🔴 Critical (Academic privacy breach) |
| `/semester-results` | `GET` | Yes | `semester_results.read` | `RequirePermission("semester_results.read")` | `SELECT * FROM semester_results` | 🔴 YES (Returns all SGPA scores) | No | 🔴 NO | 🔴 Critical (Academic privacy breach) |
| `/program-results` | `GET` | Yes | `program_results.read` | `RequirePermission("program_results.read")` | `SELECT * FROM program_results` | 🔴 YES (Returns all CGPA scores) | No | 🔴 NO | 🔴 Critical (Academic privacy breach) |
| `/transcripts` | `GET` | Yes | `transcripts.read` | `RequirePermission("transcripts.read")` | `SELECT * FROM transcripts` | 🔴 YES (Returns all official transcripts) | No | 🔴 NO | 🔴 Critical (Academic privacy breach) |
| `/users` | `GET`, `POST` | Yes | `users.read` | `RequireRole("SUPER_ADMIN")` | `SELECT * FROM users` | No (Admin only) | No (Admin only) | 🟢 YES (`SUPER_ADMIN` only) | 🟢 None |
| `/roles` | `GET` | Yes | `roles.read` | `RequireRole("SUPER_ADMIN")` | `SELECT * FROM roles` | No (Admin only) | No (Admin only) | 🟢 YES (`SUPER_ADMIN` only) | 🟢 None |
| `/permissions` | `GET` | Yes | `permissions.read` | `RequireRole("SUPER_ADMIN")` | `SELECT * FROM permissions` | No (Admin only) | No (Admin only) | 🟢 YES (`SUPER_ADMIN` only) | 🟢 None |

---

## 2. Key Findings & Vulnerability Categorization

1. **Academic Records Privacy (Critical)**: Endpoints `/course-results`, `/semester-results`, `/program-results`, `/transcripts`, and `/attendance` return full database listings to anyone possessing `.read` permissions. A student or parent can retrieve the entire institution's grades by calling the REST API.
2. **Student & Enrollment Data Exposure (High)**: Endpoints `/students`, `/student-enrollments`, and `/student-course-registrations` return full institutional tables without filtering to the caller's profile, department, or enrolled courses.
3. **Submissions Exposure (High)**: `/assignment-submissions` returns all students' homework files and answers to any student who has `assignment_submissions.read`.
4. **Administrative Routes Protection (Secure)**: `/users`, `/roles`, and `/permissions` remain securely guarded by `RequireRole("SUPER_ADMIN")` and cannot be accessed by students, faculty, deans, or parents.
