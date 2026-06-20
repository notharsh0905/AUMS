# Academic Domain

## Purpose

The Academic Domain is the heart of AUMS.

This domain defines how education is structured, delivered, tracked, evaluated, and completed.

Every academic activity depends on this domain.

Examples:

* Programs
* Subjects
* Credits
* Electives
* Minors
* Honours
* Academic Years
* Registration
* Course Enrollment

The Academic Domain must support:

* Schools
* Colleges
* Universities
* National Institutions
* International Institutions

---

# Core Principles

## Flexible Academic Models

AUMS must support:

* Fixed Curriculum
* CBCS
* Credit-Based Systems
* Semester Systems
* Year-Based Systems
* Class-Based Systems

---

## International Compatibility

AUMS must support:

* Percentage
* CGPA
* GPA
* Letter Grades
* Credit Systems

---

## Student Choice

Students may choose:

* Electives
* Minors
* Honours
* Certificate Programs

where permitted.

---

## Lifelong Academic Records

Academic history is permanent.

---

# Academic Structure

Institution
↓
Department
↓
Program
↓
Academic Level
↓
Subject
↓
Enrollment
↓
Result

---

# Tables

## academic_years

Purpose:

Defines institutional academic years.

Examples:

2025-26

2026-27

Fields:

* id
* institution_id
* year_name
* start_date
* end_date
* status

Status:

* UPCOMING
* ACTIVE
* CLOSED

---

## academic_terms

Purpose:

Defines semesters, years, or terms.

Examples:

Semester 1

Semester 2

Year 1

Quarter 1

Fields:

* id
* academic_year_id
* name
* term_number
* start_date
* end_date

---

## programs

Purpose:

Represents degree or certification programs.

Examples:

* B.Tech
* MBA
* MCA
* LLB
* Class 10
* Class 12

Fields:

* id
* department_id
* name
* code
* level
* duration_years
* academic_model
* grading_system
* status

Levels:

* SCHOOL
* DIPLOMA
* UG
* PG
* PHD

Academic Models:

* FIXED
* CBCS

---

## academic_levels

Purpose:

Represents classes, semesters, or years.

Examples:

Class 10

Semester 1

Year 2

Fields:

* id
* program_id
* level_name
* level_number
* credits_required

---

## subjects

Purpose:

Represents courses offered.

Examples:

* DBMS
* Operating Systems
* Mathematics
* Physics

Fields:

* id
* academic_level_id
* code
* name
* description
* credits
* subject_type
* status

Subject Types:

* CORE
* ELECTIVE
* MINOR
* HONOURS
* CERTIFICATE

---

## subject_prerequisites

Purpose:

Defines prerequisite subjects.

Example:

Advanced AI

requires

Machine Learning

Fields:

* id
* subject_id
* prerequisite_subject_id

---

## subject_offerings

Purpose:

Defines which subjects are offered in a term.

Fields:

* id
* subject_id
* academic_term_id
* faculty_id
* max_students
* status

---

## student_subject_enrollments

Purpose:

Tracks subject registration.

Fields:

* id
* student_id
* subject_offering_id
* enrollment_date
* status

Status:

* ENROLLED
* DROPPED
* COMPLETED

---

## elective_groups

Purpose:

Groups electives together.

Example:

Choose one:

* AI
* Cyber Security
* Data Science

Fields:

* id
* program_id
* group_name
* minimum_selection
* maximum_selection

---

## elective_subjects

Purpose:

Maps subjects to elective groups.

Fields:

* id
* elective_group_id
* subject_id

---

## minor_programs

Purpose:

Supports minor degrees.

Examples:

* AI Minor
* Cyber Security Minor

Fields:

* id
* institution_id
* name
* description
* credits_required

---

## student_minor_enrollments

Purpose:

Tracks minor participation.

Fields:

* id
* student_id
* minor_program_id
* enrollment_date
* status

---

## honours_programs

Purpose:

Supports honours programs.

Examples:

* AI Honours
* Robotics Honours

Fields:

* id
* institution_id
* name
* credits_required

---

## student_honours_enrollments

Purpose:

Tracks honours participation.

Fields:

* id
* student_id
* honours_program_id
* status

---

## grading_systems

Purpose:

Supports multiple grading methods.

Examples:

* Percentage
* CGPA
* GPA
* Letter Grade

Fields:

* id
* institution_id
* name
* description
* max_score

---

## grade_mappings

Purpose:

Maps scores to grades.

Examples:

91-100 → A+

81-90 → A

Fields:

* id
* grading_system_id
* minimum_score
* maximum_score
* grade

---

## academic_registrations

Purpose:

Tracks yearly or semester registrations.

Fields:

* id
* student_id
* academic_year_id
* academic_level_id
* registration_status

Status:

* REGISTERED
* PENDING
* CANCELLED

---

# Academic Domain Relationships

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
Subject
↓
Subject Offering
↓
Student Enrollment

Student
↓
Electives

Student
↓
Minor

Student
↓
Honours

Student
↓
Grades

Student
↓
Credits

---

# International Support

Supported Models:

Indian Universities

* Percentage
* CGPA

US Universities

* GPA

European Universities

* ECTS Credits

Schools

* Class-Based Promotion

---

# Future Features

* Cross-Institution Credit Transfer
* International Exchange Programs
* Dual Degree Programs
* Research Credits
* Industry Certification Integration
* AI Course Recommendation Engine
* Skill Gap Analysis
* Personalized Learning Paths

