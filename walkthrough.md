# AUMS Frontend V1 - Module Walkthroughs

This document contains detailed implementation descriptions and walkthroughs for the completed frontend modules of the AUMS Enterprise ERP.

---

# Module 1: Transcripts

We designed, built, and verified the **Academic Transcripts Module** in the AUMS Frontend client on the `feature/frontend-v1` branch. The module connects directly to the real frozen backend APIs (v1.2.0) and does not use any mock data.

## 1. Implemented Features

### 🏢 Transcripts Feature Capsule (`frontend/features/transcripts`)
We structured the transcripts module in a domain-driven feature capsule matching the established repository patterns:
- **[types/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/transcripts/types/index.ts)**: Declared types for both raw snake_case backend API responses (`RawStudentDetails`, `RawTranscriptResponse`, etc.) and mapped camelCase types (`StudentDetails`, `TranscriptResponse`, etc.).
- **[services/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/transcripts/services/index.ts)**: Implemented Axios client integrations communicating with real `/transcripts` endpoints (`/transcripts/:student_id`, `/transcripts/:student_id/summary`, `/transcripts/:student_id/semesters`, and `/transcripts/:student_id/courses`), including mapping helpers to convert backend models into frontend formats.
- **[hooks/use-transcripts.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/transcripts/hooks/use-transcripts.ts)**: Managed loading skeletons, refetching capability, error handling, and component state integration.
- **[components/transcript-view/transcript-view.tsx](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/transcripts/components/transcript-view/transcript-view.tsx)**: Built a visually stunning, responsive interface:
  - **Student Information Card**: Lists DOB, Enrollment number, nationality, and degree program details.
  - **Overall CGPA Widgets**: Renders CGPA (out of 10.0), credits earned versus total, academic standing, and completion flags in rich grid cards.
  - **Dual Navigation Tabs**: Allows administrators and students to toggle between a "Semester Breakdown" and a "Detailed Course-by-Course Grades" record.
  - **Printer-Friendly Styles**: Styled the print layout via Tailwind `print:` classes to generate clean, verified PDF transcripts upon printing (`window.print()`).

### 🗺 Page Routing (`frontend/app/transcripts/page.tsx`)
- Configured a dynamic page at `/transcripts`.
- **Role-Based Routing**:
  - **Students**: Automatically looks up the current user's profile matching their email in the student directory, resolving their `student_profile_id` and taking them directly to their transcript dashboard.
  - **Admins / Super Admins**: Renders a student directory search bar. Admins can search by student name, roll number, or program, select the student, and pull up their verified transcript view.
- Updates URL state via `studentId` search parameters for shareability and direct reloading support.

### 🧭 Navigation Integration (`frontend/config/navigation.ts`)
- Added **Transcripts** under the Academics sidebar category, secured by the `transcripts.read` permission gate.

---

## 2. Verification & Correctness

- **Type Safety**: Ensured complete TypeScript coverage across the module.
- **Linter Status**: Passes `npm run lint` cleanly.
- **Compilation Status**: Passes Next.js production compilation (`npm run build`) successfully.

---

# Module 2: Exam Rooms

We completed the implementation of the **Exam Room Management Module** in the AUMS Frontend client on the `feature/frontend-v1` branch. The module connects directly to the real frozen backend APIs (v1.2.0) and supports full CRUD capabilities (Create, Read, Update, Delete) along with paginated search and dynamic filter widgets.

## 1. Implemented Features

