# Attendance Domain

## Purpose

The Attendance Domain manages attendance tracking, validation, monitoring, analytics, and compliance across all academic activities.

Unlike traditional systems that record attendance once per day, AUMS uses session-based attendance.

Every attendance record is linked to:

* Student
* Subject
* Faculty
* Academic Session
* Timetable Entry

This enables accurate attendance tracking and detailed analytics.

---

# Core Principles

## Session-Based Attendance

Attendance is recorded per session.

Example:

Monday

09:00 - DBMS → Present

10:00 - OS → Absent

11:00 - Lab → Present

This provides greater accuracy than daily attendance.

---

## Multiple Attendance Methods

AUMS supports multiple attendance capture methods.

Examples:

* Manual Attendance
* QR Code Attendance
* RFID Attendance
* Biometric Attendance
* Face Recognition Attendance (Future)
* Geo-Location Attendance (Future)

---

## Real-Time Analytics

Attendance data should immediately support:

* Alerts
* Reports
* AI Predictions
* Parent Notifications

---

## Auditability

Attendance modifications must be tracked.

Every change must be recorded.

---

# Attendance Flow

Timetable Session
↓
Faculty Marks Attendance
↓
Attendance Stored
↓
Analytics Updated
↓
Notifications Generated
↓
AI Risk Analysis

---

# Tables

## attendance_records

Purpose:

Stores individual attendance records.

Fields:

* id
* student_id
* timetable_entry_id
* faculty_id
* attendance_date
* attendance_status
* attendance_method
* remarks
* recorded_at

Attendance Status:

* PRESENT
* ABSENT
* LATE
* EXCUSED
* ON_DUTY

Attendance Methods:

* MANUAL
* QR
* RFID
* BIOMETRIC
* FACE_RECOGNITION
* GEO_LOCATION

---

## attendance_sessions

Purpose:

Tracks attendance collection sessions.

Fields:

* id
* timetable_entry_id
* faculty_id
* attendance_date
* session_status
* started_at
* completed_at

Session Status:

* OPEN
* CLOSED
* LOCKED

---

## attendance_exceptions

Purpose:

Stores attendance exceptions.

Examples:

Medical leave

Sports participation

Official university duty

Fields:

* id
* student_id
* attendance_record_id
* exception_type
* supporting_document_id
* approval_status
* approved_by

Exception Types:

* MEDICAL
* SPORTS
* UNIVERSITY_DUTY
* EXAMINATION
* OTHER

---

## attendance_corrections

Purpose:

Stores attendance correction requests.

Example:

Faculty accidentally marked student absent.

Fields:

* id
* attendance_record_id
* old_status
* new_status
* correction_reason
* requested_by
* approved_by
* correction_date

---

## attendance_summaries

Purpose:

Stores aggregated attendance statistics.

Fields:

* id
* student_id
* subject_id
* academic_term_id
* total_sessions
* attended_sessions
* attendance_percentage
* updated_at

Purpose:

Fast dashboard performance.

---

## attendance_thresholds

Purpose:

Defines minimum attendance requirements.

Examples:

75%

80%

85%

Fields:

* id
* institution_id
* threshold_percentage
* applies_to

Applies To:

* Institution
* Department
* Program

---

## attendance_alerts

Purpose:

Stores attendance warnings.

Examples:

Attendance below 75%.

Fields:

* id
* student_id
* attendance_percentage
* alert_type
* generated_at
* notification_status

Alert Types:

* LOW_ATTENDANCE
* CRITICAL_ATTENDANCE
* DETENTION_RISK

---

## attendance_reports

Purpose:

Stores generated attendance reports.

Fields:

* id
* generated_by
* report_type
* report_period
* generated_at

Report Types:

* STUDENT
* SUBJECT
* FACULTY
* DEPARTMENT
* INSTITUTION

---

# QR Attendance Support

## qr_attendance_sessions

Purpose:

Stores QR attendance sessions.

Fields:

* id
* attendance_session_id
* qr_token
* expires_at
* generated_at

Purpose:

Students scan QR code during class.

---

# RFID Attendance Support

## rfid_attendance_logs

Purpose:

Stores RFID attendance scans.

Fields:

* id
* student_id
* rfid_tag
* scan_time
* attendance_session_id

---

# Biometric Attendance Support

## biometric_attendance_logs

Purpose:

Stores biometric attendance events.

Fields:

* id
* student_id
* biometric_device_id
* scan_time

---

# Attendance Analytics

The Attendance Domain provides:

* Student Attendance Trends
* Subject Attendance Trends
* Faculty Attendance Reports
* Department Attendance Reports
* Institution Attendance Reports

---

# Parent Integration

Parents may receive:

* Low Attendance Alerts
* Monthly Attendance Reports
* Critical Attendance Notifications

---

# AI Integration

Attendance data can be used for:

## Student Risk Prediction

Example:

Low Attendance
+
Low Performance
===============

High Academic Risk

---

## Attendance Pattern Analysis

Examples:

Frequent Monday Absences

Frequent Lab Absences

Subject-Specific Attendance Issues

---

## Dropout Prediction

Attendance data contributes to dropout risk models.

---

# Attendance Domain Relationships

Student
↓
Attendance Records

Faculty
↓
Attendance Sessions

Timetable Entry
↓
Attendance Session

Attendance Session
↓
Attendance Records

Attendance Records
↓
Analytics

Attendance Records
↓
Notifications

Attendance Records
↓
AI Predictions

---

# Future Features

* Face Recognition Attendance
* Geo-Fenced Attendance
* Smart Attendance Kiosks
* Attendance Heatmaps
* Attendance Forecasting
* AI Attendance Assistant
* Automatic Defaulter Detection
* Attendance-Based Eligibility Engine
