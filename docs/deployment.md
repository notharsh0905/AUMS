# AUMS Deployment & Operations Guide

This guide details local development deployment, staging environment setup, and enterprise production considerations for **AUMS (AI Powered Autonomous Management System)**.

---

## 1. Local Development Deployment

Local development utilizes Docker Compose to manage infrastructure dependencies (PostgreSQL, Redis, MinIO) alongside native Go and Node process execution.

### Step 1: Start Infrastructure Containers
```bash
docker compose up -d
```
Services provided by `docker-compose.yml`:
- **PostgreSQL 17**: `localhost:5432` (User: `postgres`, Password: `postgres`, DB: `aums_dev`)
- **Redis 8**: `localhost:6379`
- **MinIO S3 Storage**: `localhost:9000` (Console UI: `localhost:9001`, User: `minioadmin`, Password: `minioadmin`)

### Step 2: Initialize Database & Seed Demo Accounts
```bash
chmod +x scripts/*.sh
./scripts/seed-dev.sh
```

### Step 3: Run Backend Service
```bash
cd backend
go run cmd/server/main.go
```

### Step 4: Run Frontend Application
```bash
cd frontend
npm install
npm run dev
```

---

## 2. Staging Environment Deployment

In staging environments, backend and frontend services can be containerized or executed under process supervisors (systemd / Docker):

- **Environment File**: Set `APP_ENV=staging` in `backend/configs/staging.yaml` or via environment variables.
- **Frontend Build**: Compile static production assets using:
  ```bash
  cd frontend
  npm run build
  npm run start
  ```

---

## 3. Production Deployment Guidelines

> [!IMPORTANT]
> **Production Hardening Requirements**:
> 1. **Purge Demo Accounts**: Do not execute `scripts/seed-dev.sh` on production databases.
> 2. **Environment Variables**: Inject real production secrets via environment variables instead of standard development configuration YAMLs.
> 3. **SSL/TLS**: Enable TLS for HTTPS (Nginx/Traefik reverse proxy) and configure `DB_SSLMODE=require` / `MINIO_USE_SSL=true`.

### Required Production Secrets Checklist

| Secret Variable | Recommended Value / Source |
| :--- | :--- |
| `JWT_SECRET` | Cryptographically random 256-bit string |
| `DB_PASSWORD` | Strong generated PostgreSQL user password |
| `MINIO_ACCESS_KEY` & `MINIO_SECRET_KEY` | Dedicated IAM / MinIO S3 access key pair |
| `NEXT_PUBLIC_API_URL` | Production HTTPS API domain (e.g. `https://api.aums.edu/api/v1`) |

### Production Backend Build
```bash
cd backend
go build -ldflags="-s -w" -o bin/server cmd/server/main.go
```

### Production Frontend Build
```bash
cd frontend
npm ci
npm run build
```
Deploy the compiled standalone Next.js app or serve behind an Nginx reverse proxy.
