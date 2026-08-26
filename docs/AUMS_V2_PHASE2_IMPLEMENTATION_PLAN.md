# AUMS V2 Phase 2 Comprehensive Implementation Plan

**Author**: Antigravity Automated Verification Agent  
**Baseline Git Commit**: `4667cd3` (`tag: aums-v2-phase1`)  
**Target Goal**: Production-Ready AUMS V2 Architecture & User Experience  

---

## 1. Prioritization Framework

- **P0 (Security & Correctness)**: Elimination of in-memory mock stores (`LOCAL_GRADING_MOCK_STORE`, `LOCAL_MARKS_STORE`, `LOCAL_SLOTS_MOCK`, `LOCAL_ATTENDANCE_MOCK`, `WARDS`), persistent assignment grading, and live parent ward data wiring.
- **P1 (Core Academic Workflows)**: Bulk attendance submission API, timetable slot persistence, continuous assessment marks entry, and assignment submission management.
- **P2 (Performance & Scalability)**: Aggregated dashboard analytics endpoint (`/api/v1/analytics/dashboard`), eliminating the 15-endpoint client-side fanout.
- **P3 (Design & UX Excellence)**: Standardized empty/loading/error states, keyboard shortcuts for grading and attendance marking, and interactive responsive design polish.
- **P4 (Enhancements)**: Export utilities (CSV/PDF) and UI micro-animations.

---

## 2. Release Checkpoints Architecture

Every implementation phase is divided into granular, testable tasks. **Each task corresponds to exactly one conventional Git commit.**

```
Phase 2A: Mock Elimination & Core APIs (Tasks V2-01 to V2-04)
   └── Checkpoint 2A: 0 Mocks Remaining, All APIs Live & Tested

Phase 2B: Parent Portal & Role Workflows (Tasks V2-05 to V2-08)
   └── Checkpoint 2B: Multi-Ward Switcher Live, Role Experience Validated

Phase 2C: Dashboard Performance & Aggregations (Tasks V2-09 to V2-11)
   └── Checkpoint 2C: 15-Request Fanout Eliminated, < 50ms Dashboard Latency

Phase 2D: UX & Design System Polish (Tasks V2-12 to V2-15)
   └── Checkpoint 2D: Rich Aesthetics, Keyboard Shortcuts, Full Accessibility

Phase 2E: Cross-Role Forensic QA & Final Baseline (Tasks V2-16 to V2-18)
   └── Checkpoint 2E: Tag `aums-v2.0.0` Production Release
```

---

## 3. Ordered Task Specifications (1 Task = 1 Commit)

### Phase 2A — Backend Endpoints & Mock Elimination

#### **TASK V2-01 (P0)**: Assignment Submission Grading API
- **Objective**: Implement backend endpoint `PUT /api/v1/assignment-submissions/:id/grade` to record grade points and feedback directly into PostgreSQL.
- **Backend Files**:
  - `backend/internal/db/queries/assignment_submissions.sql`
  - `backend/internal/assignmentsubmissions/repository.go`
  - `backend/internal/assignmentsubmissions/service.go`
  - `backend/internal/assignmentsubmissions/handler.go`
  - `backend/internal/assignmentsubmissions/routes.go`
  - `backend/internal/assignmentsubmissions/dto.go`
- **Frontend Files**:
  - `frontend/features/assignment-submissions/services/index.ts`
  - `frontend/features/assignment-submissions/components/grading-modal.tsx`
- **Database / API Changes**: Updates `assignment_submissions` table (`marks_obtained`, `feedback`, `status = 'GRADED'`). Exposes `PUT /api/v1/assignment-submissions/:id/grade`.
- **Elimination Target**: Delete `LOCAL_GRADING_MOCK_STORE` and `LOCAL_SUBMISSIONS_MOCK`.
- **Tests**: `go test ./internal/assignmentsubmissions/...` + Live grading submission test.
- **Expected Commit**: `feat(assignments): implement submission grading API and eliminate mock store`

