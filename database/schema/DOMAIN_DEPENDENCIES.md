# AUMS Domain Dependencies

This document defines how database domains depend on each other.

## Dependency Flow

Institution Domain

↓

Identity Domain

↓

Student Domain

↓

Faculty Domain

↓

Academic Domain

↓

Timetable Domain

↓

Attendance Domain

↓

Assignment Domain

↓

Examination Domain

↓

Result Domain

↓

Notification Domain

↓

Analytics Domain

↓

AI Domain

↓

Blockchain Domain

## Why This Order Exists

Institution Domain provides organizational structure.

Identity Domain provides authentication and authorization.

Student and Faculty Domains provide user profiles.

Academic Domain defines programs, levels, and subjects.

Timetable Domain defines scheduling.

Attendance Domain depends on timetable sessions.

Assignment Domain depends on students, faculty, and subjects.

Examination Domain depends on academics.

Result Domain depends on examinations.

Analytics Domain depends on all operational data.

AI Domain depends on analytics and historical data.

Blockchain Domain depends on final academic records.

AUMS Core
│
├── Institution Registry
│
└── Database Registry

Institution Database
│
├── Users
├── Students
├── Faculty
├── Attendance
├── Results
└── Alumni