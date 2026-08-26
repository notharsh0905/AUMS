# AUMS V2 Data Scope & Domain Relationship Map

This document establishes the verified relationship model of AUMS based on the existing PostgreSQL schema (`database/migrations/`, `database/sql/`, and `database/seeds/`), identifying data owners, traversal paths, allowed scopes per role, and database support status.

---

## 1. Core Identity & Profile Mappings

| Relationship | Source Table & Key | Target Table & Key | Relationship Type | Database Support Status |
|---|---|---|---|---|
| **User $\rightarrow$ Role** | `users(user_id)` | `user_roles(user_id, role_id)` $\rightarrow$ `roles(role_id)` | Many-to-Many | 🟢 Supported (`user_roles`) |
| **Role $\rightarrow$ Permission** | `roles(role_id)` | `role_permissions(role_id, permission_id)` $\rightarrow$ `permissions(permission_id)` | Many-to-Many | 🟢 Supported (`role_permissions`) |
| **User $\rightarrow$ Student Profile** | `users(user_id)` | `student_profiles(user_id)` $\rightarrow$ `student_profile_id` | 1-to-1 (`uq_student_user`) | 🟢 Supported (`student_profiles`) |
| **User $\rightarrow$ Faculty Profile** | `users(user_id)` | `faculty_profiles(user_id)` $\rightarrow$ `faculty_profile_id` | 1-to-1 (`uq_faculty_user`) | 🟢 Supported (`faculty_profiles`) |
| **User $\rightarrow$ Parent Profile** | `users(user_id)` | `parent_profiles(user_id)` $\rightarrow$ `parent_profile_id` | 1-to-1 (`uq_parent_user`) | 🟢 Supported (`parent_profiles`) |
| **Parent $\rightarrow$ Student** | `parent_profiles(parent_profile_id)` | `student_parent_relationships(parent_profile_id, student_profile_id)` $\rightarrow$ `student_profiles` | Many-to-Many | 🟢 Supported in Schema (`000007_parents.up.sql`), Seed pending in `014_demo_profiles.sql` |

---

## 2. Institutional Hierarchy Mappings

```
Institution (institutions)
   └── Campus (campuses)
         └── School (schools)
               └── Department (departments)
                     ├── Faculty (faculty_profiles.department_id)
                     └── Program (programs.department_id)
                           └── Student Enrollment (student_enrollments.program_id)
```

| Relationship | Traversal Path | Supported in DB |
|---|---|---|
| **Student $\rightarrow$ Program** | `student_profiles` $\rightarrow$ `student_enrollments.program_id` $\rightarrow$ `programs` | 🟢 Yes |
| **Student $\rightarrow$ Department** | `student_enrollments` $\rightarrow$ `programs.department_id` $\rightarrow$ `departments` | 🟢 Yes |
| **Student $\rightarrow$ School** | `departments.school_id` $\rightarrow$ `schools` | 🟢 Yes |
| **Faculty $\rightarrow$ Department** | `faculty_profiles.department_id` $\rightarrow$ `departments` | 🟢 Yes |
| **Faculty $\rightarrow$ School** | `faculty_profiles.department_id` $\rightarrow$ `departments.school_id` $\rightarrow$ `schools` | 🟢 Yes |
| **Program $\rightarrow$ Department** | `programs.department_id` $\rightarrow$ `departments` | 🟢 Yes |
| **Department $\rightarrow$ School** | `departments.school_id` $\rightarrow$ `schools` | 🟢 Yes |
| **School $\rightarrow$ Campus** | `schools.campus_id` $\rightarrow$ `campuses` | 🟢 Yes |

---

## 3. Academic & Classroom Mappings

```
Course (courses)
   └── Course Offering (course_offerings) [Semester + AY + Section]
         ├── Faculty Allocation (faculty_course_allocations.faculty_profile_id)
         ├── Student Registration (student_course_registrations.enrollment_id)
         ├── Timetable Entry (timetable_entries) ──► Class Session (class_sessions) ──► Attendance (attendance_records)
         ├── Assignments (assignments) ──► Submissions (assignment_submissions)
         └── Course Results (course_results)
```

| Relationship | Traversal Path | Supported in DB |
|---|---|---|
| **Faculty $\rightarrow$ Course Offering** | `faculty_course_allocations(faculty_profile_id, course_offering_id)` | 🟢 Yes |
| **Student $\rightarrow$ Course Offering** | `student_course_registrations(enrollment_id, course_offering_id)` | 🟢 Yes |
| **Faculty $\rightarrow$ Class Session** | `timetable_entries(faculty_profile_id)` $\rightarrow$ `class_sessions(timetable_entry_id)` | 🟢 Yes |
| **Student $\rightarrow$ Attendance** | `attendance_records(enrollment_id, class_session_id)` | 🟢 Yes |
| **Faculty $\rightarrow$ Attendance** | `class_sessions` $\rightarrow$ `timetable_entries.faculty_profile_id` $\rightarrow$ `attendance_records` | 🟢 Yes |
| **Faculty $\rightarrow$ Assignments** | `assignments(course_offering_id, created_by_faculty_id)` | 🟢 Yes |
| **Student $\rightarrow$ Submissions** | `assignment_submissions(enrollment_id, assignment_id)` | 🟢 Yes |
| **Student $\rightarrow$ Exam Registration** | `exam_registrations(enrollment_id, exam_schedule_id)` | 🟢 Yes |
| **Student $\rightarrow$ Exam Marks Attempt**| `exam_attempts(exam_registration_id)` | 🟢 Yes |
| **Student $\rightarrow$ Results** | `course_results`, `semester_results`, `program_results`, `transcripts` $\rightarrow$ `enrollment_id` | 🟢 Yes |

