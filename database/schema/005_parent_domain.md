# Parent Domain

## Purpose

The Parent Domain enables parents and guardians to actively participate in a student's academic journey.

Parents receive visibility into attendance, performance, notifications, fees, and important institutional updates.

This domain improves transparency between institutions and families.

---

# Core Principles

## Multiple Guardians Support

A student may have:

* Father
* Mother
* Guardian

simultaneously.

---

## One Parent Multiple Students

A parent may be linked to:

* Child 1
* Child 2
* Child 3

within the same institution or across institutions.

---

## Controlled Access

Parents can only view information they are authorized to access.

Sensitive academic and administrative actions remain restricted.

---

# Tables

## parent_profiles

Purpose:

Stores parent and guardian information.

Fields:

* id
* user_id
* occupation
* annual_income
* relationship_type
* emergency_contact
* address
* created_at
* updated_at

Relationship Types:

* FATHER
* MOTHER
* GUARDIAN
* SPONSOR

---

## student_parent_links

Purpose:

Links students with parents.

Fields:

* id
* student_id
* parent_id
* relationship
* primary_guardian
* created_at

Examples:

Student
→ Father

Student
→ Mother

Student
→ Guardian

---

## parent_notifications

Purpose:

Stores notifications sent to parents.

Fields:

* id
* parent_id
* notification_type
* title
* message
* sent_at
* status

---

## parent_meeting_requests

Purpose:

Manages parent-teacher meetings.

Fields:

* id
* parent_id
* faculty_id
* student_id
* requested_date
* meeting_status
* remarks

Status:

* REQUESTED
* APPROVED
* COMPLETED
* CANCELLED

---

## parent_access_logs

Purpose:

Tracks parent portal activity.

Fields:

* id
* parent_id
* activity_type
* timestamp

---

# Parent Domain Relationships

Parent
↓
Student

Parent
↓
Notifications

Parent
↓
Meetings

Parent
↓
Academic Monitoring

---

# Future Features

* Parent Mobile App
* Attendance Alerts
* Academic Progress Reports
* Fee Reminders
* AI-Based Student Progress Insights
* Parent Feedback System

