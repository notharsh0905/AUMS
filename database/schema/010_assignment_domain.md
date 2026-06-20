# Assignment Domain

## Purpose

The Assignment Domain manages the complete lifecycle of academic work assigned to students.

This includes:

* Assignments
* Homework
* Projects
* Lab Work
* Viva Tasks
* Group Projects

The system enables creation, distribution, submission, evaluation, feedback, and analytics.

Assignments are linked to:

* Subjects
* Faculty
* Students
* Academic Terms
* Timetable Sessions

---

# Core Principles

## Digital Submission

All assignments should be submitted digitally.

---

## Flexible Assignment Types

Supports:

* Individual Assignments
* Group Assignments
* Lab Assignments
* Projects
* Presentations
* Viva Tasks

---

## Transparent Evaluation

Students should be able to:

* View grades
* View feedback
* View rubrics

---

## Academic Integrity

The platform should support plagiarism detection and originality verification.

---

# Assignment Lifecycle

Faculty Creates Assignment
↓
Students Receive Assignment
↓
Student Submission
↓
Faculty Evaluation
↓
Feedback Published
↓
Analytics Generated

---

# Tables

## assignments

Purpose:

Stores assignment details.

Fields:

* id
* subject_id
* faculty_id
* title
* description
* assignment_type
* total_marks
* release_date
* due_date
* submission_mode
* status
* created_at

Assignment Types:

* HOMEWORK
* LAB
* PROJECT
* PRESENTATION
* VIVA
* CASE_STUDY
* RESEARCH_TASK

Submission Modes:

* FILE_UPLOAD
* TEXT_RESPONSE
* LINK_SUBMISSION
* MIXED

Status:

* DRAFT
* PUBLISHED
* CLOSED
* ARCHIVED

---

## assignment_attachments

Purpose:

Stores assignment resources.

Examples:

* PDF
* Images
* Datasets
* Reference Documents

Fields:

* id
* assignment_id
* file_id
* uploaded_at

---

## assignment_submissions

Purpose:

Stores student submissions.

Fields:

* id
* assignment_id
* student_id
* submission_type
* submission_time
* status

Submission Types:

* FILE
* TEXT
* LINK

Status:

* SUBMITTED
* LATE
* RESUBMITTED
* GRADED

---

## submission_files

Purpose:

Stores uploaded files.

Fields:

* id
* submission_id
* file_id
* uploaded_at

---

## assignment_grades

Purpose:

Stores grading information.

Fields:

* id
* submission_id
* faculty_id
* obtained_marks
* total_marks
* grading_date

---

## assignment_feedback

Purpose:

Stores evaluation feedback.

Fields:

* id
* submission_id
* faculty_id
* feedback_text
* created_at

---

## assignment_rubrics

Purpose:

Stores grading criteria.

Examples:

* Content Quality
* Presentation
* Research Depth
* Originality

Fields:

* id
* assignment_id
* rubric_name
* max_score
* description

---

## assignment_rubric_scores

Purpose:

Stores rubric-wise scoring.

Fields:

* id
* rubric_id
* submission_id
* awarded_score

---

## group_assignments

Purpose:

Stores group assignment details.

Fields:

* id
* assignment_id
* group_name
* created_at

---

## group_members

Purpose:

Stores group members.

Fields:

* id
* group_assignment_id
* student_id

---

## plagiarism_checks

Purpose:

Stores plagiarism results.

Fields:

* id
* submission_id
* similarity_percentage
* report_file_id
* checked_at

---

## assignment_extensions

Purpose:

Stores deadline extension requests.

Fields:

* id
* assignment_id
* student_id
* reason
* requested_due_date
* approval_status

Approval Status:

* PENDING
* APPROVED
* REJECTED

---

## assignment_announcements

Purpose:

Stores assignment-related announcements.

Fields:

* id
* assignment_id
* faculty_id
* title
* message
* created_at

---

# Analytics

Assignment Domain supports:

* Submission Rates
* Late Submission Trends
* Subject Performance Analysis
* Faculty Evaluation Metrics
* Student Progress Tracking

---

# AI Integration

Future AI Features:

## AI Feedback Assistant

Suggests feedback for faculty.

---

## Difficulty Analysis

Determines assignment complexity.

---

## Learning Gap Detection

Identifies weak areas.

---

## Auto-Evaluation Assistance

Provides preliminary scoring suggestions.

---

## AI Tutor

Suggests resources for struggling students.

---

# Parent Integration

Parents may receive:

* Missing Assignment Alerts
* Performance Reports
* Late Submission Notifications

---

# Assignment Domain Relationships

Faculty
↓
Assignments

Assignments
↓
Submissions

Submissions
↓
Grades

Submissions
↓
Feedback

Assignments
↓
Rubrics

Assignments
↓
Groups

Assignments
↓
Analytics

Assignments
↓
AI Insights

---

# Future Features

* AI Assignment Generator
* AI Rubric Generator
* Peer Review System
* Collaborative Whiteboard
* Code Assignment Evaluation
* GitHub Integration
* Research Project Tracking
* AI Learning Recommendations