---

#### **TASK V2-02 (P0)**: Timetable Entries Live Wiring & Mock Elimination
- **Objective**: Wire timetable slots directly to `timetable_entries` and `class_sessions` endpoints, removing `LOCAL_SLOTS_MOCK`.
- **Backend Files**:
  - `backend/internal/timetableentries/repository.go`
  - `backend/internal/timetableentries/service.go`
- **Frontend Files**:
  - `frontend/features/timetable/services/index.ts`
  - `frontend/features/timetable/components/timetable-view.tsx`
- **Elimination Target**: Delete `LOCAL_SLOTS_MOCK` array and concatenation logic in `timetable/services/index.ts`.
- **Tests**: Verify `GET /timetables` and `GET /timetable-entries` return live slot data.
- **Expected Commit**: `fix(timetable): connect live timetable entries and remove local slot mock`

---

#### **TASK V2-03 (P0)**: Bulk Attendance Marking API & Fallback Removal
- **Objective**: Implement `POST /api/v1/attendance/bulk` allowing faculty to submit attendance for an entire classroom session in one atomic database transaction.
- **Backend Files**:
  - `backend/internal/db/queries/attendance_records.sql`
  - `backend/internal/attendance/repository.go`
  - `backend/internal/attendance/service.go`
  - `backend/internal/attendance/handler.go`
  - `backend/internal/attendance/routes.go`
- **Frontend Files**:
  - `frontend/features/attendance/services/index.ts`
  - `frontend/features/attendance/components/attendance-sheet.tsx`
- **Elimination Target**: Delete `LOCAL_ATTENDANCE_MOCK` in `attendance/services/index.ts`.
- **Tests**: `go test ./internal/attendance/...` + Live bulk attendance submission test.
- **Expected Commit**: `feat(attendance): implement atomic bulk attendance API and remove mock store`

---

#### **TASK V2-04 (P0)**: Continuous Internal Assessments Persistence
- **Objective**: Connect internal marks entry in `/internal-assessments` directly to `exam_attempts` and `course_results`, eliminating in-memory `LOCAL_MARKS_STORE`.
- **Backend Files**:
  - `backend/internal/courseresults/service.go`
  - `backend/internal/courseresults/handler.go`
- **Frontend Files**:
  - `frontend/features/internal-assessments/services/index.ts`
  - `frontend/features/internal-assessments/components/assessment-table.tsx`
- **Elimination Target**: Delete `LOCAL_MARKS_STORE` Map in `internal-assessments/services/index.ts`.
- **Tests**: Verify internal marks update persists on page refresh.
- **Expected Commit**: `feat(assessments): wire continuous internal assessment marks to live backend`

---

### Phase 2B — Parent Portal & Multi-Role Experiences

#### **TASK V2-05 (P0)**: Live Parent Ward Telemetry & Static WARDS Removal
- **Objective**: Wire `ParentDashboard` to `GET /api/v1/parents/wards` and live transcript/attendance endpoints, removing the hardcoded `WARDS` array.
- **Frontend Files**:
  - `frontend/features/dashboard/components/parent-dashboard.tsx`
  - `frontend/features/dashboard/hooks/use-parent-dashboard.ts` (New Hook)
  - `frontend/services/parent-service.ts`
- **Elimination Target**: Delete static `WARDS` array in `parent-dashboard.tsx`.
- **Tests**: Log in as `parent1@aums.edu` and verify `Student 1` and `Student 2` load with live CGPA and attendance telemetry.
- **Expected Commit**: `feat(parent): connect live ward telemetry to parent dashboard and remove static data`

---

#### **TASK V2-06 (P1)**: Student Academic Degree Progress Tracker
- **Objective**: Provide students with an interactive degree audit progress bar showing earned credits vs required credits, semester SGPA trend chart, and official transcript download.
- **Frontend Files**:
  - `frontend/features/dashboard/components/student-dashboard.tsx`
  - `frontend/features/transcripts/components/transcript-view.tsx`
