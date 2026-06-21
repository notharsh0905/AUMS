-- ==========================================
-- AUMS AUDIT DOMAIN
-- ==========================================

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE audit_action AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'VIEW',
    'EXPORT',
    'APPROVE',
    'REJECT',
    'LOGIN',
    'LOGOUT'
);

CREATE TYPE login_status AS ENUM (
    'SUCCESS',
    'FAILED',
    'LOCKED',
    'EXPIRED'
);

-- ==========================================
-- AUDIT EVENTS
-- ==========================================

CREATE TABLE audit_events (

    audit_event_id UUID PRIMARY KEY,

    event_code VARCHAR(100) NOT NULL,

    event_name VARCHAR(255) NOT NULL,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_audit_event_code
        UNIQUE(event_code)
);

-- ==========================================
-- AUDIT LOGS
-- ==========================================

CREATE TABLE audit_logs (

    audit_log_id UUID PRIMARY KEY,

    user_id UUID,

    audit_event_id UUID,

    entity_type VARCHAR(100) NOT NULL,

    entity_id UUID,

    action audit_action NOT NULL,

    old_values JSONB,

    new_values JSONB,

    ip_address VARCHAR(100),

    user_agent TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_audit_log_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_audit_log_event
        FOREIGN KEY (audit_event_id)
        REFERENCES audit_events(audit_event_id)
        ON DELETE SET NULL
);

-- ==========================================
-- LOGIN AUDIT LOGS
-- ==========================================

CREATE TABLE login_audit_logs (

    login_audit_log_id UUID PRIMARY KEY,

    user_id UUID,

    login_time TIMESTAMPTZ,

    logout_time TIMESTAMPTZ,

    login_status login_status NOT NULL,

    ip_address VARCHAR(100),

    user_agent TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_login_audit_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_logout_after_login
        CHECK (
            logout_time IS NULL
            OR logout_time >= login_time
        )
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_audit_logs_user
ON audit_logs(user_id);

CREATE INDEX idx_audit_logs_event
ON audit_logs(audit_event_id);

CREATE INDEX idx_audit_logs_entity
ON audit_logs(entity_type, entity_id);

CREATE INDEX idx_audit_logs_action
ON audit_logs(action);

CREATE INDEX idx_audit_logs_created_at
ON audit_logs(created_at);

CREATE INDEX idx_login_audit_logs_user
ON login_audit_logs(user_id);

CREATE INDEX idx_login_audit_logs_status
ON login_audit_logs(login_status);

CREATE INDEX idx_login_audit_logs_login_time
ON login_audit_logs(login_time);