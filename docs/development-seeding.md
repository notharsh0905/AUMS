# AUMS Development Seeding Guide

This document describes how to prepare, seed, and verify the local PostgreSQL database with demo credentials and structures for development.

## 1. Start Docker Containers

First, launch the backing system services (PostgreSQL database, Redis cache, MinIO storage) defined in the root `docker-compose.yml` file:

```bash
# Start all containers in detached mode
docker-compose up -d
```

Confirm that the `aums-postgres` container is healthy and running on port `5432`.

## 2. Run Database Migrations

Use the Golang CLI or the project migrate commands to build and run all migration schemas up to date:

```bash
# In the backend directory
cd backend
go run cmd/server/main.go
```
*Note: The backend service will automatically execute up-migrations on initialization.*

## 3. Run Development Seeds

To execute all development seeds (`001_roles.sql` through `013_demo_programs.sql`) in the correct alphabetical order, run the automated dev seed runner script:

```bash
# From the project root
./scripts/seed-dev.sh
```

The script automatically detects if a local `psql` utility is installed. If `psql` is missing, it redirects query execution inside the `aums-postgres` Docker container automatically.

## 4. Verify Seeded Data

To verify that all demo users, roles, user roles, campuses, schools, departments, and programs are correctly seeded with full relational integrity, run the verification SQL script:

```bash
# If using a local psql client:
psql -h localhost -U postgres -d aums_dev -f database/seeds/verify_demo_data.sql

# If using the Docker container directly:
docker exec -i aums-postgres psql -U postgres -d aums_dev < database/seeds/verify_demo_data.sql
```

## 5. Verified Local Credentials

Use the following verified credentials to sign in to the AUMS console at `http://localhost:3000`:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@aums.com` | `Admin@123` |
| **Faculty** | `smith@aums.edu` | `Admin@123` |
| **Student** | `doe@aums.edu` | `Admin@123` |
| **Parent** | `parent.doe@aums.edu` | `Admin@123` |
