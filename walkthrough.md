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
- Configured a page at `/transcripts`.
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

# Module 3: Hall Tickets (Exam Registrations)

We completed the implementation of the **Hall Tickets (Exam Registrations) Management Module** in the AUMS Frontend client on the `feature/frontend-v1` branch. The module connects directly to the real frozen backend APIs (v1.2.0) and supports registration creation, status modification (Registered, Absent, Disqualified), deletion/cancellation of registrations, paginated lists, and lookups.

## 1. Implemented Features

### 🏢 Exam Registrations Feature Capsule (`frontend/features/exam-registrations`)
We structured the exam registrations module in a domain-driven feature capsule matching the established repository patterns:
- **[types/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-registrations/types/index.ts)**: Declared types for both raw snake_case backend API responses (`RawExamRegistration`, `ExamRegistrationFilters`, etc.) and mapped camelCase types (`ExamRegistration`, `ExamRegistrationListResponse`, etc.) that hold joined lookup fields.
- **[schemas/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-registrations/schemas/index.ts)**: Created a Zod validation schema (`examRegistrationFormSchema`) to validate exam IDs, student enrollment IDs, and registration status fields on submit.
- **[constants/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-registrations/constants/index.ts)**: Maintained dropdown options for registration status choices (Registered, Absent, Disqualified).
- **[services/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-registrations/services/index.ts)**: Implemented Axios client integrations communicating with real `/exam-registrations` endpoints (`GET /exam-registrations`, `GET /exam-registrations/:id`, `POST /exam-registrations`, `PUT /exam-registrations/:id`, and `DELETE /exam-registrations/:id`). The service automatically resolves student profiles and exam listings in parallel to enrich registrations with candidate names, roll numbers, and examination course schedules.
- **[hooks/use-exam-registrations.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-registrations/hooks/use-exam-registrations.ts)**: Manages load cycles, filter states, drawer triggers, cancellation confirmation modals, and handles async lookup fetching to populate selection widgets.
- **[components/registration-form/registration-form.tsx](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-registrations/components/registration-form/registration-form.tsx)**: Form component leveraging React Hook Form. Allows registering a new candidate to an exam by choosing from the loaded list of exams and student enrollments. In edit mode, presents static candidate details and permits updating the registration status.
- **[components/registration-details/registration-details.tsx](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-registrations/components/registration-details/registration-details.tsx)**: Renders a high-fidelity digital card designed like an official **Exam Hall Ticket**. Displays candidate details, scheduling data, registration ID, and candidate guidelines with print capability.
- **[components/registration-list/registration-list-view.tsx](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-registrations/components/registration-list/registration-list-view.tsx)**: Main dashboard view integrating paginated lists, filters (Status, Exam, Student), drawer sheets, and cancellation confirmation dialogues.

### 🗺 Page Routing (`frontend/app/exam-registrations/page.tsx`)
- Configured a route page at `/exam-registrations` implementing standard layout containers and Route guard checks.

