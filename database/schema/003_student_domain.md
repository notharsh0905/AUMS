# Student Domain

## Purpose

The Student Domain manages the complete lifecycle of a learner within AUMS.

The lifecycle begins before admission and continues after graduation.

Student Lifecycle:

Prospective Student
→ Applicant
→ Verified Applicant
→ Enrolled Student
→ Active Student
→ Graduate
→ Alumni

AUMS preserves the complete history of the student permanently.

---

# Core Principles

## Lifelong Academic Record

A student's academic history must never be deleted.

Records remain available even after graduation.

---

## Multi-Program Support

A student may participate in multiple academic programs.

Examples:

* B.Tech CSE
* AI Minor
* Certificate Course

---

## Multi-Institution Support

A student may belong to multiple institutions managed by AUMS.

---

## Document-Centric Verification

Admission and verification rely on supporting documents.

---

# Tables

## student_profiles

Purpose:

Stores student-specific information.

Fields:

* id
* user_id
* institution_id
* campus_id
* department_id
* enrollment_number
* admission_year
* graduation_year
* current_status
* current_cgpa
* created_at
* updated_at

Student Status Values:

* APPLICANT
* VERIFIED
* ENROLLED
* ACTIVE
* GRADUATED
* ALUMNI
* SUSPENDED
* DROPPED

Relationships:

Student
→ Programs

Student
→ Documents

Student
→ Attendance

Student
→ Assignments

Student
→ Results

---

## student_programs

Purpose:

Maps students to academic programs.

Fields:

* id
* student_id
* program_id
* enrollment_date
* completion_date
* status

Examples:

Student
→ B.Tech

Student
→ AI Minor

Student
→ Cyber Security Certificate

---

## admission_applications

Purpose:

Stores admission applications.

Fields:

* id
* applicant_user_id
* institution_id
* program_id
* application_number
* application_status
* submitted_at
* reviewed_at

Application Status:

* DRAFT
* SUBMITTED
* UNDER_REVIEW
* APPROVED
* REJECTED
* WAITLISTED

---

## student_documents

Purpose:

Stores student documents.

Fields:

* id
* student_id
* document_type
* file_id
* verification_status
* uploaded_at

Document Types:

* AADHAR
* MARKSHEET
* MIGRATION_CERTIFICATE
* MEDICAL_CERTIFICATE
* CATEGORY_CERTIFICATE
* INCOME_CERTIFICATE
* PASSPORT
* OTHER

Verification Status:

* PENDING
* VERIFIED
* REJECTED

---

## student_verification_requests

Purpose:

Tracks profile correction requests.

Example:

Student requests correction in:

* Name
* Date of Birth
* Address

Fields:

* id
* student_id
* field_name
* old_value
* new_value
* reason
* status
* reviewed_by
* created_at

Status:

* PENDING
* APPROVED
* REJECTED

---

## student_academic_history

Purpose:

Stores permanent academic history.

Fields:

* id
* student_id
* academic_level_id
* cgpa
* credits_completed
* completion_status
* completed_at

Purpose:

Supports:

* Transcript generation
* Degree verification
* Alumni records

---

## student_status_history

Purpose:

Tracks every status change.

Example:

Applicant
→ Verified
→ Enrolled
→ Active
→ Graduate
→ Alumni

Fields:

* id
* student_id
* old_status
* new_status
* changed_by
* changed_at

---

# Student Domain Relationships

Institution
↓
Student

Student
↓
Programs

Student
↓
Documents

Student
↓
Attendance

Student
↓
Assignments

Student
↓
Results

Student
↓
Academic History

Student
↓
Alumni

---

# Future Features

* Scholarship Management
* Placement Tracking
* Mentorship Matching
* Internship Tracking
* Research Participation
* Achievement Portfolio
* Digital Transcript Generation
