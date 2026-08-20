# AUMS REST API Specification (V1)

**Base URL**: `http://localhost:8080/api/v1`
**Swagger UI**: `http://localhost:8080/swagger/index.html`

---

## 1. Response Envelopes

All API endpoints return JSON payloads wrapped in standardized response structures:

### Success Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Success Response with Metadata (Paginated)
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total_items": 45,
    "total_pages": 5
  },
  "message": "Items retrieved successfully"
}
```

### Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid access token or expired session"
  }
}
```

### Validation Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for 2 fields",
    "details": [
      { "field": "email", "issue": "email must be a valid email address" },
      { "field": "password", "issue": "password is a required field" }
    ]
  }
}
```

---

## 2. Authentication Endpoints

### `POST /auth/login`
Authenticates user credentials and returns JWT tokens.
- **Request Body**:
  ```json
  {
    "email": "admin@aums.com",
    "password": "Admin@123"
  }
  ```
- **Response**: Access Token, Refresh Token, User metadata.

### `POST /auth/refresh`
Exchanges a valid Refresh Token for a new Access Token.

### `GET /auth/me`
Returns details of the currently authenticated user session.

### `POST /auth/logout`
Invalidates the current session refresh token.

---

## 3. Core Resource Endpoints

| Resource Group | Endpoint Base Path | Methods Supported | Description |
| :--- | :--- | :--- | :--- |
| **Users** | `/users` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | User account management |
| **Roles & Permissions** | `/roles`, `/permissions` | `GET`, `POST`, `PUT`, `DELETE` | Dynamic RBAC role allocations |
| **Campuses** | `/campuses` | `GET`, `POST`, `PUT`, `DELETE` | University physical locations |
| **Schools & Depts** | `/schools`, `/departments` | `GET`, `POST`, `PUT`, `DELETE` | Academic structural divisions |
| **Academic Batches** | `/academic-years`, `/semesters` | `GET`, `POST`, `PUT`, `DELETE` | Term calendars & academic batches |
| **Programs & Courses** | `/programs`, `/courses` | `GET`, `POST`, `PUT`, `DELETE` | Degree programs & course catalogs |
| **Course Offerings** | `/course-offerings` | `GET`, `POST`, `PUT`, `DELETE` | Term-specific course section offerings |
| **Student Enrollments**| `/student-enrollments` | `GET`, `POST`, `PUT`, `DELETE` | Student program term enrollments |
| **Registrations** | `/student-course-registrations` | `GET`, `POST`, `PUT`, `DELETE` | Student course registrations |
| **Faculty Allocations**| `/faculty-course-allocations` | `GET`, `POST`, `PUT`, `DELETE` | Faculty course teaching assignments |
| **Class Sessions** | `/class-sessions` | `GET`, `POST`, `PUT`, `DELETE` | Class schedules & session logs |
| **Attendance** | `/attendance` | `GET`, `POST`, `PUT` | Student session attendance tracking |
| **Assignments** | `/assignments`, `/assignment-submissions` | `GET`, `POST`, `PUT`, `DELETE` | Coursework & submission tracking |
| **Examinations** | `/examinations`, `/exam-schedules`, `/exam-rooms` | `GET`, `POST`, `PUT`, `DELETE` | Exam scheduling & room seating |
| **Exam Attempts** | `/exam-registrations`, `/exam-attempts` | `GET`, `POST`, `PUT`, `DELETE` | Student exam marks entry |
| **Results & Scorecards**| `/course-results`, `/semester-results`, `/program-results` | `GET`, `POST`, `PUT`, `DELETE` | Grade calculations, SGPA/CGPA |
| **Transcripts** | `/transcripts` | `GET`, `GET /student/:id` | Cumulative academic transcript views |
