# AUMS Frontend V1 Release Checklist

This document tracks the audit and verification results of the **AUMS Frontend client (V1 Release)** on the `feature/frontend-v1` branch.

## Release Checklist & Compliance Summary

- [x] ✔ **Navigation verified** – Audited all menu links, groups, and children in `navigation.ts` to ensure exact alignment with roles and backend middleware permissions.
- [x] ✔ **RBAC verified** – Configured fine-grained access gates. Users cannot view pages or execute actions without explicit privileges.
- [x] ✔ **Protected routes verified** – Swapped generic protection with role-restricted guards on root paths like `/admin/users`, `/admin/roles`, and `/admin/permissions`. Added a dynamic client-side `PermissionRoute` wrapper.
- [x] ✔ **Dashboard permissions verified** – Quick actions inside `StudentDashboard`, `FacultyDashboard`, and `AdminDashboard` hide automatically if credentials or permissions are insufficient. Administrator quick actions are wrapped with client-side routes.
- [x] ✔ **Error states verified** – Verified global Axios API response interceptors which convert standard network failures and HTTP status returns (`401`, `403`, `404`, `500`) into normalized errors, rendering a reusable `ErrorState` layout with retry options.
- [x] ✔ **Loading states verified** – All table data lists show the reusable shimmer layout `TableSkeleton` while queries execute.
- [x] ✔ **Responsive review completed** – Sidebar navigation hides gracefully under an overlay shade panel drawer on mobile viewports.
- [x] ✔ **Accessibility review completed** – Added descriptive `aria-label` tags, focus triggers, and keyboard events across navigation toggles and data rows.
- [x] ✔ **Build passes** – Next.js production compilation compiles successfully without errors.
- [x] ✔ **Lint passes** – ESLint verification passes cleanly with 0 errors.

---

## 1. Verified Route Access Policies

| Path | Required Role | Required Permission | State |
| :--- | :--- | :--- | :--- |
| `/dashboard` | `*` (Any authenticated) | `-` | Authorized |
| `/students` | `*` | `students.read` | Guarded |
| `/faculty` | `*` | `faculty.read` | Guarded |
| `/courses` | `*` | `courses.read` | Guarded |
| `/departments` | `*` | `departments.read` | Guarded |
| `/admin/users` | `SUPER_ADMIN` | `users.read` | Role-Locked |
| `/admin/roles` | `SUPER_ADMIN` | `roles.read` | Role-Locked |
| `/admin/permissions` | `SUPER_ADMIN` | `permissions.read` | Role-Locked |

## 2. Action Button RBAC Visibility

- **Toolbar Controls**: Create buttons (e.g. `+ Add Student`) check if `hasPermission('students.create')` is true. If false, the button is hidden in the toolbar view.
- **Row Action Controls**: Edit and delete button icons check for `'students.update'` and `'students.delete'` respectively before rendering.

## 3. Verification Commands Run

```bash
# Verify ESLint passes cleanly
npm run lint

# Verify static build compilation succeeds
npm run build
```

## 4. Workflow Testing Verification

- **Student Workflow**: Verified Login → Dashboard (Profile Summary, Academic Summary, Attendance Ratios) → Attendance Logs → Assignments (Submission states) → Exam Registrations → Hall Tickets → Course Results → Semester Results → Program Results (CGPA) → Transcripts. Fully operational with dynamic backend joins.
- **Faculty Workflow**: Verified Login → Dashboard (Assigned Courses, Timetable Slots, Review Logs) → Timetable Sheets → Attendance Marking → Assignment Submission Review/Evaluation → Marks Entry Form → Results publishing drafts.
- **Admin Workflow**: Verified Login → Dashboard (Statistical Counts, Recharts Trends, Alerts Feed) → Students list → Faculty profiles → Departments → Programs → Courses → Timetable Slots → Terminal Examinations list → Results publishing panel.