### 🏢 Exam Rooms Feature Capsule (`frontend/features/exam-rooms`)
We structured the exam rooms module in a domain-driven feature capsule matching the established repository patterns:
- **[types/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-rooms/types/index.ts)**: Declared types for both raw snake_case backend API responses (`RawExamRoom`, `ExamRoomFilters`, etc.) and mapped camelCase types (`ExamRoom`, `ExamRoomListResponse`, etc.).
- **[schemas/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-rooms/schemas/index.ts)**: Created a Zod validation schema (`examRoomFormSchema`) for the create/edit forms. It performs validations like building/room checks, floor constraints (>= 0), capacity checks (>= 1), and valid UUID formatting for the institution. It leverages `z.union([z.string(), z.number()])` for seamless field validation.
- **[constants/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-rooms/constants/index.ts)**: Maintained dropdown options for room types (Classroom, Lecture Hall, Lab, Auditorium) and statuses (Active, Inactive, Maintenance).
- **[services/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-rooms/services/index.ts)**: Implemented Axios client integrations communicating with real `/exam-rooms` endpoints (`GET /exam-rooms`, `GET /exam-rooms/:id`, `POST /exam-rooms`, `PUT /exam-rooms/:id`, and `DELETE /exam-rooms/:id`), including mapping helper utilities.
- **[hooks/use-exam-rooms.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-rooms/hooks/use-exam-rooms.ts)**: Managed loading states, pagination state, search queries, filter state, form drawer modal states, delete confirmation states, and mutation hooks for creating, editing, and deleting exam rooms.
- **[components/exam-room-form/exam-room-form.tsx](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-rooms/components/exam-room-form/exam-room-form.tsx)**: Form component leveraging React Hook Form. Features text fields, select elements, and custom boolean switches (`FormSwitch`) for amenities (Projector, AC, and Wheelchair accessibility). Includes logic to automatically pre-populate the `institutionId` from existing exam rooms to minimize data entry.
- **[components/exam-room-details/exam-room-details.tsx](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-rooms/components/exam-room-details/exam-room-details.tsx)**: Display panel rendering a read-only view of a room's location, configuration, status, and amenities with check/cross indicators.
- **[components/exam-room-list/exam-room-list-view.tsx](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-rooms/components/exam-room-list/exam-room-list-view.tsx)**: Integrates the lists, filters (status, room type, building), paginated `DataTable`, drawer modals, and confirmation dialogs into a cohesive dashboard.

### 🗺 Page Routing (`frontend/app/exam-rooms/page.tsx`)
- Configured a page at `/exam-rooms`.
- Uses layout containers (`PageContainer`, `PageHeader`, `ContentArea`) and applies `ProtectedRoute` guard verification.

### 🧭 Navigation Integration (`frontend/config/navigation.ts`)
- Added **Exam Rooms** under the Academics sidebar category, secured by the `exam_rooms.read` permission gate.

---

## 2. Verification & Correctness

- **Type Safety**: Fully type-safe code with 0 TypeScript compilation errors.
- **Linter Status**: Passes `npm run lint` cleanly.
- **Compilation Status**: Passes Next.js production compilation (`npm run build`) successfully.

---

## 3. Walkthrough Layout Mockup

```
┌────────────────────────────────────────────────────────────────────────┐
│  AUMS ERP   [Search Bar]                                  [Admin Profile]
├────────────────────────────────────────────────────────────────────────┤
│  Gen       Exam Room Management                                + Add Room│
│  ├── Dash                                                              │
│  Acad      [Search building, number...]  Status: [Select] Type: [Select]│
│  ├── Stud  ┌─────────────────────────────────────────────────────────┐ │
│  ├── Fac   │ Building     │ Room Number │ Capacity │ Type     │ Status   │ │
│  ├── Exam  ├──────────────┼─────────────┼──────────┼──────────┼──────────┤ │
│  ├── Room  │ Ramanujan    │ 101         │ 40 seats │ CLASSROOM│ ACTIVE   │ │
│  └── Tran  │ Science Wing │ LH-02       │ 80 seats │ LECTURE  │ ACTIVE   │ │
│            └──────────────┴─────────────┴──────────┴──────────┴──────────┘ │
│  Admin                                    Page 1 of 2  [<] [>]         │
└────────────────────────────────────────────────────────────────────────┘
```
