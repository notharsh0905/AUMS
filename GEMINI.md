# AUMS AI Instructions

## Project

AI Powered Autonomous Management System (AUMS)

Enterprise University ERP.

## Stack

Backend

- Go 1.26
- Gin
- PostgreSQL
- sqlc
- pgx
- Redis
- MinIO
- JWT

Frontend

- Next.js
- TypeScript
- Tailwind
- shadcn/ui

## Architecture

Repository
→ Service
→ Handler

Never change architecture.

## Rules

Never introduce

- GORM
- Ent
- Fiber
- Echo

Use only sqlc.

Always preserve

- routes
- business logic
- package names
- folder structure

Always use

- response.Success()
- response.SuccessWithMeta()
- response.Error()
- response.ValidationError()

Validation

- validator.Validate.Struct()
- validator.FormatErrors()

Return complete compile-ready code.

Never invent APIs.

If unsure, inspect the repository first.

When modifying a file, rewrite the complete file.