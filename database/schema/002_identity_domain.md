# Identity Domain

## Purpose

The Identity Domain is responsible for authentication, authorization, and user identity management.

Every user in AUMS passes through this domain.

This domain implements RBAC (Role-Based Access Control).

---

# Core Principles

## Lifelong Identity

A user has one account forever.

Example:

Student
→ Alumni
→ Mentor
→ Recruiter

The account remains the same.

Only roles change.

---

# Tables

## users

Purpose:

Represents a human being.

Fields:

* id
* uuid
* email
* phone
* password_hash
* first_name
* middle_name
* last_name
* date_of_birth
* gender
* profile_photo
* status
* created_at
* updated_at

Relationships:

User
→ Roles

User
→ Student Profile

User
→ Faculty Profile

User
→ Parent Profile

User
→ Alumni Profile

---

## roles

Purpose:

Defines system roles.

Examples:

* Student
* Faculty
* Parent
* Alumni
* HOD
* Dean
* Registrar
* Admin
* Super Admin

Fields:

* id
* name
* description
* created_at

---

## permissions

Purpose:

Defines actions allowed in the system.

Examples:

* view_attendance
* edit_attendance
* approve_leave
* manage_users
* manage_roles

Fields:

* id
* name
* description
* created_at

---

## user_roles

Purpose:

Assigns roles to users.

Example:

User:
Harsh

Roles:

* Student
* Alumni

Fields:

* user_id
* role_id
* assigned_at

---

## role_permissions

Purpose:

Maps permissions to roles.

Example:

Faculty:

* view_attendance
* edit_attendance
* create_assignment

Fields:

* role_id
* permission_id

---

## sessions

Purpose:

Tracks active login sessions.

Fields:

* id
* user_id
* token
* ip_address
* device_info
* expires_at
* created_at

---

# RBAC Flow

User
↓
Role
↓
Permission
↓
Action

Example:

Faculty
↓
edit_attendance
↓
Attendance Update Allowed
