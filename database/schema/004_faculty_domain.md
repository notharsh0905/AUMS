# Faculty Domain

## Purpose

The Faculty Domain manages the complete lifecycle of teaching and academic staff within AUMS.

Faculty members are not limited to teaching responsibilities.

A faculty member may simultaneously act as:

* Teacher
* Mentor
* Researcher
* Evaluator
* Department Coordinator
* HOD
* Dean
* Approver
* Administrator

The Faculty Domain tracks academic, administrative, and research activities throughout employment.

---

# Core Principles

## Lifelong Employment History

Faculty records are never deleted.

Historical records remain available even after retirement or resignation.

---

## Multi-Role Support

A faculty member can hold multiple responsibilities simultaneously.

Examples:

Faculty
+
Research Coordinator

Faculty
+
HOD

Faculty
+
Dean

---

## Department Independence

Faculty belong to departments but may collaborate across departments.

---

## Workload Tracking

All teaching and administrative workload should be measurable.

---

# Tables

## faculty_profiles

Purpose:

Stores faculty-specific information.

Fields:

* id
* user_id
* institution_id
* campus_id
* department_id
* employee_id
* designation_id
* joining_date
* employment_status
* created_at
* updated_at

Employment Status:

* ACTIVE
* ON_LEAVE
* RETIRED
* RESIGNED
* TERMINATED

Relationships:

Faculty
→ Courses

Faculty
→ Timetable

Faculty
→ Attendance

Faculty
→ Assignments

Faculty
→ Leave Requests

Faculty
→ Research

---

## faculty_designations

Purpose:

Stores official designations.

Examples:

* Assistant Professor
* Associate Professor
* Professor
* HOD
* Dean
* Director

Fields:

* id
* title
* description
* level

---

## faculty_role_assignments

Purpose:

Assigns temporary or permanent responsibilities.

Examples:

* HOD
* Exam Coordinator
* Placement Coordinator
* Research Coordinator

Fields:

* id
* faculty_id
* role_name
* assigned_by
* start_date
* end_date
* status

---

## faculty_workloads

Purpose:

Tracks faculty workload.

Fields:

* id
* faculty_id
* academic_session_id
* teaching_hours
* administrative_hours
* research_hours
* total_hours

Purpose:

Used for:

* Performance evaluation
* Timetable balancing
* AI workload analysis

---

## faculty_leave_requests

Purpose:

Manages faculty leave applications.

Fields:

* id
* faculty_id
* leave_type
* start_date
* end_date
* reason
* approval_status
* approved_by
* created_at

Leave Types:

* Casual Leave
* Medical Leave
* Earned Leave
* Maternity Leave
* Duty Leave

Approval Status:

* PENDING
* APPROVED
* REJECTED

---

## faculty_documents

Purpose:

Stores faculty-related documents.

Examples:

* Appointment Letter
* Degree Certificates
* Experience Certificates
* Research Documents

Fields:

* id
* faculty_id
* document_type
* file_id
* verification_status
* uploaded_at

---

## faculty_research_profiles

Purpose:

Stores research information.

Fields:

* id
* faculty_id
* research_interests
* google_scholar_url
* orcid_id
* scopus_id
* h_index

---

## faculty_publications

Purpose:

Stores research publications.

Fields:

* id
* faculty_id
* title
* publication_type
* journal_name
* publication_year
* doi
* citation_count

Publication Types:

* Journal
* Conference
* Patent
* Book Chapter
* Book

---

## faculty_achievements

Purpose:

Stores awards and achievements.

Fields:

* id
* faculty_id
* title
* description
* awarded_by
* awarded_date

---

## faculty_status_history

Purpose:

Tracks employment status changes.

Examples:

ACTIVE
→ ON_LEAVE

ACTIVE
→ RETIRED

Fields:

* id
* faculty_id
* old_status
* new_status
* changed_by
* changed_at

---

# Faculty Domain Relationships

Institution
↓
Faculty

Faculty
↓
Designation

Faculty
↓
Role Assignments

Faculty
↓
Workloads

Faculty
↓
Leave Requests

Faculty
↓
Research Profile

Faculty
↓
Publications

Faculty
↓
Achievements

Faculty
↓
Timetable

Faculty
↓
Assignments

Faculty
↓
Attendance

---

# Future Features

* Faculty Appraisal System
* Research Grant Tracking
* Patent Management
* Consultancy Management
* Faculty Mentorship Program
* AI Workload Optimizer
* Faculty Performance Dashboard
* Automated Promotion Tracking
