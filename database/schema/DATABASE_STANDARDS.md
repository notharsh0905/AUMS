# Database Standards

## Primary Keys

All primary keys use UUID.

Example:

id UUID PRIMARY KEY

Reason:

* Globally unique
* Better for distributed systems
* Prevents ID guessing

---

## Timestamps

Every table must contain:

created_at

updated_at

Example:

created_at TIMESTAMP NOT NULL

updated_at TIMESTAMP NOT NULL

---

## Soft Deletes

Never physically delete records.

Use:

deleted_at TIMESTAMP NULL

Reason:

Data recovery and auditing.

---

## Foreign Keys

Naming convention:

table_id

Examples:

user_id

institution_id

department_id

---

## Status Columns

Use ENUM-style values.

Examples:

ACTIVE

INACTIVE

ARCHIVED

---

## Auditing

Critical tables must include:

created_by

updated_by

---

## Naming Convention

Tables:

snake_case
plural

Examples:

users
student_profiles

Columns:

snake_case

Examples:

created_at
institution_id

---

## Indexing Rules

Create indexes on:

Foreign Keys

Email

Enrollment Number

Employee ID

Frequently searched fields

---

## Security Rules

Passwords must never be stored.

Only password hashes.

Sensitive documents must be encrypted.

PII access must be logged.
