# Contributing to AUMS

Thank you for your interest in contributing to the **AI Powered Autonomous Management System (AUMS)**! We welcome contributions from developers, researchers, and university administrators.

---

## 1. Development Setup

Before submitting a pull request, ensure your local development environment is configured cleanly:

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AUMS.git
   cd AUMS
   ```
2. **Setup Local Infrastructure**:
   ```bash
   docker compose up -d
   ./scripts/seed-dev.sh
   ```
3. **Verify Local Build**:
   - Backend: `cd backend && go test ./... && go build ./...`
   - Frontend: `cd frontend && npm run lint && npm run build`

---

## 2. Branch & Git Workflow

- **Primary Branch**: `main` (Maintains stable frozen releases, e.g. `aums-v1.0.1`).
- **Feature Branches**: Create topic branches from `main` using descriptive prefixes:
  - `feat/feature-name` (New capability or module)
  - `fix/bug-description` (Bug fix)
  - `docs/doc-update` (Documentation improvements)
  - `refactor/component-name` (Code restructuring without behavior changes)

---

## 3. Coding Standards & Architectural Rules

To maintain high code quality and architectural consistency, all contributions must adhere to the following rules:

### Backend (Go 1.26)
- **Architecture**: Strictly enforce **Repository → Service → Handler**.
- **Database**: Use ONLY `sqlc` for PostgreSQL queries (`database/queries/*.sql`). **Do NOT introduce GORM, Ent, Fiber, or Echo.**
- **Response Format**: Use standardized response helpers (`response.Success()`, `response.SuccessWithMeta()`, `response.Error()`, `response.ValidationError()`).
- **Formatting**: Format code using `go fmt ./...` and verify with `go vet ./...`.

### Frontend (Next.js 16 + React 19)
- **Structure**: Group code into feature capsules inside `frontend/features/<feature-name>/`.
- **Styling**: Use Vanilla CSS / Tailwind CSS v4 utility classes.
- **Form Validation**: Define forms with React Hook Form + Zod schemas.
- **Linting**: Ensure `npm run lint` passes without errors.

---

## 4. Submitting a Pull Request (PR)

1. Ensure all backend tests pass (`go test ./...`) and frontend builds cleanly (`npm run build`).
2. Keep PRs focused on a single logical change or feature.
3. Write clear, descriptive commit messages.
4. Open a Pull Request targeting the `main` branch with a summary of changes, motivation, and verification steps.
