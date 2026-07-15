#!/usr/bin/env bash

# ==========================================
# AUMS DEVELOPMENT SEED RUNNER
# ==========================================

# Set default connection details
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-aums_dev}"
export PGPASSWORD="${DB_PASSWORD:-postgres}"

# Find absolute path of the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== AUMS Database Seeding ==="
echo "Target DB: $DB_NAME on $DB_HOST:$DB_PORT (User: $DB_USER)"

# Determine execution mode: local psql or docker psql
USE_DOCKER=false
if ! command -v psql &> /dev/null; then
    echo "Local 'psql' utility not found. Checking for 'aums-postgres' Docker container..."
    if docker ps --format '{{.Names}}' | grep -Eq "^aums-postgres$"; then
        echo "Found 'aums-postgres' container. Running seeds via Docker exec."
        USE_DOCKER=true
    else
        echo "Error: Neither local 'psql' nor running 'aums-postgres' Docker container was found."
        echo "Please make sure your database is running and accessible."
        exit 1
    fi
fi

# Retrieve all seed SQL files in sorted order
SEEDS=($(find "$PROJECT_ROOT/database/seeds" -name "0*.sql" | sort))

if [ ${#SEEDS[@]} -eq 0 ]; then
    echo "No SQL seed files found in database/seeds/"
    exit 1
fi

echo "Found ${#SEEDS[@]} seed files to execute."

for seed_file in "${SEEDS[@]}"; do
    filename=$(basename "$seed_file")
    echo "Executing seed: $filename..."
    
    if [ "$USE_DOCKER" = true ]; then
        # Run inside Docker container by piping the file content
        docker exec -i aums-postgres psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 < "$seed_file"
    else
        # Run locally
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f "$seed_file"
    fi
    
    status=$?
    if [ $status -ne 0 ]; then
        echo "Error: Failed executing seed $filename (status code: $status)"
        exit $status
    fi
done

echo "=== Database Seeding Completed Successfully! ==="