- **Tests**: Log in as `student1@aums.edu` and verify degree audit calculations match database records.
- **Expected Commit**: `feat(student): enhance student degree progress audit and transcript view`

---

#### **TASK V2-07 (P1)**: Faculty Workload & Course Allocation Hub
- **Objective**: Enhance faculty portal with active teaching schedule for today, quick attendance marking shortcut, and pending submission alerts.
- **Frontend Files**:
  - `frontend/features/dashboard/components/faculty-dashboard.tsx`
  - `frontend/features/faculty-course-allocations/components/allocation-list.tsx`
- **Expected Commit**: `feat(faculty): integrate teaching schedule hub and quick attendance shortcuts`

---

#### **TASK V2-08 (P1)**: Dean & HOD Academic Unit Oversight
- **Objective**: Provide Deans and HODs with department curriculum health indicators, faculty allocation matrix, and course registration summaries.
- **Frontend Files**:
  - `frontend/features/departments/components/department-details.tsx`
  - `frontend/features/schools/components/school-details.tsx`
- **Expected Commit**: `feat(academic): implement academic unit oversight portal for deans and hods`

---

### Phase 2C — Dashboard Performance & Aggregations

#### **TASK V2-09 (P2)**: Backend Aggregated Dashboard Analytics Endpoint
- **Objective**: Create `GET /api/v1/analytics/dashboard` in Go backend to return pre-computed counts and telemetry for the authenticated role in a single SQL transaction.
- **Backend Files**:
  - `backend/internal/db/queries/analytics.sql` (New sqlc query)
  - `backend/internal/analytics/repository.go` (New package)
  - `backend/internal/analytics/service.go`
  - `backend/internal/analytics/handler.go`
  - `backend/internal/analytics/routes.go`
  - `backend/internal/analytics/dto.go`
  - `backend/pkg/server/server.go`
- **Security Check**: Enforce role scoping (Super Admin gets global stats, Dean gets school stats, HOD gets department stats).
- **Tests**: Benchmark latency `< 30ms` with `go test ./internal/analytics/...`.
- **Expected Commit**: `perf(analytics): implement aggregated role-scoped dashboard analytics API`

---

#### **TASK V2-10 (P2)**: Frontend Dashboard Hook Consolidation
- **Objective**: Refactor `useAdminDashboard`, `useFacultyDashboard`, and `useStudentDashboard` to consume the single `/api/v1/analytics/dashboard` endpoint, eliminating the 15-request waterfall.
- **Frontend Files**:
  - `frontend/features/dashboard/hooks/use-admin-dashboard.ts`
  - `frontend/features/dashboard/hooks/use-faculty-dashboard.ts`
  - `frontend/features/dashboard/hooks/use-student-dashboard.ts`
- **Tests**: Inspect browser Network tab to verify only 1 analytics request is dispatched on dashboard mount.
- **Expected Commit**: `perf(dashboard): replace 15-request waterfall with unified analytics endpoint`

---

### Phase 2D — UI/UX Design System Polish

#### **TASK V2-11 (P3)**: Standardized Empty States, Skeletons & Feedback States
- **Objective**: Add rich SVG illustrations, contextual call-to-actions, and pulse skeleton placeholders across all data tables and detail drawers.
- **Frontend Files**:
  - `frontend/components/shared/empty-state.tsx`
  - `frontend/components/shared/loading-skeleton.tsx`
  - `frontend/components/shared/data-table.tsx`
- **Expected Commit**: `style(ui): establish consistent empty states and loading skeletons across all tables`

---

#### **TASK V2-12 (P3)**: Attendance & Grading Keyboard Navigation Workflows
- **Objective**: Add rapid keyboard shortcuts for faculty attendance marking (`P` = Present, `A` = Absent, `L` = Late, `Enter` = Next row) and grade entry.
- **Frontend Files**:
  - `frontend/features/attendance/components/attendance-sheet.tsx`
  - `frontend/features/assignment-submissions/components/grading-modal.tsx`
