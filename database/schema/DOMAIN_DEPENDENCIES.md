# AUMS Domain Dependencies

This document defines the dependency relationships between AUMS domains.

## Core Platform Layer

```text
Core Domain
│
├── Institutions
├── Institution Domains
├── Database Registry
├── Platform Settings
└── Feature Flags
```

All institution databases depend on the Core Domain.

---

## Identity Layer

```text
Identity Domain
│
├── Users
├── Roles
├── Permissions
├── User Roles
├── Role Permissions
└── User Sessions
```

Identity is the foundation for all user-based domains.

---

## People Layer

```text
Identity
│
├── Students
├── Faculty
├── Parents
└── Alumni
```

Dependencies:

```text
Students  → Identity + Institutions
Faculty   → Identity + Institutions
Parents   → Identity + Students
Alumni    → Identity
```

---

## Academic Layer

```text
Academic Domain
│
├── Subjects
├── Curriculum
├── Program Curriculum
├── Course Offerings
├── Faculty Allocations
└── Student Registrations
```

Dependencies:

```text
Academic
    → Institutions
    → Students
    → Faculty
```

---

## Operations Layer

```text
Timetable
Attendance
Assignments
Examinations
Results
```

Dependencies:

```text
Timetable
    → Academic

Attendance
    → Academic
    → Timetable

Assignments
    → Academic
    → Students
    → Faculty

Examinations
    → Academic

Results
    → Examinations
    → Academic
```

---

## Platform Services Layer

```text
Notifications
Analytics
AI
Blockchain
Audit
File Storage
```

Dependencies:

```text
Notifications
    → All Operational Domains

Analytics
    → All Academic and Operational Domains

AI
    → Analytics
    → Historical Data

Blockchain
    → Results
    → Certificates
    → Academic Records

Audit
    → Entire System

File Storage
    → Entire System
```

---

## Complete Dependency Graph

```text
Core
│
├── Identity
│
├── Institutions
│
├── Students
├── Faculty
├── Parents
├── Alumni
│
├── Academics
│
├── Timetable
│
├── Attendance
│
├── Assignments
│
├── Examinations
│
├── Results
│
├── Notifications
│
├── Analytics
│
├── AI
│
├── Blockchain
│
├── Audit
│
└── File Storage
```

---

## Database Architecture

```text
aums_core
│
├── institutions
├── institution_domains
├── institution_database_registry
├── platform_settings
├── feature_flags
└── institution_feature_flags
```

Institution Database:

```text
identity
students
faculty
parents
alumni
academics
timetable
attendance
assignments
examinations
results
notifications
analytics
ai
blockchain
audit
file_storage
```

Result Domain
↓
Notification Domain
↓
Audit Domain
↓
Analytics Domain
↓
AI Domain
↓
Blockchain Domain