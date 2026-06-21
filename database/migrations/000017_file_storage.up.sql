-- ==========================================
-- AUMS FILE STORAGE DOMAIN
-- ==========================================

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE file_status AS ENUM (
    'ACTIVE',
    'ARCHIVED',
    'DELETED'
);

-- ==========================================
-- STORAGE BUCKETS
-- ==========================================

CREATE TABLE storage_buckets (

    storage_bucket_id UUID PRIMARY KEY,

    bucket_name VARCHAR(255) NOT NULL,

    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_storage_bucket_name
        UNIQUE(bucket_name)
);

-- ==========================================
-- FILES
-- ==========================================

CREATE TABLE files (

    file_id UUID PRIMARY KEY,

    storage_bucket_id UUID NOT NULL,

    uploaded_by UUID,

    original_filename VARCHAR(500) NOT NULL,

    object_key VARCHAR(1000) NOT NULL,

    mime_type VARCHAR(255),

    file_size_bytes BIGINT NOT NULL,

    checksum_sha256 VARCHAR(128),

    file_status file_status
        NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT uq_file_object_key
        UNIQUE(object_key),

    CONSTRAINT fk_file_bucket
        FOREIGN KEY (storage_bucket_id)
        REFERENCES storage_buckets(storage_bucket_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_file_uploaded_by
        FOREIGN KEY (uploaded_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_file_size
        CHECK (file_size_bytes >= 0)
);

-- ==========================================
-- FILE VERSIONS
-- ==========================================

CREATE TABLE file_versions (

    file_version_id UUID PRIMARY KEY,

    file_id UUID NOT NULL,

    version_number INTEGER NOT NULL,

    object_key VARCHAR(1000) NOT NULL,

    checksum_sha256 VARCHAR(128),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_file_version
        UNIQUE (
            file_id,
            version_number
        ),

    CONSTRAINT fk_file_version_file
        FOREIGN KEY (file_id)
        REFERENCES files(file_id)
        ON DELETE CASCADE
);

-- ==========================================
-- FILE ACCESS LOGS
-- ==========================================

CREATE TABLE file_access_logs (

    file_access_log_id UUID PRIMARY KEY,

    file_id UUID NOT NULL,

    user_id UUID,

    action VARCHAR(50) NOT NULL,

    ip_address VARCHAR(100),

    user_agent TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_file_access_file
        FOREIGN KEY (file_id)
        REFERENCES files(file_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_file_access_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_files_bucket
ON files(storage_bucket_id);

CREATE INDEX idx_files_uploaded_by
ON files(uploaded_by);

CREATE INDEX idx_files_status
ON files(file_status);

CREATE INDEX idx_file_versions_file
ON file_versions(file_id);

CREATE INDEX idx_file_access_logs_file
ON file_access_logs(file_id);

CREATE INDEX idx_file_access_logs_user
ON file_access_logs(user_id);

CREATE INDEX idx_file_access_logs_created_at
ON file_access_logs(created_at);