# Examination Domain

## Purpose

Manages all assessment activities across institutions.

Supports:

* Internal Exams
* Mid-Sem Exams
* End-Sem Exams
* Practical Exams
* Viva Exams
* Online Exams
* Offline Exams

## Tables

### exams

* id
* institution_id
* academic_term_id
* exam_name
* exam_type
* start_date
* end_date
* status

### exam_subjects

* id
* exam_id
* subject_id
* max_marks
* passing_marks

### exam_schedules

* id
* exam_subject_id
* exam_date
* start_time
* end_time
* room_id

### hall_tickets

* id
* student_id
* exam_id
* generated_at

### invigilators

* id
* exam_schedule_id
* faculty_id

### malpractice_reports

* id
* student_id
* exam_schedule_id
* description
* action_taken

## Future Features

* AI Seating Plan Generator
* Online Proctoring
* Face Verification
* AI Cheating Detection

