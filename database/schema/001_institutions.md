# Institution Domain

## Purpose

The Institution Domain defines the organizational hierarchy of AUMS.

Everything in AUMS ultimately belongs to an institution.

Examples:

* School
* College
* University

The Institution Domain is the foundation of the entire platform.

---

# Tables

## institutions

Purpose:

Represents an educational institution.

Examples:

* CSJMU
* PSIT
* DPS School

Fields:

* id (UUID)
* name
* code
* institution_type
* email
* phone
* website
* address
* city
* state
* country
* status
* created_at
* updated_at

Relationships:

Institution
→ Campuses

One institution can have multiple campuses.

---

## campuses

Purpose:

Represents physical campuses of an institution.

Examples:

* Main Campus
* Medical Campus
* Law Campus

Fields:

* id
* institution_id
* name
* address
* city
* state
* status
* created_at

Relationships:

Campus
→ Departments

---

## departments

Purpose:

Represents academic departments.

Examples:

* Computer Science
* Electronics
* Management
* Law

Fields:

* id
* institution_id
* campus_id
* name
* code
* description
* status
* created_at

Relationships:

Department
→ Programs

---

## programs

Purpose:

Represents academic programs.

Examples:

* B.Tech
* MBA
* MCA
* LLB

Fields:

* id
* department_id
* name
* level
* duration_years
* academic_model
* status

Relationships:

Program
→ Academic Levels

---

## academic_levels

Purpose:

Represents classes, years, or semesters.

Examples:

School:

* Class 8
* Class 9

University:

* Semester 1
* Semester 2

Fields:

* id
* program_id
* name
* level_number
* credits_required
* status

Relationships:

Academic Level
→ Subjects

---

## subjects

Purpose:

Represents subjects offered in a level.

Examples:

* DBMS
* Operating Systems
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

---

# Hierarchy

Institution
→ Campus
→ Department
→ Program
→ Academic Level
→ Subject
