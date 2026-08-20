# AUMS V1.0.1 Release Documentation

**Release Name**: AUMS V1.0.1 (Maintenance & Public Preparation Baseline)
**Release Tag**: `aums-v1.0.1`
**Git Branch**: `main`
**Status**: **FROZEN / STABLE BASELINE**

---

## 1. Release Summary

AUMS V1.0.1 represents the frozen initial baseline release of the **AI Powered Autonomous Management System (AUMS)**. This release establishes a enterprise university ERP backend (Go 1.26 + Gin + sqlc) and frontend (Next.js 16 + React 19 + Tailwind CSS v4) ready for open-source publication and local evaluation.

> [!NOTE]
> **Baseline Freeze**: AUMS V1.0.1 is officially frozen. No further feature changes, API modifications, or architectural redesigns will be made to this baseline release. All future capabilities are deferred to V2.

---

## 2. Key Modules & Features Implemented in V1.0.1

### 2.1 Academic Structure & Governance
- **Multi-Level Hierarchy**: Management of Institutions, Campuses, Schools, Departments, Degree Programs, and Academic Batches.
- **Curriculum & Courses**: Course Catalog items, prerequisites, program curriculums, and term-specific Course Offerings.
- **Faculty Allocations**: Assignment of faculty members to course sections and classroom facilities.

### 2.2 Student Lifecycle & Registrations
- **Student Profiles & Enrollments**: Management of student admission records, degree program enrollments, and academic statuses.
- **Term Registrations**: Registration of students into specific term course offerings with prerequisite checking.
- **Class Sessions & Attendance**: Daily class session logs and student attendance tracking.

### 2.3 Examinations, Grading & Transcripts
- **Exam Scheduling & Seating**: Configuration of term examinations, exam rooms, and seating allocations.
- **Marks Entry & Grade Cards**: Assessment marks submission (Internal/External), automatic letter grade calculation, and SGPA/CGPA computing.
- **Result Scorecards**: Publication of Course Results, Semester Results, and Program Results.
- **Official Transcripts**: Cumulative academic performance views and verifiable student transcript summaries.

### 2.4 Security & Administration
- **Granular RBAC**: 7 core roles (`SUPER_ADMIN`, `INSTITUTION_ADMIN`, `DEAN`, `HOD`, `FACULTY`, `STUDENT`, `PARENT`) backed by fine-grained permissions.
- **JWT Session Control**: Secure Access Token & Refresh Token authorization flow with frontend auto-refresh queue interceptors.
- **MinIO Storage Integration**: Object storage integration for syllabus documents, student avatars, and coursework uploads.

---

## 3. Demo Seed Data

V1.0.1 comes pre-packaged with 14 sequential SQL seeds (`database/seeds/001`-`014`) providing a complete mock university dataset:
- Institution: *AUMS Central University*
- Department: *Computer Science & Engineering (CSE)*
- Degree Program: *B.Tech Computer Science* (Batch 2024–2028)
- Demo Accounts (Passcode: `Admin@123`):
  - Super Admin: `admin@aums.com`
  - Institution Admin: `institution.admin@aums.edu`
  - Dean: `dean.engineering@aums.edu`
  - HOD: `hod.cse@aums.edu`
  - Faculty: `faculty.cse1@aums.edu`
  - Student: `student1@aums.edu`
  - Parent: `parent1@aums.edu`

---

## 4. Verification & Testing Status

- **Backend Go Verification**:
  - `go fmt ./...`: **PASS**
  - `go vet ./...`: **PASS**
  - `go test ./...`: **PASS** (0 failures across all pkg modules)
  - `go build ./...`: **PASS** (0 errors)
- **Frontend Verification**:
  - `npm run lint`: **PASS** (0 errors)
  - `npm run build`: **PASS** (33 static pages generated successfully)

---

## 5. Deferred V2 Scope

The following features were intentionally excluded from V1.0.1 and scheduled for V2:
- AI-Assisted Timetable Conflict Resolution Engine
- Vector DB / RAG Assistant for University Regulations
- Biometric & Hardware RFID Attendance Gateway
- Multi-Tenant Isolated DB Architecture for SaaS deployments
