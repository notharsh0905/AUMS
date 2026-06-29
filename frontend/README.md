# AUMS Frontend V1

AI Powered Autonomous Management System (AUMS) Enterprise University ERP Portal.

## Technical Stack

- **Core**: Next.js (App Router, latest stable), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Formatting & Linting**: ESLint, Prettier

## Directory Structure

This project enforces a **feature-first** organization model as detailed in the approved Frontend Master Plan:

- `app/` - Routing layer (Page Layouts, loading fallback templates, error boundaries).
- `components/` - Global, reusable, atomic stateless UI elements.
- `features/` - Domain-specific capsules (e.g. `auth`, `users`, `courses`). Each feature encapsulates its own assets, services, and local hooks.
- `hooks/` - Global custom hooks.
- `providers/` - Context providers (State Management, UI Themes, toasts).
- `services/` - Global REST API configurations (Axios clients, endpoints).
- `lib/` - Libraries initialization (Axios, Zustand hooks).
- `types/` - Shared global type structures.
- `utils/` - Reusable deterministic pure utility helper functions.
- `constants/` - Global read-only settings and options.
- `config/` - Dynamic environment validation variables.
- `styles/` - Global styling configurations.

## Development Scripts

Run the development server:
```bash
npm run dev
```

Run linter checks:
```bash
npm run lint
```

Build production static assets bundle:
```bash
npm run build
```