---

## 4. Entity Ownership & Allowed Scope Matrix

| Entity | Primary Owner | Associated Foreign Keys | Role | Allowed Scope |
|---|---|---|---|---|
| **`student_profiles`** | Student User | `user_id` | `SUPER_ADMIN` | Global (All Students) |
| | | | `INSTITUTION_ADMIN` | Global / Campus |
| | | | `DEAN` | School Scope (Students in School's Departments) |
| | | | `HOD` | Department Scope (Students in Department's Programs) |
| | | | `FACULTY` | Course Scope (Students registered in assigned Course Offerings) |
| | | | `STUDENT` | Self Scope (`user_id = auth.user_id`) |
| | | | `PARENT` | Linked Children (`student_parent_relationships`) |
| **`faculty_profiles`** | Faculty User | `user_id`, `department_id` | `SUPER_ADMIN`, `INSTITUTION_ADMIN` | Global |
| | | | `DEAN` | School Scope (Faculty in School's Departments) |
| | | | `HOD` | Department Scope (Faculty in same Department) |
| | | | `FACULTY` | Self Scope (`user_id = auth.user_id`) + Directory Info |
| | | | `STUDENT`, `PARENT` | Assigned Instructors Directory |
| **`student_enrollments`** | Student | `student_profile_id`, `program_id` | `SUPER_ADMIN`, `ADMIN` | Global |
| | | | `DEAN`, `HOD` | School / Department Scope |
| | | | `FACULTY` | Enrolled in teaching offerings |
| | | | `STUDENT` | Own enrollments (`student_profile.user_id = auth.user_id`) |
| | | | `PARENT` | Linked child enrollments |
| **`course_offerings`** | Department | `course_id`, `semester_id`, `academic_year_id` | `SUPER_ADMIN`, `ADMIN` | Global |
| | | | `DEAN`, `HOD` | School / Department Scope |
| | | | `FACULTY` | Allocated offerings + Active offerings catalog |
| | | | `STUDENT` | Eligible offerings for program + registered offerings |
| **`faculty_course_allocations`** | Faculty / Dept | `faculty_profile_id`, `course_offering_id` | `SUPER_ADMIN`, `ADMIN`, `HOD` | Department / School / Global |
| | | | `FACULTY` | Self Allocations (`faculty_profile.user_id = auth.user_id`) |
| **`student_course_registrations`**| Student | `enrollment_id`, `course_offering_id` | `SUPER_ADMIN`, `ADMIN` | Global |
| | | | `FACULTY` | Students in allocated offerings |
| | | | `STUDENT` | Self Registrations (`enrollment.student.user_id = auth.user_id`) |
| **`attendance_records`** | Student & Session | `class_session_id`, `enrollment_id` | `SUPER_ADMIN`, `ADMIN` | Global |
| | | | `DEAN`, `HOD` | Department / School aggregated scope |
| | | | `FACULTY` | Attendance for assigned class sessions |
| | | | `STUDENT` | Own attendance records |
| | | | `PARENT` | Linked children attendance |
| **`assignment_submissions`** | Student | `assignment_id`, `enrollment_id` | `SUPER_ADMIN`, `ADMIN` | Global |
| | | | `FACULTY` | Submissions for authored/assigned assignments |
| | | | `STUDENT` | Own submissions |
| **`exam_registrations`** / **`exam_attempts`** | Student & Exam | `exam_schedule_id`, `enrollment_id` | `SUPER_ADMIN`, `ADMIN`, `COE` | Global |
| | | | `FACULTY` | Course marks entry sheets |
| | | | `STUDENT` | Own hall tickets & marks |
| | | | `PARENT` | Linked children hall tickets & marks |
| **`results`** / **`transcripts`** | Student | `enrollment_id` | `SUPER_ADMIN`, `ADMIN` | Global |
| | | | `FACULTY` | Assigned course grades |
| | | | `STUDENT` | Own grades, SGPA, CGPA, transcript |
| | | | `PARENT` | Linked children grades & transcripts |
| **`users`**, **`roles`**, **`permissions`** | System Identity | `user_id`, `role_id` | `SUPER_ADMIN` | Global (Admin Only) |
| | | | `ALL OTHER ROLES` | Denied / 403 Forbidden |

---

## 5. Summary of Schema Dependencies

- **Parent-Child Relationship**: Supported in schema (`student_parent_relationships` in `database/migrations/000007_parents.up.sql`). Backend service & repository queries need to traverse `parent_profiles` $\rightarrow$ `student_parent_relationships` $\rightarrow$ `student_profiles` to resolve linked wards.
- **Faculty-Department Scoping**: Supported via `faculty_profiles.department_id`.
- **Student-Program Scoping**: Supported via `student_enrollments.program_id` $\rightarrow$ `programs.department_id`.
