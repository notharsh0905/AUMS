# Alumni Domain

## Purpose

The Alumni Domain maintains lifelong engagement between institutions and graduates.

Unlike traditional systems, AUMS treats alumni as active stakeholders rather than archived records.

Alumni can become:

* Mentors
* Recruiters
* Donors
* Guest Speakers
* Industry Advisors

---

# Core Principles

## Lifelong Relationship

Graduation does not end institutional relationships.

Student
→ Graduate
→ Alumni

using the same account.

---

## Existing Alumni Support

AUMS supports alumni who graduated before the platform existed.

---

## Professional Networking

The Alumni Domain functions as an academic-professional network.

---

# Tables

## alumni_profiles

Purpose:

Stores alumni-specific information.

Fields:

* id
* user_id
* graduation_year
* current_company
* current_position
* linkedin_url
* location
* bio

---

## alumni_imports

Purpose:

Stores imported alumni data.

Fields:

* id
* institution_id
* name
* graduation_year
* department
* roll_number
* email
* verification_status

---

## alumni_claim_requests

Purpose:

Allows existing alumni to claim accounts.

Fields:

* id
* alumni_import_id
* user_id
* verification_method
* status
* reviewed_by
* created_at

Verification Methods:

* ROLL_NUMBER
* EMAIL
* DOCUMENT_UPLOAD

---

## alumni_mentorship

Purpose:

Connects students and alumni.

Fields:

* id
* alumni_id
* student_id
* mentorship_status
* created_at

Status:

* REQUESTED
* ACTIVE
* COMPLETED

---

## alumni_job_postings

Purpose:

Allows alumni to share opportunities.

Fields:

* id
* alumni_id
* company_name
* title
* description
* application_link
* posted_at

---

## alumni_events

Purpose:

Stores alumni events.

Fields:

* id
* institution_id
* title
* description
* event_date
* location

---

## alumni_event_registrations

Purpose:

Tracks event participation.

Fields:

* id
* event_id
* alumni_id
* registration_status

---

## alumni_donations

Purpose:

Tracks donations and sponsorships.

Fields:

* id
* alumni_id
* institution_id
* amount
* purpose
* donated_at

---

# Alumni Domain Relationships

Alumni
↓
Mentorship

Alumni
↓
Jobs

Alumni
↓
Events

Alumni
↓
Donations

Alumni
↓
Institution

---

# Future Features

* Alumni Directory
* Startup Network
* Placement Referrals
* Alumni Awards
* Scholarship Sponsorship
* Industry Collaboration Portal
* AI Mentor Matching