### 🧭 Navigation Integration (`frontend/config/navigation.ts`)
- Added the **Hall Tickets** sidebar item under the Academics section, secured by the `exam_registrations.read` permission gate.

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
│  Gen       Exam Registrations & Hall Tickets           + Register Student│
│  ├── Dash                                                              │
│  Acad      [Search student, roll...]  Status: [Select] Exam: [Select]  │
│  ├── Stud  ┌─────────────────────────────────────────────────────────┐ │
│  ├── Fac   │ Student Name │ Course    │ Examination │ Status   │ Date    │ │
│  ├── Hall  ├──────────────┼───────────┼─────────────┼──────────┼─────────┤ │
│  │  Tckts  │ Jane Doe     │ CS-101    │ Semester    │REGISTERED│7/12/2026│ │
│  │         │ (2026CS101)  │ (Intro C) │ End Term    │          │         │ │
│  └── Tran  └──────────────┴───────────┴─────────────┴──────────┴─────────┘ │
│  Admin                                    Page 1 of 1  [<] [>]         │
└────────────────────────────────────────────────────────────────────────┘
```

---

# Module 4: Exam Attempts (Marks Entry)

We completed the implementation of the **Exam Attempts (Marks Entry) Module** in the AUMS Frontend client on the `feature/frontend-v1` branch. The module connects directly to the real frozen backend APIs (v1.2.0) and supports full CRUD capabilities (List, View, Record, Edit, and Delete marks entries) along with pagination, search, and dynamic status/exam filtering.

## 1. Implemented Features

### 🏢 Exam Attempts Feature Capsule (`frontend/features/exam-attempts`)
We structured the exam attempts module in a domain-driven feature capsule matching the established repository patterns:
- **[types/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-attempts/types/index.ts)**: Declared types for both raw snake_case backend API responses (`RawExamAttempt`, `ExamAttemptFilters`, etc.) and mapped camelCase types (`ExamAttempt`, `ExamAttemptListResponse`, etc.) that hold joined lookup fields.
- **[schemas/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-attempts/schemas/index.ts)**: Created a Zod validation schema (`marksEntryFormSchema`) to validate attempt number, internal marks, external marks, evaluator UUID, and evaluation dates.
- **[constants/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-attempts/constants/index.ts)**: Maintained query keys for exam attempts.
- **[services/index.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-attempts/services/index.ts)**: Implemented Axios client integrations communicating with real `/exam-attempts` endpoints (`GET /exam-attempts`, `GET /exam-attempts/:id`, `POST /exam-attempts`, `PUT /exam-attempts/:id`, and `DELETE /exam-attempts/:id`). The service automatically resolves student profiles, exam listings, and faculty evaluators in parallel to enrich attempts with candidate names, roll numbers, evaluator names, and maximum marks values. In addition, it supports parsing and formatting the internal/external marks breakdown inside the `remarks` field using a specialized regex parser `[Internal: X, External: Y]` to persist the split marks on the backend.
- **[hooks/use-exam-attempts.ts](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-attempts/hooks/use-exam-attempts.ts)**: Manages load cycles, page indices, search metrics, select parameters, form drawers, and deletion confirmation dialogs.
- **[components/marks-entry-form/marks-entry-form.tsx](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-attempts/components/marks-entry-form/marks-entry-form.tsx)**: Form component leveraging React Hook Form. Features input validation that prevents total marks from exceeding maximum exam marks. Real-time dynamic calculator sums internal assessment marks and external exam marks, rendering an active status badge (PASS / FAIL) based on the exam's passing thresholds.
- **[components/attempt-details/attempt-details.tsx](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-attempts/components/attempt-details/attempt-details.tsx)**: Renders a structured read-only card of a student's marks logs, including visual metrics of the internal/external marks breakdown, evaluator data, and pass/fail indicators.
- **[components/attempt-list/attempt-list-view.tsx](file:///Users/harshupadhyay/AUMS_ANTI/AUMS/frontend/features/exam-attempts/components/attempt-list/attempt-list-view.tsx)**: Main dashboard view integrating paginated lists, filters (Status, Exam), drawer sheets, and deletion confirmation dialogs.

### 🗺 Page Routing (`frontend/app/exam-attempts/page.tsx`)
- Configured a route page at `/exam-attempts` implementing standard layout containers and Route guard checks.

### 🧭 Navigation Integration (`frontend/config/navigation.ts`)
- Added the **Marks Entry** sidebar item under the Academics section, secured by the `exam_attempts.read` permission gate.

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
│  Gen       Marks Entry & Evaluations                       + Record Marks│
│  ├── Dash                                                              │
│  Acad      [Search student, roll...]  Reg Status: [Select] Exam: [Select]│
│  ├── Stud  ┌─────────────────────────────────────────────────────────┐ │
│  ├── Fac   │ Student Name │ Course / Exam │ Attempt   │ Marks  │ Result  │ │
│  ├── Marks ├──────────────┼───────────────┼───────────┼────────┼─────────┤ │
│  │  Entry  │ Jane Doe     │ CS-101 - Sem  │ Attempt #1│ 85/100 │  PASS   │ │
│  │         │ (2026CS101)  │ End Term      │           │        │         │ │
│  └── Tran  └──────────────┴───────────────┴───────────┴────────┴─────────┘ │
│  Admin                                    Page 1 of 1  [<] [>]         │
└────────────────────────────────────────────────────────────────────────┘
```