- **Expected Commit**: `feat(ux): implement rapid keyboard shortcuts for attendance and grading`

---

#### **TASK V2-13 (P3)**: Global Search & Shortcuts Enhancement in CommandPalette
- **Objective**: Expand `CommandPalette` (`Cmd+K`) to index all 35 routes, quick entity searches (courses, faculty, students), and theme toggling.
- **Frontend Files**:
  - `frontend/components/shared/command-palette.tsx`
  - `frontend/components/layouts/header.tsx`
- **Expected Commit**: `feat(navigation): expand global command palette search and quick actions`

---

### Phase 2E — Forensic QA & Release Baseline

#### **TASK V2-14 (P0)**: Automated Cross-Role Security & Scope Regression Suite
- **Objective**: Execute automated runtime security audit verifying all 7 roles against all live endpoints and newly added APIs (`/parents/wards`, `/analytics/dashboard`, `/attendance/bulk`).
- **Tests**: Run comprehensive verification script verifying 0 IDOR/BOLA gaps and 100% test pass rate.
- **Expected Commit**: `test(security): add cross-role automated regression tests for Phase 2 endpoints`

---

#### **TASK V2-15 (P0)**: Production Bundle & Documentation Finalization
- **Objective**: Execute full backend test pipeline, Next.js production build, update API documentation (`backend/docs/`), and finalize release notes.
- **Verification**: `go fmt ./...`, `go vet ./...`, `go test ./...`, `go build ./...`, `npm run lint`, `npm run build`.
- **Expected Commit**: `chore(release): finalize AUMS V2 production readiness and release documentation`

---

## 4. Summary of Planned Git Commits

| Commit Sequence | Scope | Conventional Commit Message | Priority |
|---|---|---|---|
| 1 | `assignments` | `feat(assignments): implement submission grading API and eliminate mock store` | P0 |
| 2 | `timetable` | `fix(timetable): connect live timetable entries and remove local slot mock` | P0 |
| 3 | `attendance` | `feat(attendance): implement atomic bulk attendance API and remove mock store` | P0 |
| 4 | `assessments` | `feat(assessments): wire continuous internal assessment marks to live backend` | P0 |
| 5 | `parent` | `feat(parent): connect live ward telemetry to parent dashboard and remove static data` | P0 |
| 6 | `student` | `feat(student): enhance student degree progress audit and transcript view` | P1 |
| 7 | `faculty` | `feat(faculty): integrate teaching schedule hub and quick attendance shortcuts` | P1 |
| 8 | `academic` | `feat(academic): implement academic unit oversight portal for deans and hods` | P1 |
| 9 | `analytics` | `perf(analytics): implement aggregated role-scoped dashboard analytics API` | P2 |
| 10 | `dashboard` | `perf(dashboard): replace 15-request waterfall with unified analytics endpoint` | P2 |
| 11 | `ui` | `style(ui): establish consistent empty states and loading skeletons across all tables` | P3 |
| 12 | `ux` | `feat(ux): implement rapid keyboard shortcuts for attendance and grading` | P3 |
| 13 | `navigation` | `feat(navigation): expand global command palette search and quick actions` | P3 |
| 14 | `security` | `test(security): add cross-role automated regression tests for Phase 2 endpoints` | P0 |
| 15 | `release` | `chore(release): finalize AUMS V2 production readiness and release documentation` | P0 |

---

## 5. Design Tools & Prototyping Strategy

- **PRD**: Applied for complex attendance bulk transaction logic and role-scoped analytics aggregations.
- **Taste / Design System**: Applied to ensure uniform typography, zinc dark-mode contrast, and standardized card padding.
- **Google Stitch**: Used for layout exploration of the Parent Multi-Ward Switcher and Faculty Rapid Attendance Grid before frontend changes.
